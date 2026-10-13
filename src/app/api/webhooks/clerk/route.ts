import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/resend";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET in environment", { status: 500 });
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification error", { status: 400 });
  }

  const eventType = evt.type;

  // Handle user.created
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses?.[0]?.email_address || "";
    const name = `${first_name || ""} ${last_name || ""}`.trim() || "Siswa Irodori";

    try {
      await db.insert(users).values({
        id: id,
        clerkId: id,
        email: email,
        name: name,
        role: "student",
      }).onConflictDoUpdate({
        target: users.clerkId,
        set: { email, name, updatedAt: new Date() },
      });

      console.log(`[Neon Sync] User ${email} created successfully in Neon DB.`);
      
      // Send onboarding welcome email via Resend
      await sendWelcomeEmail(email, name);
    } catch (dbError) {
      console.error("[Neon Sync Error]", dbError);
    }
  }

  // Handle user.updated
  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses?.[0]?.email_address || "";
    const name = `${first_name || ""} ${last_name || ""}`.trim() || "Siswa Irodori";

    try {
      await db.update(users).set({
        email: email,
        name: name,
        updatedAt: new Date(),
      }).where(eq(users.clerkId, id));
    } catch (dbError) {
      console.error("[Neon Sync Error on update]", dbError);
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}

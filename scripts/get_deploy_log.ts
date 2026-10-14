import fs from 'fs';
import path from 'path';

async function checkLog() {
  const configPath = path.join(process.env.APPDATA || '', 'xdg.config', '.wrangler', 'config', 'default.toml');
  const content = fs.readFileSync(configPath, 'utf8');
  const tokenMatch = content.match(/oauth_token\s*=\s*"([^"]+)"/);
  if (!tokenMatch) {
    console.log("Token not found");
    return;
  }
  const token = tokenMatch[1];
  const deploymentId = process.argv[2] || '31596e5e-6471-4cab-b813-934ca2289357';
  const url = `https://api.cloudflare.com/client/v4/accounts/d2bfefe432bd5809cb005011a8bc3847/pages/projects/jp10-outsutsuki/deployments/${deploymentId}/history/logs`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (data.result && data.result.data) {
    const logs = data.result.data.map((l: any) => l.line).join('\n');
    console.log("=== LAST 2500 CHARS OF LOG ===");
    console.log(logs.slice(-2500));
  } else {
    console.log("Response:", JSON.stringify(data));
  }
}

checkLog().catch(console.error);

import fs from 'fs';
import path from 'path';

async function setEnv() {
  const configPath = path.join(process.env.APPDATA || '', 'xdg.config', '.wrangler', 'config', 'default.toml');
  const content = fs.readFileSync(configPath, 'utf8');
  const tokenMatch = content.match(/oauth_token\s*=\s*"([^"]+)"/);
  if (!tokenMatch) return;
  const token = tokenMatch[1];
  const accountId = 'd2bfefe432bd5809cb005011a8bc3847';
  const project = 'jp10-outsutsuki';

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${project}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deployment_configs: {
        production: {
          env_vars: {
            NODE_VERSION: { value: '20' },
            DATABASE_URL: { value: 'postgresql://neondb_owner:npg_IfJ7lCroQ8Ky@ep-withered-hat-b3wywrji-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require' },
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: { value: 'pk_test_c3VpdGFibGUtYWtpdGEtMTE1Ni5jbGVyay5hY2NvdW50cy5kZXYk' },
            CLERK_SECRET_KEY: { value: 'sk_test_99Hg8baQOWu4SVp03yKVEQCSH6dUKF2yOQQnWf2hWb' },
            NEXT_PUBLIC_CLERK_SIGN_IN_URL: { value: '/sign-in' },
            NEXT_PUBLIC_CLERK_SIGN_UP_URL: { value: '/sign-up' }
          }
        },
        preview: {
          env_vars: {
            NODE_VERSION: { value: '20' },
            DATABASE_URL: { value: 'postgresql://neondb_owner:npg_IfJ7lCroQ8Ky@ep-withered-hat-b3wywrji-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require' },
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: { value: 'pk_test_c3VpdGFibGUtYWtpdGEtMTE1Ni5jbGVyay5hY2NvdW50cy5kZXYk' },
            CLERK_SECRET_KEY: { value: 'sk_test_99Hg8baQOWu4SVp03yKVEQCSH6dUKF2yOQQnWf2hWb' },
            NEXT_PUBLIC_CLERK_SIGN_IN_URL: { value: '/sign-in' },
            NEXT_PUBLIC_CLERK_SIGN_UP_URL: { value: '/sign-up' }
          }
        }
      }
    })
  });
  const data = await res.json();
  console.log('Update env result:', data.success, data.errors);
}

setEnv().catch(console.error);

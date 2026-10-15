import fs from 'fs';
import path from 'path';

async function listDeployments() {
  const configPath = path.join(process.env.APPDATA || '', 'xdg.config', '.wrangler', 'config', 'default.toml');
  const content = fs.readFileSync(configPath, 'utf8');
  const tokenMatch = content.match(/oauth_token\s*=\s*"([^"]+)"/);
  if (!tokenMatch) return;
  const token = tokenMatch[1];
  const url = `https://api.cloudflare.com/client/v4/accounts/d2bfefe432bd5809cb005011a8bc3847/pages/projects/jp10-outsutsuki/deployments?per_page=3`;
  
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (data.result) {
    console.log(data.result.map((x: any) => ({
      id: x.id,
      commit: x.deployment_trigger?.metadata?.commit_hash?.slice(0, 7),
      message: x.deployment_trigger?.metadata?.commit_message,
      stage: x.latest_stage?.name,
      status: x.latest_stage?.status,
      created_on: x.created_on
    })));
  } else {
    console.log(data);
  }
}

listDeployments().catch(console.error);

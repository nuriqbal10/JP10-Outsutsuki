class CookieJar {
  cookies: Map<string, string> = new Map();

  setCookies(header: string | null) {
    if (!header) return;
    const parts = header.split(/,(?=[^;]+=[^;]+)/);
    for (const part of parts) {
      const match = part.trim().match(/^([^=;]+)=([^;]*)/);
      if (match) {
        this.cookies.set(match[1].trim(), match[2].trim());
      }
    }
  }

  getCookieString(): string {
    const list: string[] = [];
    for (const [k, v] of this.cookies.entries()) {
      list.push(`${k}=${v}`);
    }
    return list.join('; ');
  }
}

async function fetchWithCookies(url: string, options: any = {}, jar: CookieJar, maxRedirects = 5): Promise<{ res: Response; body: string }> {
  let curUrl = url;
  let curOpts = { ...options };

  for (let i = 0; i < maxRedirects; i++) {
    const headers = new Headers(curOpts.headers || {});
    headers.set('Cookie', jar.getCookieString());
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    curOpts.headers = headers;
    curOpts.redirect = 'manual';

    const res = await fetch(curUrl, curOpts);
    jar.setCookies(res.headers.get('set-cookie'));

    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const loc = res.headers.get('location');
      if (!loc) break;
      curUrl = new URL(loc, curUrl).toString();
      curOpts = { method: 'GET' };
      continue;
    }

    const body = await res.text();
    return { res, body };
  }
  throw new Error('Too many redirects');
}

async function readBab1Details() {
  const jar = new CookieJar();
  const loginUrl = 'https://elearning-jp.ipi.ac.id/login/index.php';

  const { body: loginHtml } = await fetchWithCookies(loginUrl, {}, jar);
  const tokenMatch = loginHtml.match(/name="logintoken" value="([^"]+)"/);
  const logintoken = tokenMatch ? tokenMatch[1] : '';

  const params = new URLSearchParams();
  params.append('username', 'inr001');
  params.append('password', 'iPi-inr001');
  if (logintoken) params.append('logintoken', logintoken);

  await fetchWithCookies(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  }, jar);

  // 1. Modul Irodori A2-2 Bab 1 (mod/page/view.php?id=126)
  console.log('=== MEMERIKSA ISI MODUL A2-2 BAB 1 ===');
  const { body: modulHtml } = await fetchWithCookies('https://elearning-jp.ipi.ac.id/mod/page/view.php?id=126', {}, jar);
  // cari video iframe / pdf embed / content
  const iframes = [...modulHtml.matchAll(/<iframe[^>]*src="([^"]+)"[^>]*>/gi)].map(m => m[1]);
  console.log('Iframe embeds (video/drive/pdf):', iframes);
  const audioTags = [...modulHtml.matchAll(/<audio[^>]*src="([^"]+)"[^>]*>/gi)].map(m => m[1]);
  console.log('Audio tags:', audioTags);
  const imgTags = [...modulHtml.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/gi)].map(m => m[1]);
  console.log('Image count:', imgTags.length, 'Sample:', imgTags.slice(0, 3));

  // 2. Kotoba Irodori A2-2 Bab 1 (mod/page/view.php?id=127)
  console.log('\n=== MEMERIKSA ISI KOTOBA A2-2 BAB 1 ===');
  const { body: kotobaHtml } = await fetchWithCookies('https://elearning-jp.ipi.ac.id/mod/page/view.php?id=127', {}, jar);
  const kIframes = [...kotobaHtml.matchAll(/<iframe[^>]*src="([^"]+)"[^>]*>/gi)].map(m => m[1]);
  console.log('Kotoba Iframes:', kIframes);

  // 3. Latihan Soal Irodori A2-2 Bab 1 (mod/quiz/view.php?id=128)
  console.log('\n=== MEMERIKSA LATIHAN SOAL A2-2 BAB 1 ===');
  const { body: quizHtml } = await fetchWithCookies('https://elearning-jp.ipi.ac.id/mod/quiz/view.php?id=128', {}, jar);
  const quizInfo = [...quizHtml.matchAll(/class="quizinfo"[^>]*>([\s\S]*?)<\/div>/gi)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  console.log('Aturan Latihan Soal:', quizInfo);
  const attemptBtn = quizHtml.match(/value="(Start attempt|Attempt quiz now|Preview quiz now|Re-attempt quiz)"/i) || quizHtml.match(/class="btn btn-primary"[^>]*>([^<]+)</i);
  console.log('Tombol Quiz:', attemptBtn ? attemptBtn[1] : 'None');
}

readBab1Details().catch(console.error);

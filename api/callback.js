export default async function handler(req, res) {
  const { code } = req.query;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'https://amelia-proxy.vercel.app/api/callback',
      grant_type: 'authorization_code'
    })
  });
  const tokens = await response.json();
  const redirectUrl = `https://amelia-proxy.vercel.app?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token || ''}`;
  res.redirect(redirectUrl);
}

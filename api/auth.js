export default function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: 'https://amelia-proxy.vercel.app/api/callback',
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    access_type: 'offline',
    prompt: 'consent'
  });
  
  // Debug: show what we're sending
  res.json({
    client_id: clientId,
    client_id_length: clientId ? clientId.length : 0,
    redirect_uri: 'https://amelia-proxy.vercel.app/api/callback',
    auth_url: `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  const now = new Date();
  const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  try {
    // First get all calendars
    const calListRes = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const calList = await calListRes.json();
    const calendars = calList.items || [];

    // Fetch events from all calendars
    const allEvents = [];
    for (const cal of calendars) {
      try {
        const eventsRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?` +
          `timeMin=${now.toISOString()}&timeMax=${threeMonthsLater.toISOString()}&singleEvents=true&orderBy=startTime&maxResults=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const eventsData = await eventsRes.json();
        if (eventsData.items) {
          eventsData.items.forEach(item => {
            item._calendarName = cal.summary;
            item._calendarColor = cal.backgroundColor || '#C4907A';
          });
          allEvents.push(...(eventsData.items || []));
        }
      } catch(e) {}
    }

    // Sort by start time
    allEvents.sort((a, b) => {
      const aStart = a.start.dateTime || a.start.date;
      const bStart = b.start.dateTime || b.start.date;
      return new Date(aStart) - new Date(bStart);
    });

    res.status(200).json({ items: allEvents });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}

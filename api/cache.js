// Vercel Serverless cache for Hospitality Dashboard
// Stores/serves a 12-month reservations snapshot in Supabase (server-side with service role)

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return { url, key };
}

function sbHeaders(key, extra = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const venueId = parseInt(req.query.venueId || req.body?.venueId || '0', 10);
  if (!venueId) return res.status(400).json({ error: 'Missing venueId' });

  const kind = (req.query.kind || req.body?.kind || 'reservations').toString();
  const safeKind = kind.replace(/[^a-z0-9_\-]/gi, '').slice(0, 40) || 'reservations';
  const cacheKey = `${safeKind}_12m_v1_${venueId}`;

  try {
    const { url, key } = supabaseConfig();

    if (req.method === 'GET') {
      const qs = new URLSearchParams({
        select: 'cache_key,venue_id,range_start,range_end,fetched_at,payload',
        cache_key: `eq.${cacheKey}`,
        venue_id: `eq.${venueId}`,
        limit: '1',
      });
      const r = await fetch(`${url}/rest/v1/hospitality_cache?${qs.toString()}`, {
        headers: sbHeaders(key),
      });
      if (!r.ok) return res.status(500).json({ error: await r.text() });
      const rows = await r.json();
      const record = rows?.[0] || null;
      return res.status(200).json({ hit: !!record, record });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const payload = body.payload;
      const rangeStart = body.rangeStart;
      const rangeEnd = body.rangeEnd;
      const fetchedAt = body.fetchedAt || new Date().toISOString();

      if (!payload || !rangeStart || !rangeEnd) {
        return res.status(400).json({ error: 'Missing payload/rangeStart/rangeEnd' });
      }

      const upsertBody = {
        cache_key: cacheKey,
        venue_id: venueId,
        range_start: rangeStart,
        range_end: rangeEnd,
        fetched_at: fetchedAt,
        payload,
      };

      const r = await fetch(`${url}/rest/v1/hospitality_cache`, {
        method: 'POST',
        headers: sbHeaders(key, {
          Prefer: 'resolution=merge-duplicates,return=representation',
        }),
        body: JSON.stringify(upsertBody),
      });
      if (!r.ok) return res.status(500).json({ error: await r.text() });
      const rows = await r.json();
      return res.status(200).json({ ok: true, saved: rows?.[0] || null });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

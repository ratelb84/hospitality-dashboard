// Vercel Serverless cache for Hospitality Dashboard
// Stores/serves a 12-month reservations snapshot in Supabase (server-side with service role)

const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const venueId = parseInt(req.query.venueId || req.body?.venueId || '0', 10);
  if (!venueId) return res.status(400).json({ error: 'Missing venueId' });

  const cacheKey = `reservations_12m_v1_${venueId}`;

  try {
    const sb = getSupabase();

    if (req.method === 'GET') {
      const { data, error } = await sb
        .from('hospitality_cache')
        .select('cache_key, venue_id, range_start, range_end, fetched_at, payload')
        .eq('cache_key', cacheKey)
        .eq('venue_id', venueId)
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ hit: !!data, record: data || null });
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

      const { data, error } = await sb
        .from('hospitality_cache')
        .upsert(
          {
            cache_key: cacheKey,
            venue_id: venueId,
            range_start: rangeStart,
            range_end: rangeEnd,
            fetched_at: fetchedAt,
            payload,
          },
          { onConflict: 'cache_key,venue_id' }
        )
        .select('cache_key, venue_id, range_start, range_end, fetched_at')
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true, saved: data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

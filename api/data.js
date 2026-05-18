// Vercel Serverless Function: Edge Cached Data API
// Route: /api/data
// This endpoint fetches all required tables from Supabase and caches the result on Vercel's Edge Network.
// This prevents thousands of direct client connections to Supabase.

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hesrhmyqtcivzcvaebvf.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhlc3JobXlxdGNpdnpjdmFlYnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjE0MzMsImV4cCI6MjA5MDE5NzQzM30.cAza33BM21FhacJ-AM7ZQCIMBFxjWxkeu-hn2zIjcyY';

async function fetchTable(table) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=*`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  if (!response.ok) {
    console.error(`Failed to fetch ${table}: ${response.statusText}`);
    return [];
  }
  return await response.json();
}

export default async function handler(req, res) {
  try {
    // Fetch all tables concurrently
    const [
      settings,
      projects,
      departments,
      teams,
      members,
      awards,
      collaborators,
      sponsors,
      media,
      hof
    ] = await Promise.all([
      fetchTable('csg_settings'),
      fetchTable('csg_projects'),
      fetchTable('csg_departments'),
      fetchTable('csg_teams'),
      fetchTable('csg_members'),
      fetchTable('csg_awards'),
      fetchTable('csg_collaborators'),
      fetchTable('csg_sponsors'),
      fetchTable('csg_media'),
      fetchTable('csg_hall_of_fame'),
    ]);

    const responseData = {
      settings,
      projects,
      departments,
      teams,
      members,
      awards,
      collaborators,
      sponsors,
      media,
      hof
    };

    // Cache the response on Vercel CDN for 1 hour (3600 seconds)
    // stale-while-revalidate allows serving stale content while fetching fresh content in the background
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json');
    
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('API Data fetch error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

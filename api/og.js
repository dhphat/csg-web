// Vercel Serverless Function: Dynamic OG Meta Tags for Social Sharing
// Routes: /project/:id and /department/:id
//
// How it works:
// 1. ALL requests to these routes go through this function (via vercel.json rewrites)
// 2. For social media crawlers → returns HTML with correct OG tags from Supabase
// 3. For normal browsers → fetches the actual static page from Vercel CDN and returns it

const SUPABASE_URL = 'https://hesrhmyqtcivzcvaebvf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhlc3JobXlxdGNpdnpjdmFlYnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjE0MzMsImV4cCI6MjA5MDE5NzQzM30.cAza33BM21FhacJ-AM7ZQCIMBFxjWxkeu-hn2zIjcyY';
const DEFAULT_OG_IMAGE = 'https://i.ibb.co/xkr0QFB/csg-thumb.jpg';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isCrawler(userAgent) {
  if (!userAgent) return false;
  const bots = [
    'facebookexternalhit', 'Facebot', 'Twitterbot', 'LinkedInBot',
    'Slackbot', 'Discordbot', 'WhatsApp', 'TelegramBot', 'Zalo',
    'viber', 'Pinterest', 'Googlebot', 'bingbot', 'Baiduspider',
    'Applebot', 'Embedly', 'Showyoubot', 'outbrain', 'vkShare',
    'W3C_Validator', 'redditbot', 'Mediapartners-Google',
    'AdsBot-Google', 'parsely', 'Iframely',
  ];
  return bots.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
}

async function fetchSupabase(table, id, select) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=${select}`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  const data = await response.json();
  return (data && data.length > 0) ? data[0] : null;
}

function injectMetaTags(html, { ogTitle, ogImage, ogDescription, ogUrl }) {
  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(ogTitle)}</title>`);

  // Replace og:image  
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`
  );
  // Replace twitter:image
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`
  );

  // Replace description
  if (ogDescription) {
    html = html.replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(ogDescription)}" />`
    );
  }

  // Inject additional OG tags before </head>
  const ogTags = `
  <meta property="og:title" content="${escapeHtml(ogTitle)}" />
  <meta property="og:description" content="${escapeHtml(ogDescription)}" />
  <meta property="og:url" content="${escapeHtml(ogUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Cóc Sài Gòn" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(ogTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(ogDescription)}" />
`;
  html = html.replace('</head>', ogTags + '</head>');

  return html;
}

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const pathParts = url.pathname.split('/').filter(Boolean);

  if (pathParts.length < 2) {
    return res.status(404).send('Not Found');
  }

  const type = pathParts[0]; // 'project' or 'department'
  const id = pathParts[1];
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${protocol}://${host}`;
  const fullUrl = `${baseUrl}${url.pathname}`;

  // Determine which static HTML page to fetch
  let staticPage;
  if (type === 'project') {
    staticPage = '/project-detail';
  } else if (type === 'department') {
    staticPage = '/department';
  } else {
    return res.status(404).send('Not Found');
  }

  // Fetch the actual static HTML page from Vercel CDN
  // Use __og_bypass header to prevent recursive function calls
  let html;
  try {
    const staticRes = await fetch(`${baseUrl}${staticPage}`, {
      headers: { 'x-og-bypass': '1' },
    });
    html = await staticRes.text();
  } catch (e) {
    console.error('Failed to fetch static page:', e);
    return res.status(500).send('Internal Server Error');
  }

  // For non-crawler requests, return static HTML as-is (save Supabase calls)
  const userAgent = req.headers['user-agent'] || '';
  if (!isCrawler(userAgent)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  // === CRAWLER: Fetch data and inject OG tags ===
  let ogTitle = '';
  let ogImage = DEFAULT_OG_IMAGE;
  let ogDescription = '';

  try {
    if (type === 'project') {
      const project = await fetchSupabase('csg_projects', id, 'title,banner,image,subtitle');
      if (project) {
        ogTitle = `${project.title} - Cóc Sài Gòn`;
        ogImage = project.banner || project.image || DEFAULT_OG_IMAGE;
        ogDescription = project.subtitle || `Dự án ${project.title} của CLB Cóc Sài Gòn.`;
      }
    } else if (type === 'department') {
      const dept = await fetchSupabase('csg_departments', id, 'name,thumbnail,image,description');
      if (dept) {
        ogTitle = `${dept.name} - Cóc Sài Gòn`;
        ogImage = dept.thumbnail || dept.image || DEFAULT_OG_IMAGE;
        ogDescription = dept.description
          ? dept.description.substring(0, 200)
          : `${dept.name} - CLB Cóc Sài Gòn`;
      }
    }
  } catch (e) {
    console.error('Supabase fetch error:', e);
  }

  // Inject OG tags if data was found
  if (ogTitle) {
    html = injectMetaTags(html, {
      ogTitle,
      ogImage,
      ogDescription,
      ogUrl: fullUrl,
    });
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}

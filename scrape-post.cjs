// scrape-post.cjs
require('dotenv').config();
const https = require('https');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const Insta = require('scraper-instagram');
const InstaClient = new Insta();

const sid = decodeURIComponent(process.env.IG_SESSIONID);
if (!sid) {
  console.error('Missing IG_SESSIONID in .env');
  process.exit(1);
}

// — helpers
function extractShortcode(input) {
  if (!input) return null;
  if (!input.startsWith('http')) return input.trim();
  try {
    const u = new URL(input);
    const p = u.pathname.split('/').filter(Boolean);
    // /p/{code}/ or /reel/{code}/ or /tv/{code}/
    return p.length >= 2 ? p[1] : null;
  } catch {}
  return null;
}

function uniq(arr) { return Array.from(new Set(arr.filter(Boolean))); }

function summarizeFromGraphQL(json, fallbackShortcode) {
  // Old/new structures: json.graphql.shortcode_media or json.items[0]
  const media = json?.graphql?.shortcode_media || json?.items?.[0];
  if (!media) return null;

  const owner = media.owner || media.user || {};
  const caption =
    media?.edge_media_to_caption?.edges?.[0]?.node?.text ||
    media?.caption?.text ||
    media?.caption ||
    null;

  // collect media
  const urls = [];
  if (media.display_url) urls.push(media.display_url);
  if (media.video_url) urls.push(media.video_url);

  const edges =
    media?.edge_sidecar_to_children?.edges ||
    media?.carousel_media ||
    [];
  for (const e of edges) {
    const n = e?.node || e;
    if (n?.display_url) urls.push(n.display_url);
    if (n?.video_url) urls.push(n.video_url);
    if (n?.image_versions2?.candidates?.length) {
      urls.push(n.image_versions2.candidates[0].url);
    }
  }

  return {
    id: media.id,
    shortcode: media.shortcode || fallbackShortcode,
    username: owner.username,
    caption,
    isVideo: !!(media.is_video ?? media.isVideo),
    takenAt: media.taken_at_timestamp ?? media.taken_at ?? null,
    likes: media.edge_media_preview_like?.count ?? media.like_count ?? null,
    comments: media.edge_media_to_comment?.count ?? media.comment_count ?? null,
    mediaUrls: uniq(urls),
    link: `https://www.instagram.com/p/${media.shortcode || fallbackShortcode}/`,
  };
}

async function fetchViaJsonEndpoint(shortcode, cookie) {
  const url = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;
  const res = await fetch(url, {
    redirect: 'manual',
    headers: {
      'Cookie': `sessionid=${cookie};`,
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json,text/html;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    // Avoid TLS weirdness in some environments:
    agent: new https.Agent({ keepAlive: true }),
  });

  if (res.status === 302 || res.status === 301) {
    throw new Error(`Fallback endpoint redirected (${res.status}). Cookie likely not honored for that route.`);
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Fallback fetch failed ${res.status}: ${txt.slice(0, 200)}`);
  }
  const json = await res.json();
  return summarizeFromGraphQL(json, shortcode);
}

(async () => {
  const arg = process.argv[2];
  const shortcode = extractShortcode(arg);
  if (!shortcode) {
    console.error('Usage: node scrape-post.cjs <instagram-post-url-or-shortcode>');
    process.exit(1);
  }

  try {
    // 1) authenticate with your valid cookie
    await InstaClient.authBySessionId(sid);

    // 2) primary attempt through the library
    let post;
    try {
      post = await InstaClient.getPost(shortcode);
    } catch (e) {
      // swallow and use fallback
      post = null;
    }

    if (!post || (post.status && String(post.status).startsWith('3'))) {
      // 3) fallback: hit JSON endpoint directly with your cookie
      const summary = await fetchViaJsonEndpoint(shortcode, sid);
      if (!summary) throw new Error('Could not parse JSON payload for this post.');
      console.log('=== Summary (fallback) ===');
      console.log(JSON.stringify(summary, null, 2));
      return;
    }

    // If library worked, normalize like before
    const mediaUrls = [];
    if (post?.display_url) mediaUrls.push(post.display_url);
    if (post?.video_url) mediaUrls.push(post.video_url);
    const edges =
      post?.edge_sidecar_to_children?.edges ||
      post?.sidecar?.edges ||
      post?.carousel_media ||
      [];
    for (const e of edges) {
      const n = e?.node || e;
      if (n?.display_url) mediaUrls.push(n.display_url);
      if (n?.video_url) mediaUrls.push(n.video_url);
      if (n?.image_versions2?.candidates?.length) {
        mediaUrls.push(n.image_versions2.candidates[0].url);
      }
    }

    const summary = {
      id: post?.id,
      shortcode: post?.shortcode || shortcode,
      username: post?.owner?.username || post?.user?.username,
      caption: post?.caption?.text ?? post?.caption ?? null,
      isVideo: !!(post?.is_video ?? post?.isVideo),
      takenAt: post?.taken_at_timestamp ?? post?.takenAt ?? null,
      likes: post?.edge_media_preview_like?.count ?? post?.likes ?? null,
      comments: post?.edge_media_to_comment?.count ?? post?.comments ?? null,
      mediaUrls: uniq(mediaUrls),
      link: `https://www.instagram.com/p/${post?.shortcode || shortcode}/`,
    };

    console.log('=== Summary ===');
    console.log(JSON.stringify(summary, null, 2));
  } catch (err) {
    console.error('Failed:', err.message || err);
    process.exit(1);
  }
})();

/**
 * TattooNOW Show — Script Generator
 *
 * Reads episode data from Google Sheets (via n8n webhook or direct API),
 * fills the script template, and optionally sends to Claude API for
 * AI-assisted expansion.
 *
 * Usage:
 *   node generate-script.js --episode 1
 *   node generate-script.js --episode 1 --ai    (AI-assisted expansion)
 *   node generate-script.js --data episode.json  (from local JSON)
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CONFIG = {
  n8nBaseUrl: 'https://tn.reinventingai.com/webhook',
  episodeWebhook: '5af3d2be-32f0-4d9d-8dfb-fb5053844eb4',
  templatePath: path.join(__dirname, 'script-template.md'),
  systemPromptPath: path.join(__dirname, 'system-prompt.md'),
  outputDir: path.join(__dirname, '..', 'output', 'scripts'),
};

// ---------------------------------------------------------------------------
// Placeholder Mapping
// ---------------------------------------------------------------------------

const PLACEHOLDERS = {
  '{{EPISODE_NUMBER}}':        (d) => d.episodeNumber,
  '{{EPISODE_TITLE}}':         (d) => d.episodeTitle,
  '{{AIR_DATE}}':              (d) => d.airDate,
  '{{GUEST_NAME}}':            (d) => d.guestName || 'TBD',
  '{{GUEST_HEADSHOT}}':        (d) => d.guestHeadshot || '',
  '{{GUEST_BIO}}':             (d) => d.guestBio || '',
  '{{GUEST_STYLE}}':           (d) => d.guestStyle || '',
  '{{GUEST_SINCE}}':           (d) => d.guestSince || '',
  '{{GUEST_STUDIO}}':          (d) => d.guestStudio || '',
  '{{GUEST_LOCATION}}':        (d) => d.guestLocation || '',
  '{{THEME}}':                 (d) => d.theme || '',
  '{{TALKING_POINTS}}':        (d) => formatTalkingPoints(d.talkingPoints),
  '{{QA_TOPIC}}':              (d) => d.qaTopic || '',
  '{{CTA}}':                   (d) => d.callToAction || '',
  '{{SOURCE_PRESENTATION}}':   (d) => d.presentationSource || '',
  '{{SOURCE_SLIDE}}':          (d) => d.sourceSlides || '',
  '{{SPONSOR}}':               (d) => d.sponsor || 'None',
  '{{SPONSOR2}}':              (d) => d.sponsor2 || '',
  '{{SPONSOR_FRESH_POST}}':    (d) => d.sponsorFreshPost || '',
  '{{SPONSOR2_FRESH_POST}}':   (d) => d.sponsor2FreshPost || '',
  '{{TECH_FEATURE}}':          (d) => d.techFeature || 'TattooNOW tool/feature demo related to today\'s theme',
  '{{INDUSTRY_NEWS}}':         (d) => formatIndustryNews(d.industryNews),
  '{{EVENT_DETAILS}}':         (d) => d.eventDetails || 'No event details this week',
  '{{SPECIAL_SEGMENT_TITLE}}': (d) => d.specialSegmentTitle || '(none scheduled)',
  '{{SPECIAL_SEGMENT_TYPE}}':  (d) => d.specialSegmentType || '',
  '{{SPECIAL_SEGMENT_NOTES}}': (d) => d.specialSegmentNotes || '',
  '{{NEXT_TITLE}}':            (d) => d.nextTitle || 'TBD',
  '{{NEXT_GUEST}}':            (d) => d.nextGuest || 'TBD',
  '{{AFFILIATE_LINKS}}':       (d) => formatAffiliateLinks(d.affiliateLinks),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTalkingPoints(points) {
  if (!points) return '  → [No talking points provided]';
  if (typeof points === 'string') {
    return points
      .split(/\n|;/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `  → ${p}`)
      .join('\n');
  }
  if (Array.isArray(points)) {
    return points.map((p) => `  → ${p}`).join('\n');
  }
  return `  → ${String(points)}`;
}

function formatIndustryNews(news) {
  if (!news) return '  → [No industry news this week]';
  if (typeof news === 'string') {
    return news
      .split(/\n|;/)
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => `  → ${n}`)
      .join('\n');
  }
  if (Array.isArray(news)) {
    return news.map((n) => `  → ${n}`).join('\n');
  }
  return `  → ${String(news)}`;
}

function formatAffiliateLinks(links) {
  if (!links || !Array.isArray(links) || links.length === 0) return 'None';
  return links
    .map(
      (l) =>
        `- ${l.partnerName}: https://longevity.tattoonow.com/tattoonow-home?am_id=${l.amId}${l.couponCode ? `&coupon_code=${l.couponCode}` : ''}`
    )
    .join('\n');
}

function calculateExperience(yearStarted) {
  if (!yearStarted) return '';
  const years = new Date().getFullYear() - parseInt(yearStarted, 10);
  return `${years} years`;
}

// ---------------------------------------------------------------------------
// Fetch episode data from n8n webhook
// ---------------------------------------------------------------------------

async function fetchEpisodeData(episodeNumber) {
  const url = `${CONFIG.n8nBaseUrl}/${CONFIG.episodeWebhook}?action=episode&episodeNumber=${episodeNumber}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch episode data: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// Fill template with episode data
// ---------------------------------------------------------------------------

function fillTemplate(template, episodeData) {
  let filled = template;
  for (const [placeholder, resolver] of Object.entries(PLACEHOLDERS)) {
    const value = resolver(episodeData);
    filled = filled.replaceAll(placeholder, value);
  }
  return filled;
}

// ---------------------------------------------------------------------------
// AI-assisted script expansion (Claude API via n8n or direct)
// ---------------------------------------------------------------------------

async function expandWithAI(filledScript, systemPrompt) {
  // This would call Claude API to expand the filled template into a full script.
  // In production, this runs as an n8n AI node. Here we provide the structure
  // for local/CLI usage.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set — returning template without AI expansion');
    return filledScript;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Expand this run-of-show template into a full conversational script for the host. Keep all timestamps and structure, but flesh out the talking points, transitions, and host dialogue.\n\n${filledScript}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    console.warn(`AI expansion failed: ${response.status} — returning template`);
    return filledScript;
  }

  const result = await response.json();
  return result.content[0].text;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--episode') flags.episode = args[++i];
    if (args[i] === '--data') flags.dataFile = args[++i];
    if (args[i] === '--ai') flags.ai = true;
    if (args[i] === '--output') flags.output = args[++i];
  }

  // Load episode data
  let episodeData;
  if (flags.dataFile) {
    episodeData = JSON.parse(fs.readFileSync(flags.dataFile, 'utf-8'));
  } else if (flags.episode) {
    episodeData = await fetchEpisodeData(flags.episode);
  } else {
    console.error('Usage: node generate-script.js --episode <number> | --data <file.json> [--ai] [--output <path>]');
    process.exit(1);
  }

  // Load template
  const template = fs.readFileSync(CONFIG.templatePath, 'utf-8');

  // Fill template
  let script = fillTemplate(template, episodeData);

  // Optional AI expansion
  if (flags.ai) {
    const systemPrompt = fs.readFileSync(CONFIG.systemPromptPath, 'utf-8');
    script = await expandWithAI(script, systemPrompt);
  }

  // Output
  if (flags.output) {
    fs.mkdirSync(path.dirname(flags.output), { recursive: true });
    fs.writeFileSync(flags.output, script);
    console.log(`Script written to ${flags.output}`);
  } else {
    const outputPath = path.join(CONFIG.outputDir, `episode-${episodeData.episodeNumber || 'draft'}.md`);
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    fs.writeFileSync(outputPath, script);
    console.log(`Script written to ${outputPath}`);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

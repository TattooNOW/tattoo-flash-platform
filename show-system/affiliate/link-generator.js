/**
 * TattooNOW Show — Affiliate Link Generator
 *
 * Generates unique affiliate links for all active partners per episode.
 * Used by n8n post-show-processing workflow and can be run standalone.
 *
 * Usage:
 *   node link-generator.js --episode 1
 *   node link-generator.js --partners partners.json --episode 1
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CONFIG = {
  baseUrl: 'https://longevity.tattoonow.com/tattoonow-home',
  n8nBaseUrl: 'https://tn.reinventingai.com/webhook',
  affiliateWebhook: '5af3d2be-32f0-4d9d-8dfb-fb5053844eb4',
  outputDir: path.join(__dirname, '..', 'output', 'affiliate-links'),
};

// ---------------------------------------------------------------------------
// Link Generation
// ---------------------------------------------------------------------------

/**
 * Generate a single affiliate link for a partner.
 * @param {string} amId - Partner's affiliate tracking ID
 * @param {string} [couponCode] - Optional coupon code
 * @returns {string} Full affiliate URL
 */
function generateAffiliateLink(amId, couponCode) {
  const url = new URL(CONFIG.baseUrl);
  url.searchParams.set('am_id', amId);
  if (couponCode) {
    url.searchParams.set('coupon_code', couponCode);
  }
  return url.toString();
}

/**
 * Generate YouTube referral link for a partner.
 * @param {string} youtubeUrl - Episode YouTube URL
 * @param {string} amId - Partner's affiliate tracking ID
 * @returns {string} YouTube URL with referral param
 */
function generateYouTubeReferral(youtubeUrl, amId) {
  if (!youtubeUrl || youtubeUrl === 'TBD') return 'TBD';
  const url = new URL(youtubeUrl);
  url.searchParams.set('ref', amId);
  return url.toString();
}

/**
 * Generate the affiliate-links.md file content for an episode.
 * @param {number} episodeNumber - Episode number
 * @param {string} episodeTitle - Episode title
 * @param {Array} partners - Active affiliate partners
 * @param {string} [youtubeUrl] - Episode YouTube URL
 * @returns {string} Markdown content
 */
function generateAffiliateLinksDoc(episodeNumber, episodeTitle, partners, youtubeUrl) {
  let md = `# Episode ${episodeNumber}: ${episodeTitle} — Affiliate Links\n\n`;
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `---\n\n`;

  for (const partner of partners) {
    const mainLink = generateAffiliateLink(partner.amId, partner.couponCode);
    const ytLink = generateYouTubeReferral(youtubeUrl, partner.amId);

    md += `## ${partner.partnerName}\n`;
    md += `- **Type**: ${partner.partnerType} (${partner.agreementType})\n`;
    md += `- **Main link**: ${mainLink}\n`;
    md += `- **Episode direct**: ${ytLink}\n`;

    if (partner.couponCode) {
      md += `- **Coupon code**: \`${partner.couponCode}\`\n`;
    }

    if (partner.socialHandles) {
      md += `- **Social**: ${partner.socialHandles}\n`;
    }

    md += `\n`;
  }

  md += `---\n\n`;
  md += `## Suggested Social Copy\n\n`;
  md += `> Check out the latest TattooNOW Show! Episode ${episodeNumber}: ${episodeTitle}\n`;
  md += `> Watch here: ${youtubeUrl || '[YouTube URL TBD]'}\n`;
  md += `> \n`;
  md += `> Ready to level up your tattoo business?\n`;
  md += `> [Partner: insert your affiliate link from above]\n`;

  return md;
}

// ---------------------------------------------------------------------------
// Fetch partners from n8n
// ---------------------------------------------------------------------------

async function fetchActivePartners() {
  const url = `${CONFIG.n8nBaseUrl}/${CONFIG.affiliateWebhook}?action=affiliatePartners&active=true`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch partners: ${response.status}`);
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--episode') flags.episode = args[++i];
    if (args[i] === '--title') flags.title = args[++i];
    if (args[i] === '--youtube') flags.youtube = args[++i];
    if (args[i] === '--partners') flags.partnersFile = args[++i];
    if (args[i] === '--output') flags.output = args[++i];
  }

  if (!flags.episode) {
    console.error('Usage: node link-generator.js --episode <number> [--title <title>] [--youtube <url>] [--partners <file>] [--output <path>]');
    process.exit(1);
  }

  // Load partners
  let partners;
  if (flags.partnersFile) {
    partners = JSON.parse(fs.readFileSync(flags.partnersFile, 'utf-8'));
  } else {
    partners = await fetchActivePartners();
  }

  // Generate doc
  const doc = generateAffiliateLinksDoc(
    flags.episode,
    flags.title || `Episode ${flags.episode}`,
    partners,
    flags.youtube
  );

  // Output
  const outputPath = flags.output || path.join(CONFIG.outputDir, `episode-${flags.episode}-affiliate-links.md`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, doc);
  console.log(`Affiliate links written to ${outputPath}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

# CLAUDE.md - TattooNOW Weekly Show System

## Project Overview

Production pipeline for "The TattooNOW Show" — a 60-minute weekly variety show (Ed Sullivan meets tattoo industry). The system handles data collection, script generation, slide deck automation, talent management, marketing cadence, and affiliate cross-promotion.

## Show Identity

- **Name**: The TattooNOW Show
- **Format**: 60-minute weekly variety show
- **Recording**: Live on Wednesdays
- **Release**: Lightly edited, Thursday-Friday optimal window
- **Channel**: youtube.com/@tattoonowgabe (15+ year channel)
- **GHL Module**: WS. Weekly Show (Module ID: WS)
- **Host**: Gabe Ripley

## Production Flow

```
Data Input (Spreadsheet + GHL Form)
  → Script Generator (AI-assisted)
    → Google Slides Deck (auto-populated)
      → Pre-Show Marketing (automated social/email)
        → Live Recording (Wednesdays)
          → Post-Show Processing (edit, clips, blog, email)
            → Affiliate Publishing Folder (cross-promote links)
```

## Project Structure

```
show-system/
├── CLAUDE.md                          # This file
├── scripts/
│   ├── generate-script.js             # Script generation engine
│   ├── script-template.md             # 4-act run-of-show template
│   └── system-prompt.md               # AI script generation prompt
├── n8n-workflows/
│   ├── episode-setup.json             # Form → Sheet → Script → Deck
│   ├── pre-show-marketing.json        # Scheduled marketing sequence
│   ├── post-show-processing.json      # Blog, clips, affiliates
│   └── clip-generation.json           # Video clip extraction
├── data-schemas/
│   ├── episode-calendar.json          # Tab 1 schema
│   ├── talent-database.json           # Tab 2 schema
│   ├── content-calendar.json          # Tab 3 schema (52-week)
│   └── affiliate-partners.json        # Tab 4 schema
├── slides/
│   ├── template-config.json           # Slide deck template definition
│   └── placeholder-mapping.json       # Data → slide placeholder map
├── ghl-config/
│   ├── tags.json                      # GHL tag definitions
│   ├── custom-fields.json             # GHL custom field definitions
│   ├── pipeline.json                  # Production pipeline stages
│   ├── workflows.json                 # GHL workflow definitions
│   └── episode-form.json              # Quick Episode Setup form
├── affiliate/
│   ├── folder-structure.md            # Google Drive folder template
│   ├── link-generator.js              # Affiliate link generator
│   └── partner-notification.md        # Email template for partners
├── marketing/
│   ├── pre-show-cadence.json          # Mon-Wed marketing schedule
│   ├── post-show-cadence.json         # Thu-Sun content schedule
│   ├── clip-strategy.json             # Clip extraction strategy
│   └── youtube-optimization.json      # YouTube upload config
└── templates/
    ├── social-captions.md             # Caption templates with hashtags
    ├── newsletter-blurb.md            # Email newsletter template
    └── episode-summary.md             # Blog post template
```

## Brand Standards

| Element         | Value                    |
|-----------------|--------------------------|
| Heading Font    | Roboto Slab              |
| Body Font       | Roboto                   |
| Orange Accent   | `#EA9320`                |
| Dark Background | `#0a0a0a` / `#1a1a1a`   |
| Light Text      | `#fafafa`                |
| Reference Site  | longevity.tattoonow.com  |

## API & Backend

| Service     | Instance                    | Purpose                    |
|-------------|-----------------------------|----------------------------|
| n8n         | tn.reinventingai.com        | Workflow automation        |
| Airtable    | Module WS. Weekly Show      | Data storage               |
| GHL         | GoHighLevel CRM             | Forms, email, social, tags |
| Google      | Sheets + Slides + Drive API | Content & assets           |
| YouTube     | @tattoonowgabe              | Publishing                 |

## Show Catchphrases

- Opening: "Welcome to the big show!"
- Tattoo moment: "Let's make it permanent!"
- Closing: "Keep it clean, keep it bold, we'll see you next week!"

## Affiliate Link Format

```
https://longevity.tattoonow.com/tattoonow-home?am_id=[PARTNER_ID]&coupon_code=[CODE]
```

## GHL Tag Convention

Tags follow: `[MODULE_ID]. [category] function : status`
Module ID for this system: **WS**

## Implementation Phases

1. **Foundation** — Google Sheet, Slides template, GHL form/tags, Drive folders
2. **Script & Slides Automation** — n8n workflows for form → script → deck
3. **Marketing Automation** — Pre/post-show social + email workflows
4. **Affiliate System** — Auto-populate folders, partner notifications
5. **Clip Generation** — Video extraction and Shorts/Reels automation

## Notes

- Year started tattooing: always store the year, calculate experience dynamically
- n8n workflows should be modular (one per function, not one giant workflow)
- Reuse existing IG-to-Blog pipeline patterns for Shotstack, GHL blog, image processing
- Test with Episode 001 data (Google Doc reference exists)

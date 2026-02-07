# CLAUDE.md - Tattoo Flash Design Platform

## Project Overview

Self-contained GHL Custom Code elements for the TattooNOW flash design browsing, selection, and admin system. Each HTML file is a drop-in component for GoHighLevel pages.

## Project Structure

```
tattoo-flash-platform/
├── CLAUDE.md                      # This file
├── tattoo-categories.html         # Category browsing grid
├── tattoo-gallery.html            # "Pick a Tattoo" gallery (customer-facing)
├── tattoo-gallery-admin.html      # Admin dashboard (CRUD for designs)
├── tattoo-design-card.html        # Single design card (thank-you/confirmation pages)
├── faq-schema.html                # FAQ structured data (JSON-LD for SEO)
├── faq-admin-header.html          # FAQ category navigation header
├── faq-schema.js                  # Dynamic FAQ schema generator
└── Tattoo Flash/                  # Flash sheet processing
    ├── cut_flash.py               # Image cropping utility
    ├── upload_designs.py          # Bulk uploader to Airtable via n8n
    ├── cut/                       # Individual cropped design images
    └── *.JPG                      # Source flash sheet images
```

## Page Descriptions

| File | Purpose | Used On |
|------|---------|---------|
| `tattoo-categories.html` | Responsive grid of tattoo style categories with featured images & design counts | Category browsing page |
| `tattoo-gallery.html` | Full gallery with search, filters (size/price/featured), modal details, watermark protection, booking button | "Pick a Tattoo" page |
| `tattoo-gallery-admin.html` | Admin CRUD dashboard - add/edit/delete designs, drag & drop image upload, multi-tab form | Admin/internal page |
| `tattoo-design-card.html` | Single design display for booking confirmations | Thank-you pages |
| `faq-schema.html` | Static JSON-LD FAQPage schema using GHL merge fields | FAQ pages (head injection) |
| `faq-admin-header.html` | Navigation bar across 9 FAQ category pages | FAQ admin pages |
| `faq-schema.js` | Reads GHL FAQ accordion elements from DOM and generates JSON-LD schema dynamically | FAQ pages |

## API & Backend

**n8n Webhook Endpoint:**
`https://reinventing.app.n8n.cloud/webhook/5af3d2be-32f0-4d9d-8dfb-fb5053844eb4`

**Supported Actions:**
| Action | Purpose |
|--------|---------|
| `?action=categories` | Fetch all tattoo categories |
| `?action=designs&locationId=XXX&limit=100` | Fetch designs by location |
| `?action=design&designId=XXX` | Fetch single design |
| `action=uploadImage` | Upload image to GHL Media Gallery |
| `action=createDesign` | Create design record in Airtable |
| `action=updateDesign` | Update existing design |
| `action=deleteDesign` | Delete design record |

**Data Storage:** Airtable (via n8n webhook proxy)
**Image Hosting:** GHL Media Gallery (via webhook)
**Location ID:** Persisted via `localStorage` across all pages

## Brand Colors (TattooNOW)

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Orange | `#fa9101` | CTAs, highlights, accents |
| Orange Dark | `#cd7600` | Hover states |
| Gold | `#F8A507` | Supporting accent |
| Black | `#000000` | Primary background |
| Navy | `#000321` | Deep background alt |
| Teal | `#81e6d9` | Icons, list markers |
| White | `#ffffff` | Text |
| Gray | `#8893A8` | Secondary text |

## Typography

| Element | Font | Fallback |
|---------|------|----------|
| Headlines | Roboto Slab | Arial Black |
| Body | Roboto | Arial |

## Key Configuration Points

### Location ID
Set via one of:
1. `window.TNOW_LOCATION_ID` (page-level)
2. URL param `?locationId=XXX`
3. localStorage (persisted from previous visit)

### Gallery URL (from categories page)
`https://foundations.tattoonow.com/tattoo-flash-designs-page`

### GHL Custom Values Used
- `{{custom_values.02__faq_Nq}}` - FAQ question N
- `{{custom_values.02__faq_Na}}` - FAQ answer N
- `{{custom_values.01__studio__greeting}}` - Studio greeting

## Common Tasks

### Add a new design
Use the admin page (`tattoo-gallery-admin.html`) or the `upload_designs.py` script for bulk uploads.

### Modify gallery appearance
Edit the `<style>` block within the relevant HTML file. All styling is self-contained.

### Add a new category
Categories come from Airtable via the n8n webhook. Add a new category record in Airtable.

### Customize for a new location
Set the `locationId` parameter. All data is filtered by location automatically.

## Important Notes

- Each HTML file is **fully self-contained** (HTML + CSS + JS in one file)
- Files are designed as **GHL Custom Code elements** - paste entire file contents
- **Watermark protection** is built into the gallery (logo tiles + text overlay)
- All API calls go through the **n8n webhook proxy** (never direct to Airtable)
- **Mobile-first** responsive design throughout

# Integration Notes — Show System ↔ Flash Design Platform

The TattooNOW Show System (`show-system/`) is an independent module from the Tattoo Flash Design Platform (root-level HTML files). They share the same repo but are logically separate systems.

## Cross-Reference: Flash Design Database

The show may pull designs from the flash design database for on-air segments:

### Use Cases

1. **Guest Artist Portfolio** — When a guest artist has designs in the flash catalog, their work can be displayed during the Guest Spotlight segment
2. **TattooNOW Tech Corner** — Demos of the flash gallery system may show actual designs from the database
3. **Design of the Week** — Potential recurring segment highlighting a design from the catalog

### How to Access

The flash design API is available via the existing n8n webhook:

```
GET https://tn.reinventingai.com/webhook/5af3d2be-32f0-4d9d-8dfb-fb5053844eb4
```

| Action | Parameters | Purpose |
|--------|-----------|---------|
| `?action=designs&locationId=XXX&limit=10` | locationId, limit | Fetch designs for display |
| `?action=design&designId=XXX` | designId | Fetch a specific design |
| `?action=categories` | — | Fetch style categories |

### Data Flow

```
Show Script (mentions design/artist)
  → n8n workflow fetches design(s) from flash API
    → Design image(s) inserted into episode slide deck
    → Design image(s) included in social graphics (with watermark)
```

### Important Notes

- Flash designs include **watermark protection** — respect this in show assets
- Designs are filtered by **locationId** — ensure the correct location is used
- The flash system's Airtable data is separate from the show system's spreadsheet
- Do NOT modify flash design data from show system workflows — read-only access

## Boundaries

| Concern | Flash System | Show System |
|---------|-------------|-------------|
| Data store | Airtable (flash designs) | Google Sheets (episodes, talent, affiliates) |
| n8n instance | tn.reinventingai.com | tn.reinventingai.com (shared) |
| GHL module | — | WS. Weekly Show |
| HTML pages | Root-level `.html` files | N/A (no customer-facing pages) |
| API endpoint | `5af3d2be-...` (existing) | New webhooks (ws-episode-setup, ws-post-show) |

## Shared Resources

- **n8n instance**: tn.reinventingai.com (both systems use the same instance)
- **Brand colors**: Both follow TattooNOW brand guidelines
- **GHL**: Same GoHighLevel account, different module IDs
- **Image hosting**: GHL Media Gallery (shared)

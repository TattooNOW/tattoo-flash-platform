# Blog Post Template — The TattooNOW Show

This template is used by the n8n post-show-processing workflow to generate blog posts via AI (Claude API). The AI receives the episode data and script, then outputs a blog post following this structure.

---

## Template Structure

```html
<article class="tattoonow-show-recap">

  <h1>The TattooNOW Show #{{EPISODE_NUMBER}}: {{EPISODE_TITLE}}</h1>

  <div class="episode-meta">
    <span class="date">{{RELEASE_DATE}}</span>
    <span class="guest">Featuring {{GUEST_NAME}}</span>
    <span class="theme">{{THEME}}</span>
  </div>

  <div class="video-embed">
    <iframe src="https://www.youtube.com/embed/{{YOUTUBE_VIDEO_ID}}"
            allowfullscreen></iframe>
  </div>

  <h2>Episode Summary</h2>
  <p>{{AI_GENERATED_SUMMARY — 2-3 paragraphs covering the episode's main points}}</p>

  <h2>Meet {{GUEST_NAME}}</h2>
  <div class="guest-spotlight">
    <img src="{{GUEST_HEADSHOT}}" alt="{{GUEST_NAME}}">
    <p><strong>{{GUEST_NAME}}</strong> — {{GUEST_BIO}}</p>
    <ul>
      <li>Style: {{GUEST_STYLE}}</li>
      <li>Studio: {{GUEST_STUDIO}}, {{GUEST_LOCATION}}</li>
      <li>Tattooing since: {{GUEST_SINCE}}</li>
      <li>Follow: <a href="https://instagram.com/{{GUEST_INSTAGRAM}}">{{GUEST_INSTAGRAM}}</a></li>
    </ul>
  </div>

  <h2>Key Takeaways</h2>
  <ol>
    <li>{{TAKEAWAY_1}}</li>
    <li>{{TAKEAWAY_2}}</li>
    <li>{{TAKEAWAY_3}}</li>
    <li>{{TAKEAWAY_4}}</li>
    <li>{{TAKEAWAY_5}}</li>
  </ol>

  <h2>Tech Tip of the Week</h2>
  <p>{{TECH_TIP_EXPANDED}}</p>

  <h2>Upcoming Events</h2>
  <ul>
    <li><strong>Icons & Prodigies</strong> — Venice, Italy | <a href="#">Book Now</a></li>
    <li><strong>Paradise Tattoo Gathering</strong> — Massachusetts | <a href="#">Learn More</a></li>
  </ul>

  <h2>Watch the Full Episode</h2>
  <p><a href="{{YOUTUBE_URL}}" class="cta-button">Watch on YouTube</a></p>

  <div class="next-episode">
    <h3>Next Week</h3>
    <p>Episode {{NEXT_EPISODE_NUMBER}}: <strong>{{NEXT_TITLE}}</strong> with {{NEXT_GUEST}}</p>
  </div>

</article>
```

## Blog Post Styling Notes

- Use brand colors from longevity.tattoonow.com
- Background: `#0a0a0a` or `#1a1a1a`
- Text: `#fafafa`
- Accent/CTA: `#EA9320`
- Headings: Roboto Slab
- Body: Roboto
- CTA buttons: `#EA9320` background, `#0a0a0a` text, rounded corners

## SEO Notes

- Blog title should match YouTube title for cross-linking
- Include guest name and style in meta description
- Alt text on all images
- Internal links to relevant TattooNOW pages
- Schema markup for BlogPosting type

/*
=================================================================
FAQ Page Schema Generator (FAQPage + JSON-LD)
=================================================================
Add as Custom Code element on the FAQ page.
Reads rendered FAQ content from the GHL FAQ accordion elements
and injects structured data for Google rich results.

GHL FAQ structure:
  <div class="faq-separated-child">
    <div class="hl-faq-child-heading">
      <div class="hl-faq-child-head">
        <div class="hl-faq-child-heading-text">Question</div>
      </div>
    </div>
    <div class="hl-faq-child-panel">
      <div class="hl-faq-child-item-text">Answer HTML</div>
    </div>
  </div>
=================================================================
*/

(function () {
  'use strict';

  function stripHTML(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function injectSchema() {
    var items = document.querySelectorAll('.faq-separated-child');
    if (!items.length) return;

    var faqs = [];
    items.forEach(function (el) {
      var qEl = el.querySelector('.hl-faq-child-heading-text');
      var aEl = el.querySelector('.hl-faq-child-item-text');
      if (!qEl || !aEl) return;

      var question = stripHTML(qEl.innerHTML).trim();
      var answer = aEl.innerHTML.trim();

      if (question && answer) {
        faqs.push({ question: question, answer: answer });
      }
    });

    if (!faqs.length) return;

    var schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(function (faq) {
        return {
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        };
      })
    };

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSchema);
  } else {
    injectSchema();
  }
})();

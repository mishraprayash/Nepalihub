import test from 'node:test';
import assert from 'node:assert/strict';

export function sanitizeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

test('sanitizeJsonLd sanitizes < character to prevent HTML script tag injection', () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Nepal SSF Contribution Calculator <script>alert(1)</script>',
    'description': '</script><script>alert("XSS")</script>',
  };

  const sanitized = sanitizeJsonLd(jsonLd);

  assert.strictEqual(sanitized.includes('<'), false);
  assert.strictEqual(sanitized.includes('\\u003c'), true);
  assert.strictEqual(
    sanitized.includes('\\u003cscript>alert(1)\\u003c/script>'),
    true
  );
});

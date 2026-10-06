import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { DOCS, GUIDANCE_NOTES, CAT_META, CLAUSE_GROUPS, PREVIEW_DATA } from '../lib/data.js';
import { docMatchesClause, getRelated } from '../lib/documents.js';

test('migration preserves every source document, guidance note, category, clause, and preview', () => {
  const source = readFileSync(new URL('../ISO42001_Suite_Browser_v1_0.html', import.meta.url), 'utf8');
  for (const [name, data] of Object.entries({ DOCS, GUIDANCE_NOTES, CAT_META, CLAUSE_GROUPS, PREVIEW_DATA })) {
    const start = source.indexOf(`const ${name} = `);
    const end = source.indexOf(';\n', start);
    const original = vm.runInNewContext(`(${source.slice(start + `const ${name} = `.length, end)})`);
    assert.deepEqual(JSON.parse(JSON.stringify(original)), data, name);
  }
  assert.equal(DOCS.length, 153);
  assert.equal(new Set(DOCS.map(doc => doc.id)).size, 153);
});

test('clause filtering matches descendants without mixing clause numbers', () => {
  assert.equal(docMatchesClause({ clause: '6.1.2, A.10.3' }, '6.1'), true);
  assert.equal(docMatchesClause({ clause: '6.1.2, A.10.3' }, 'c6'), true);
  assert.equal(docMatchesClause({ clause: '10.2' }, '1'), false);
  assert.equal(docMatchesClause({ clause: 'A.10.3' }, 'A.1'), false);
});

test('related documents exclude the selected document and include match explanations', () => {
  const related = getRelated(DOCS[0]);
  assert.ok(related.length > 0 && related.length <= 5);
  assert.ok(related.every(item => item.doc.id !== DOCS[0].id && item.reasons.length > 0));
});

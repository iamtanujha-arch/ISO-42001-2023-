import { DOCS, CLAUSE_GROUPS } from './data.js';

export function docMatchesClause(doc, clauseFilter) {
  if (!clauseFilter) return true;
  const raw = (doc.clause || '').toLowerCase();
  // group filter — match any child
  const grp = CLAUSE_GROUPS.find(g => g.id === clauseFilter);
  if (grp) {
    return grp.children.some(c => clauseInDoc(raw, c.toLowerCase()));
  }
  // individual clause
  return clauseInDoc(raw, clauseFilter.toLowerCase());
}

export function clauseInDoc(raw, c) {
  // exact token match: split by comma, check each token contains clause
  const tokens = raw.split(',').map(t => t.trim());
  return tokens.some(t => t === c || t.startsWith(c + '.') || t.startsWith('annex ' + c) || t === 'annex ' + c);
}

export function getChildCount(child) {
  return DOCS.filter(d => clauseInDoc((d.clause||'').toLowerCase(), child.toLowerCase())).length;
}
export function getGroupCount(grp) {
  return DOCS.filter(d => docMatchesClause(d, grp.id)).length;
}

export function getRelated(doc, max=5) {
  const docClauses = (doc.clause||'').split(',').map(c=>c.trim().toLowerCase());
  const scores = DOCS
    .filter(d => d.id !== doc.id)
    .map(d => {
      let score = 0;
      const reasons = [];
      // clause overlap
      const dClauses = (d.clause||'').split(',').map(c=>c.trim().toLowerCase());
      const shared = docClauses.filter(c => dClauses.some(dc => dc === c || dc.startsWith(c+'.') || c.startsWith(dc+'.')));
      if (shared.length > 0) { score += shared.length * 2; reasons.push('clause'); }
      // same category
      if (d.cat === doc.cat) { score += 1; reasons.push('category'); }
      return { doc: d, score, reasons };
    })
    .filter(x => x.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, max);
  return scores;
}


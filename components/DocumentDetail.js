'use client';

import { useState } from 'react';

export default function DocumentDetail({ doc, category, formatLabel, notes, related, hasPreview, onClose, onSelect, onPreview }) {
  const [copyStatus, setCopyStatus] = useState('Copy');
  const structured = (notes || []).map(note => ({ note, match: note.match(/^(Purpose|Who|When|Customise):\s*([\s\S]*)$/i) }));
  async function copyFilename() {
    try {
      await navigator.clipboard.writeText(doc.file);
      setCopyStatus('Copied!');
    } catch {
      setCopyStatus('Copy failed');
    }
  }
  return <aside className="detail-panel" aria-label={`${doc.id} details`}>
    <div className="detail-header" style={{ background: category.color }}>
      <div className="detail-header-top"><div className="detail-id">{doc.id}</div><button className="detail-close" onClick={onClose} aria-label="Close document details" title="Close (Esc)">✕</button></div>
      <div className="detail-title">{doc.title}</div><div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}><div className="detail-cat">{category.label}</div><div className="detail-fmt-badge">{formatLabel}</div></div>
    </div>
    <div className="detail-body">
      <div className="detail-row"><div className="detail-label">Description</div><div className="detail-value">{doc.desc || 'No description available.'}</div></div><hr className="detail-divider" />
      <div className="howto-section"><div className="howto-label">How to Use This Document</div><div className="howto-rows">
        {structured.filter(row => row.match).map(({ note, match }) => <div className="howto-item" key={note}><p className="howto-p"><b>{match[1]}:</b> {match[2]}</p></div>)}
        {!notes?.length && <span className="howto-none">No guidance notes available for this document.</span>}
      </div>{structured.some(row => !row.match) && <div className="howto-xref">{structured.filter(row => !row.match).map(row => row.note).join(' ')}</div>}</div><hr className="detail-divider" />
      <div className="detail-row"><div className="detail-label">Filename</div><div className="detail-file"><span style={{ wordBreak: 'break-all' }}>{doc.file}</span><button className={`copy-btn${copyStatus === 'Copied!' ? ' copied' : ''}`} onClick={copyFilename}>{copyStatus}</button></div></div>
      <div className="detail-meta-strip">v1.0 · {formatLabel} (.{doc.fmt}) · Clause {doc.clause || '—'}</div>
      {hasPreview && <button className="preview-button" onClick={onPreview}>👁 Preview Document</button>}<hr className="detail-divider" />
      <div className="detail-row"><div className="detail-label">Related Documents</div><div className="related-list">
        {related.map(({ doc: item, reasons }) => <button className="related-item" key={item.id} onClick={() => onSelect(item)}><div style={{ flex: 1, minWidth: 0 }}><div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}><span className="related-item-id">{item.id}</span>{reasons.map(reason => <span key={reason} className={`related-badge related-badge-${reason === 'clause' ? 'clause' : 'cat'}`}>{reason === 'clause' ? 'Clause' : 'Category'}</span>)}</div><div className="related-item-title">{item.title}</div><div className="related-item-reason">{item.clause}</div></div></button>)}
        {!related.length && <span>No closely related documents found.</span>}
      </div></div>
    </div>
  </aside>;
}

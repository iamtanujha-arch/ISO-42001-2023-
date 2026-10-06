'use client';

import { useEffect, useRef } from 'react';

export default function DocumentPreview({ doc, data, onClose }) {
  const modal = useRef(null);
  const close = useRef(null);
  const slides = data?.kind === 'slides';
  const pages = slides ? data.pages || [] : data?.html ? [data.html] : [];
  const total = data?.total || pages.length;
  useEffect(() => {
    const previous = document.activeElement;
    close.current?.focus();
    function onKey(event) {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
      if (event.key === 'Tab') {
        const elements = [...modal.current.querySelectorAll('button, a[href], input, [tabindex="0"]')];
        const first = elements[0]; const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener('keydown', onKey, true);
    return () => { document.removeEventListener('keydown', onKey, true); previous?.focus(); };
  }, [onClose]);
  return <div className="preview-overlay open" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="preview-modal" ref={modal} role="dialog" aria-modal="true" aria-labelledby="preview-title">
      <div className="preview-modal-header"><div className="preview-modal-title" id="preview-title">{doc.title}</div><div className="preview-modal-meta">{!pages.length ? '' : slides ? pages.length === total ? `${total} slides` : `Showing ${pages.length} of ${total} slides` : 'Full document'}</div><button ref={close} className="preview-modal-close" onClick={onClose} aria-label="Close preview">✕</button></div>
      {!!pages.length && <div className="preview-modal-notice">ℹ HTML recreation of this {slides ? 'deck' : 'document'}, styled to match — not a render of the original file.{slides && total > pages.length ? ` Showing slides 1–${pages.length} of ${total}.` : ''}</div>}
      <div className="preview-pages">{pages.map((html, index) => <div className="preview-page-wrap" key={index}>{slides && <div className="preview-page-label">Slide {index + 1}</div>}{/* Only trusted, bundled preview markup from the source document is rendered here. */}<div dangerouslySetInnerHTML={{ __html: html }} /></div>)}{!pages.length && <div className="preview-no-data">Preview not available for this document.</div>}</div>
    </div>
  </div>;
}

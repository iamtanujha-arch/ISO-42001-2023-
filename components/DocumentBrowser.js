'use client';

import { useEffect, useRef, useState } from 'react';
import { DOCS, CAT_META, CLAUSE_GROUPS, GUIDANCE_NOTES, PREVIEW_DATA } from '../lib/data';
import { docMatchesClause, getChildCount, getGroupCount, getRelated } from '../lib/documents';
import DocumentDetail from './DocumentDetail';
import DocumentPreview from './DocumentPreview';
import Icon from './Icon';

const formats = { docx: 'Word', xlsx: 'Excel', pptx: 'PowerPoint' };

export default function DocumentBrowser() {
  const [category, setCategory] = useState('all');
  const [format, setFormat] = useState('all');
  const [clause, setClause] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [sort, setSort] = useState('id-asc');
  const searchInput = useRef(null);
  const cards = useRef([]);
  const focusIndex = useRef(-1);
  const query = search.trim().toLowerCase();
  const documents = DOCS.filter(d => (category === 'all' || d.cat === category)
    && (format === 'all' || d.fmt === format) && docMatchesClause(d, clause)
    && (!query || [d.id, d.title, d.clause, d.desc].some(value => value?.toLowerCase().includes(query)))).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'id-desc' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));
  const heading = query ? `"${search.trim()}"` : clause
    ? CLAUSE_GROUPS.find(g => g.id === clause)?.label || `Clause ${clause}`
    : category === 'all' ? 'All Documents' : CAT_META[category].label;

  useEffect(() => {
    function onKey(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); if (!preview) searchInput.current?.focus(); return;
      }
      if (event.key === 'Escape') {
        if (!preview) setSelected(null);
        return;
      }
      if (preview || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) || !documents.length) return;
      const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 0;
      if (direction) {
        event.preventDefault();
        focusIndex.current = Math.max(0, Math.min(focusIndex.current + direction, documents.length - 1));
        cards.current[focusIndex.current]?.focus();
        cards.current[focusIndex.current]?.scrollIntoView({ block: 'nearest' });
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [documents, preview]);

  function chooseCategory(value) {
    setCategory(value); setClause(null); setSelected(null); focusIndex.current = -1;
  }
  function chooseClause(value) {
    setClause(value); setCategory('all'); setSelected(null); focusIndex.current = -1;
  }

  return <div className="app-shell" onContextMenu={event => event.preventDefault()}>
    <header className="topbar">
      <div className="topbar-left"><div className="topbar-logo"><Icon name="shield" size={29} /></div><div>
        <div className="topbar-title">ISO 42001:2023<span>Compliance Suite</span></div>
        <div className="topbar-sub">AI Management System</div>
      </div></div>
      <div className="header-search"><Icon name="search" size={18} /><input ref={searchInput} aria-label="Search documents" placeholder="Search by ID, title, clause, keyword..." autoComplete="off" value={search} onChange={event => {
        setSearch(event.target.value); focusIndex.current = -1;
        if (event.target.value.trim()) { setCategory('all'); setClause(null); }
      }} /><span className="search-shortcut"><kbd>Ctrl</kbd><kbd>K</kbd></span></div>
      <div className="topbar-stats"><div className="stat-pill"><Icon /><div><strong>{DOCS.length}</strong><span>Documents</span></div></div>
        {['docx', 'xlsx'].map(fmt => <div className="stat-pill" key={fmt}><Icon name={fmt === 'docx' ? 'word' : 'sheet'} /><div><strong>{DOCS.filter(d => d.fmt === fmt).length}</strong><span>{formats[fmt]}</span></div></div>)}
        <div className="stat-pill"><Icon name="folder" /><div><strong>{Object.keys(CAT_META).length}</strong><span>Categories</span></div></div>
      </div>
    </header>
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-inner">
          <nav aria-label="Document categories">{['all', ...Object.keys(CAT_META)].map(cat => {
            const docs = DOCS.filter(d => cat === 'all' || d.cat === cat);
            return <button key={cat} className={`nav-item${category === cat && !clause ? ' active' : ''}`} aria-pressed={category === cat && !clause} onClick={() => chooseCategory(cat)}>
              <span className="nav-item-label"><Icon name={({ all: 'document', manual: 'manual', processes: 'processes', templates: 'folder', registers: 'sheet', special: 'special' })[cat] || 'document'} size={18} />{CAT_META[cat]?.label || 'All Documents'}</span>
              <span className="nav-item-right"><span className="nav-count">{docs.length}</span></span>
            </button>;
          })}</nav>
          <div className="clause-section"><div className="sidebar-section">Clauses</div><nav aria-label="ISO clauses">
            {CLAUSE_GROUPS.filter(group => getGroupCount(group)).map(group => <div key={group.id}>
              <button className={`clause-group-header${clause === group.id ? ' active' : ''}`} aria-expanded={!!expanded[group.id]} onClick={() => {
                setExpanded(value => ({ ...value, [group.id]: !value[group.id] })); chooseClause(clause === group.id ? null : group.id);
              }}><span className="clause-group-label"><span className={`clause-expand-icon${expanded[group.id] ? ' open' : ''}`}>▶</span>{group.label}</span><span className="clause-group-count">{getGroupCount(group)}</span></button>
              <div className={`clause-children${expanded[group.id] ? ' open' : ''}`}>{group.children.filter(child => getChildCount(child)).map(child => <button key={child} className={`clause-child${clause === child ? ' active' : ''}`} onClick={() => chooseClause(clause === child ? null : child)}><span>{child}</span><span className="clause-child-count">{getChildCount(child)}</span></button>)}</div>
            </div>)}
          </nav></div>
        </div>
      </aside>
      <main className="main">
        <div className="main-header">
          <div className="main-header-left"><h2>{heading}</h2><p aria-live="polite">{documents.length} document{documents.length !== 1 ? 's' : ''}{format !== 'all' ? ` · ${formats[format]} only` : ''}</p></div>
          <div className="fmt-filter"><span className="grid-indicator" title="Grid view"><Icon name="grid" size={18} /></span>{['all', ...Object.keys(formats)].map(fmt => <button key={fmt} className={`fmt-btn${format === fmt ? ' active' : ''}`} aria-pressed={format === fmt} onClick={() => { setFormat(fmt); focusIndex.current = -1; }}>{fmt === 'all' ? 'All' : formats[fmt]}</button>)}</div>
          <div className="header-tools"><div className="kbd-hint"><span className="kbd">↑↓</span> Navigate <span className="kbd">Enter</span> Open <span className="kbd">Esc</span> Close</div><label className="sort-control"><span>Sort:</span><select aria-label="Sort documents" value={sort} onChange={event => { setSort(event.target.value); focusIndex.current = -1; }}><option value="id-asc">Document ID (A → Z)</option><option value="id-desc">Document ID (Z → A)</option><option value="title">Title (A → Z)</option></select></label></div>
        </div>
        <div className="grid-wrap"><div className="doc-grid">
          {documents.map((doc, index) => <button key={doc.id} ref={element => { cards.current[index] = element; }} className={`doc-card${selected?.id === doc.id ? ' selected' : ''}`}  onFocus={() => { focusIndex.current = index; }} onClick={() => setSelected(doc)}>
            <Icon className={`card-document-icon ${doc.fmt === 'xlsx' ? 'excel-icon' : ''}`} size={23} />
            <span className="card-top"><span className="card-id">{doc.id}</span><span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>{PREVIEW_DATA[doc.id] && <span className="card-preview-badge"><Icon name="eye" size={12} /> Preview</span>}<span className={`card-fmt fmt-${doc.fmt}`}>{doc.fmt}</span></span></span>
            <div className="card-title">{doc.title}</div><div className="card-clause"><Icon size={13} />Clause <span>{doc.clause || '—'}</span></div><span className="card-more"><Icon name="more" size={15} /></span>
          </button>)}
          {!documents.length && <div className="no-results" style={{ gridColumn: '1/-1' }}><h3>No documents found</h3><p>Try a different search, category, or clause filter.</p></div>}
        </div></div>
      </main>
      {selected && <DocumentDetail key={selected.id} doc={selected} category={CAT_META[selected.cat]} formatLabel={formats[selected.fmt]} notes={GUIDANCE_NOTES[selected.id]} related={getRelated(selected)} hasPreview={!!PREVIEW_DATA[selected.id]} onClose={() => setSelected(null)} onSelect={setSelected} onPreview={() => setPreview(selected)} />}
    </div>
    {preview && <DocumentPreview doc={preview} data={PREVIEW_DATA[preview.id]} onClose={() => setPreview(null)} />}
  </div>;
}

export default function Icon({ name = 'document', size = 20, className = '' }) {
  const paths = {
    document: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h4M9 12h6M9 16h6" /></>,
    shield: <><path d="m12 2 9 3v7c0 5-9 10-9 10S3 17 3 12V5z" /><path d="m8 12 3 3 5-6" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    folder: <path d="M3 7V5h7l2 3h9v12H3zM3 8h9" />,
    grid: <><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /></>,
    sheet: <><path d="M5 3h10l4 4v14H5zM15 3v5h4M8 11h8M8 15h8M8 19h8M11 11v8" /></>,
    word: <><path d="M5 4h13v16H5M15 4l-3 16M3 7h5M3 17h5" /><path d="m16 9 2 6 2-6" /></>,
    manual: <><path d="M6 18V7a6 6 0 0 1 12 0v11M6 10H3v8h18v-8h-3M8 22h8" /><path d="M9 6h6M9 10h6" /></>,
    processes: <><circle cx="12" cy="5" r="3" /><path d="M12 8v6M5 14h14M5 14v5M19 14v5M2 19h6v3H2zM16 19h6v3h-6z" /></>,
    special: <><path d="m12 3 7 4v7l-7 7-7-7V7z" /><circle cx="12" cy="8" r="1" /></>,
    more: <><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></>,
    eye: <><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name] || paths.document}</svg>;
}

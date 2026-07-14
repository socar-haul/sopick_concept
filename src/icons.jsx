/* 24x24 스트로크 아이콘 세트 — currentColor 기반 */

const paths = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  bookmark: <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.6-3.2 4.6-5 8-5s6.4 1.8 8 5" />
    </>
  ),
  car: (
    <>
      <path d="M4 16v-3l2-5.2A2 2 0 0 1 7.9 6h8.2a2 2 0 0 1 1.9 1.8L20 13v3" />
      <path d="M4 13h16M6 16v2M18 16v2" />
      <circle cx="7.5" cy="13" r="0.4" />
      <circle cx="16.5" cy="13" r="0.4" />
    </>
  ),
  suv: (
    <>
      <path d="M3 15v-3l2.4-4.4A2 2 0 0 1 7.2 6.5h6.4a3 3 0 0 1 2.2 1L20 11l1 1.5V15" />
      <path d="M3 12.5h18" />
      <circle cx="7.5" cy="15.5" r="1.7" />
      <circle cx="16.5" cy="15.5" r="1.7" />
    </>
  ),
  sedan: (
    <>
      <path d="M3 14.5v-2l3-1 2.5-3.4a2 2 0 0 1 1.6-.8h3.6a2 2 0 0 1 1.5.7L18 11l3 1.2v2.3" />
      <circle cx="7.5" cy="15" r="1.7" />
      <circle cx="16.5" cy="15" r="1.7" />
    </>
  ),
  bolt: <path d="M13 3 5 13.5h5L10.5 21 19 10.5h-5L13 3Z" />,
  leaf: (
    <>
      <path d="M6 15C6 8 12 5 19 5c0 8-3 13-10 13a6.5 6.5 0 0 1-3-3Z" />
      <path d="M5 20c3-4 6-7 10-9" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c-4.5 4.7-4.5 12.3 0 17M12 3.5c4.5 4.7 4.5 12.3 0 17" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2.2" />
    </>
  ),
  won: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M7 9.5 8.8 15 10.6 9.5 12.4 15 14.2 9.5M6.5 12h11" transform="translate(0.7 0)" />
    </>
  ),
  briefcase: (
    <>
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8M4 12.5h16" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 3 5 5.8v5.4c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V5.8L12 3Z" />
      <path d="m9 11.6 2.2 2.2L15.4 9.5" />
    </>
  ),
  docShield: (
    <>
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h4M9.5 12h5M9.5 15.5h3.5" />
    </>
  ),
  infinity: (
    <path d="M8 15.5c-2 0-3.5-1.6-3.5-3.5S6 8.5 8 8.5c3.5 0 4.5 7 8 7 2 0 3.5-1.6 3.5-3.5S18 8.5 16 8.5c-3.5 0-4.5 7-8 7Z" />
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4.5" />
      <path d="m11.5 11.5 8-8M17 6l2.5 2.5M14.5 8.5 17 11" />
    </>
  ),
  smartkey: (
    <>
      <rect x="8" y="3.5" width="8" height="17" rx="2.2" />
      <path d="M11.5 17.5h1" />
    </>
  ),
  sliders: (
    <>
      <path d="M5 7h14M5 12h14M5 17h14" />
      <circle cx="9" cy="7" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="8" cy="17" r="1.8" fill="currentColor" stroke="none" />
    </>
  ),
  card: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M3.5 9.5h17M7 15h4" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.4 2.4 4.6-5" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2" />
      <path d="M4 10h16M8 3.5v4M16 3.5v4" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  arrowRight: <path d="M4 12h15m0 0-6-6m6 6-6 6" />,
  refresh: (
    <>
      <path d="M19 12a7 7 0 1 1-2-4.9" />
      <path d="M17.5 3.5v4h-4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 7.8v.4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
}

export function Icon({ name, size = 24, strokeWidth = 1.7, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

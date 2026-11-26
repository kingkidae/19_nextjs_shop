import type { SVGProps } from "react";

const paths = {
  menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>),
  heart: <path d="M12 20s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />,
  user: (<><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c.8-3.8 3.9-5.8 7.5-5.8s6.7 2 7.5 5.8" /></>),
  bag: (<><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>),
  chevronRight: <path d="M9 5l7 7-7 7" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronDown: <path d="M5 9l7 7 7-7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  home: <path d="M4 11l8-6.5 8 6.5V20h-5.5v-5h-5v5H4z" />,
  grid: (<><rect x="4" y="4" width="6.5" height="6.5" /><rect x="13.5" y="4" width="6.5" height="6.5" /><rect x="4" y="13.5" width="6.5" height="6.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" /></>),
  box: (<><path d="M4 7.5L12 4l8 3.5v9L12 20l-8-3.5z" /><path d="M4 7.5l8 3.5 8-3.5M12 11v9" /></>),
  receipt: (<><path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2z" /><path d="M9 8.5h6M9 12h6" /></>),
  users: (<><circle cx="9" cy="9" r="3.2" /><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6" /><circle cx="16.5" cy="8" r="2.6" /><path d="M16 13.3c2.4 0 4 1.4 4.5 4" /></>),
  chart: <path d="M4 20h16M7 16v-5M12 16V7M17 16v-8" />,
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M12 3.5v2.3M12 18.2v2.3M3.5 12h2.3M18.2 12h2.3M6 6l1.6 1.6M16.4 16.4L18 18M6 18l1.6-1.6M16.4 7.6L18 6" /></>),
  tag: (<><path d="M4 4h7.5l8.5 8.5-7.5 7.5L4 11.5z" /><circle cx="8.5" cy="8.5" r="1.3" /></>),
  bell: (<><path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5L19 18H5z" /><path d="M10 20.5h4" /></>),
  logout: (<><path d="M14 4h5v16h-5" /><path d="M10 8l-4 4 4 4M6 12h9.5" /></>),
  edit: <path d="M5 19l1-4.5L15.5 5l3.5 3.5L9.5 18z" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  arrowRight: <path d="M4 12h15M14 7l5 5-5 5" />,
  download: <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" />,
  truck: (<><path d="M3 6.5h11v10H3zM14 10h4l3 3v3.5h-7" /><circle cx="7" cy="17.5" r="1.7" /><circle cx="17.5" cy="17.5" r="1.7" /></>),
  location: (<><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>),
  calendar: (<><rect x="4" y="5.5" width="16" height="14.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>),
  gift: (<><rect x="4" y="9" width="16" height="11" /><path d="M3 9h18M12 9v11M12 9c-1.5-3.5-5-4-5-1.5S10 9 12 9zM12 9c1.5-3.5 5-4 5-1.5S14 9 12 9z" /></>),
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  more: (<><circle cx="6" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="18" cy="12" r="1" /></>),
  upload: <path d="M12 20V9M7.5 13.5L12 9l4.5 4.5M5 4.5h14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  trash: (<><path d="M4.5 7h15M9 7V4.5h6V7M6.5 7l1 13h9l1-13" /></>),
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 24, strokeWidth = 1.4, ...rest }: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
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
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

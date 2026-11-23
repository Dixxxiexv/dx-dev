export type Point2D = readonly [number, number];

export const DX_EMBLEM_POINTS: readonly Point2D[] = [
  [56.9, 1.9],
  [50.0, 38.8],
  [51.9, 39.4],
  [58.8, 35.6],
  [85.6, 18.1],
  [64.4, 41.9],
  [60.0, 47.5],
  [59.4, 50.0],
  [80.0, 50.6],
  [96.2, 49.4],
  [69.4, 58.8],
  [58.8, 63.8],
  [85.0, 80.0],
  [56.9, 74.4],
  [50.0, 74.4],
  [50.6, 78.8],
  [58.1, 98.8],
  [36.9, 76.9],
  [33.1, 80.0],
  [23.8, 92.5],
  [25.0, 71.9],
  [27.5, 72.5],
  [31.2, 70.6],
  [44.4, 71.9],
  [47.5, 70.0],
  [51.2, 66.2],
  [53.8, 60.6],
  [54.4, 51.9],
  [53.1, 50.0],
  [48.8, 50.6],
  [44.4, 53.1],
  [38.8, 58.8],
  [33.8, 66.9],
  [30.6, 69.4],
  [21.9, 65.0],
  [20.6, 66.2],
  [21.9, 68.8],
  [3.1, 66.2],
  [20.0, 56.9],
  [3.1, 32.5],
  [24.4, 44.4],
  [25.6, 41.2],
  [25.0, 8.8],
  [32.5, 30.0],
  [35.6, 36.2],
  [37.5, 36.9],
  [48.1, 19.4],
] as const;

export const DX_EMBLEM_SVG_PATH =
  DX_EMBLEM_POINTS.map(
    ([x, y], idx) => `${idx === 0 ? 'M' : 'L'} ${x} ${y}`,
  ).join(' ') + ' Z';

export interface ContactChannel {
  id: 'whatsapp' | 'email' | 'instagram' | 'portfolio';
  label: string;
  value: string;
  href: string;
  copyText?: string;
  external?: boolean;
}

export const SITE_PROFILE = {
  brand: 'DX DEV',
  role: 'Fullstack Developer',
  domain: 'dixxxie.com',
  description:
    'Building refined digital products, scalable applications, and high-performance interactive experiences with modern craftsmanship.',
  whatsappHref: 'https://wa.me/6281237173414',
  emailHref: 'mailto:apricologho@gmail.com',
  copyright: '© 2026 DX DEV · dixxxie.com',
} as const;

export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '+62 812-3717-3414',
    href: 'https://wa.me/6281237173414',
    copyText: '+62 812-3717-3414',
    external: true,
  },
  {
    id: 'email',
    label: 'Email',
    value: 'apricologho@gmail.com',
    href: 'mailto:apricologho@gmail.com',
    copyText: 'apricologho@gmail.com',
    external: false,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: '@dixie.vtrm',
    href: 'https://instagram.com/dixie.vtrm',
    external: true,
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    value: '12 Projects',
    href: '#portfolio',
    external: false,
  },
] as const;

export interface PortfolioProject {
  id: string;
  name: string;
  category: 'website' | 'app';
  displayUrl?: string;
  href?: string;
  subtitle: string;
}

export const PORTFOLIO_PROJECTS: readonly PortfolioProject[] = [
  {
    id: 'laune',
    name: 'Laune',
    category: 'website',
    displayUrl: 'laune.id',
    href: 'https://laune.id/',
    subtitle: 'Website',
  },
  {
    id: 'after7pm',
    name: 'After7PM',
    category: 'website',
    displayUrl: 'after7pm.com',
    href: 'https://after7pm.com/',
    subtitle: 'Website',
  },
  {
    id: 'maumerelogia',
    name: 'Maumerelogia',
    category: 'website',
    displayUrl: 'maumerelogia.com',
    href: 'https://maumerelogia.com/',
    subtitle: 'Website',
  },
  {
    id: 'circlelighting',
    name: 'Circle Lighting',
    category: 'website',
    displayUrl: 'circlelighting.id',
    href: 'https://circlelighting.id/',
    subtitle: 'Website',
  },
  {
    id: 'jcorpstage',
    name: 'JCorp Stage',
    category: 'website',
    displayUrl: 'jcorpstage.com',
    href: 'https://jcorpstage.com/',
    subtitle: 'Website',
  },
  {
    id: 'yojastip',
    name: 'Yojastip',
    category: 'website',
    displayUrl: 'yojastip.com',
    href: 'https://yojastip.com/',
    subtitle: 'Website',
  },
  {
    id: 'asariwidi',
    name: 'Asari Widi',
    category: 'website',
    displayUrl: 'asariwidi.id',
    href: 'https://asariwidi.id/',
    subtitle: 'Website',
  },
  {
    id: 'datange',
    name: 'Datange',
    category: 'website',
    displayUrl: 'datange.id',
    href: 'https://datange.id/',
    subtitle: 'Website',
  },
  {
    id: 'pariwisata-sikka',
    name: 'Pariwisata Kab. Sikka',
    category: 'website',
    displayUrl: 'pariwisata.sikkakab.go.id',
    href: 'https://pariwisata.sikkakab.go.id/',
    subtitle: 'Government Portal',
  },
  {
    id: 'info-pariwisata-sikka',
    name: 'Info Pariwisata Sikka',
    category: 'website',
    displayUrl: 'info-pariwisata.sikkakab.go.id',
    href: 'https://info-pariwisata.sikkakab.go.id/',
    subtitle: 'Information Portal',
  },
  {
    id: 'yomof',
    name: 'YOMOF',
    category: 'app',
    subtitle: 'Application',
  },
  {
    id: 'jelajah-maumere',
    name: 'Jelajah Maumere',
    category: 'app',
    subtitle: 'Application',
  },
] as const;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://www.francisco-the-man.com';

const DEFAULT_TITLE = 'Avery Louis — Symbolic Systems at Stanford | Code, Research & Art';
const DEFAULT_DESCRIPTION =
  'Personal website of Avery Louis (francisco-the-man on GitHub): Symbolic Systems at Stanford, computational models of science, software projects, and physical & digital art.';

const META: Record<string, { title: string; description: string }> = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  '/contact': {
    title: 'Contact — Avery Louis',
    description: 'Get in touch with Avery Louis.',
  },
  '/computer': {
    title: 'Computer — Avery Louis',
    description: 'Software and computational work by Avery Louis.',
  },
  '/computer/projects': {
    title: 'Projects — Avery Louis',
    description: 'Software projects by Avery Louis (francisco-the-man on GitHub).',
  },
  '/research': {
    title: 'Research — Avery Louis',
    description: 'Research by Avery Louis: metascience, computational models of science, and machine learning.',
  },
  '/research/projects': {
    title: 'Research — Avery Louis',
    description: 'Research by Avery Louis: metascience, computational models of science, and machine learning.',
  },
  '/research/ddpms': {
    title: 'DDPMs — Avery Louis',
    description: 'Avery Louis on denoising diffusion probabilistic models.',
  },
  '/creative': {
    title: 'Creative — Avery Louis',
    description: 'Creative work by Avery Louis: physical media, clothing, and video art.',
  },
  '/creative/physical-media': {
    title: 'Physical Media — Avery Louis',
    description: 'Prints, paintings, sculptures, and physical devices by Avery Louis.',
  },
  '/creative/clothing': {
    title: 'Clothing — Avery Louis',
    description: 'Clothing designed and made by Avery Louis.',
  },
  '/creative/videoart': {
    title: 'Video Art — Avery Louis',
    description: 'Video art by Avery Louis.',
  },
};

const setMetaContent = (selector: string, attribute: string, content: string) => {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.setAttribute(attribute, content);
};

const RouteMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalized = pathname.replace(/\/+$/, '') || '/';
    const meta = META[normalized];
    const title = meta?.title ?? DEFAULT_TITLE;
    const description = meta?.description ?? DEFAULT_DESCRIPTION;
    const canonicalUrl = normalized === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalized}`;

    document.title = title;
    setMetaContent('meta[name="description"]', 'content', description);
    setMetaContent('meta[property="og:title"]', 'content', title);
    setMetaContent('meta[property="og:description"]', 'content', description);
    setMetaContent('meta[property="og:url"]', 'content', canonicalUrl);
    setMetaContent('meta[name="twitter:title"]', 'content', title);
    setMetaContent('meta[name="twitter:description"]', 'content', description);

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = canonicalUrl;

    // Keep the admin UI out of search results
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (normalized.includes('admin')) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex, nofollow';
    } else if (robots) {
      robots.remove();
    }
  }, [pathname]);

  return null;
};

export default RouteMeta;

import { useEffect, useState } from 'react';
import { ArrowUpRight, Globe, Smartphone, X } from 'lucide-react';
import {
  PORTFOLIO_PROJECTS,
  SITE_PROFILE,
  type PortfolioProject,
} from '../data/emblemPath';

interface PortfolioModalProps {
  open: boolean;
  onClose: () => void;
}

type FilterTab = 'all' | 'website' | 'app';

export function PortfolioModal({ open, onClose }: PortfolioModalProps) {
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const websites = PORTFOLIO_PROJECTS.filter((p) => p.category === 'website');
  const apps = PORTFOLIO_PROJECTS.filter((p) => p.category === 'app');

  const showWebsites = filter === 'all' || filter === 'website';
  const showApps = filter === 'all' || filter === 'app';

  const renderWebsiteItem = (project: PortfolioProject, index: number) => (
    <a
      key={project.id}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#121218] border border-white/[0.07] transition-all duration-150 hover:bg-[#181820] hover:border-[#A3E635]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-mono text-[11px] tabular-nums text-zinc-500 w-5 shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 text-left">
          <span className="block text-[14px] font-semibold text-white truncate group-hover:text-[#A3E635] transition-colors">
            {project.name}
          </span>
          <span className="block font-mono text-[12px] text-zinc-400 truncate">
            {project.displayUrl}
          </span>
        </div>
      </div>
      <ArrowUpRight
        className="w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-150 group-hover:text-[#A3E635] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={2}
      />
    </a>
  );

  const renderAppItem = (project: PortfolioProject, index: number) => (
    <div
      key={project.id}
      className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-[#121218] border border-white/[0.07]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-lg bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center shrink-0">
          <Smartphone className="w-4 h-4" strokeWidth={2} />
        </span>
        <div className="min-w-0 text-left">
          <span className="block text-[14px] font-semibold text-white truncate">
            {project.name}
          </span>
          <span className="block text-[12px] text-zinc-400">
            {String(index + 1).padStart(2, '0')} · {project.subtitle}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050507]/85"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[740px] max-h-[86vh] flex flex-col rounded-2xl bg-[#0c0c10] border border-white/[0.1] shadow-[0_24px_80px_rgba(0,0,0,0.75)] overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-4 border-b border-white/[0.07]">
          <div className="text-left">
            <h2
              id="portfolio-modal-title"
              className="text-[19px] sm:text-[21px] font-bold tracking-[-0.02em] text-white"
            >
              Portfolio
            </h2>
            <p className="mt-1 font-mono text-[12px] tabular-nums text-zinc-400">
              {websites.length} Websites <span aria-hidden="true">·</span>{' '}
              {apps.length} Apps
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close portfolio modal"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.07] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-3 border-b border-white/[0.06] flex items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Filter project category"
            className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]"
          >
            {(
              [
                { id: 'all', label: `All (${PORTFOLIO_PROJECTS.length})` },
                { id: 'website', label: `Websites (${websites.length})` },
                { id: 'app', label: `Apps (${apps.length})` },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] ${active
                      ? 'bg-[#A3E635] text-[#070709]'
                      : 'text-zinc-400 hover:text-white'
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {showWebsites && (
            <section aria-label="Website projects">
              <div className="flex items-center gap-2 mb-3 text-left">
                <Globe className="w-4 h-4 text-[#A3E635]" strokeWidth={2} />
                <h3 className="text-[13px] font-semibold text-zinc-200">
                  Websites
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {websites.map((project, idx) =>
                  renderWebsiteItem(project, idx),
                )}
              </div>
            </section>
          )}

          {showWebsites && showApps && (
            <div className="border-t border-white/[0.07]" aria-hidden="true" />
          )}

          {showApps && (
            <section aria-label="Application projects">
              <div className="flex items-center gap-2 mb-3 text-left">
                <Smartphone
                  className="w-4 h-4 text-[#A3E635]"
                  strokeWidth={2}
                />
                <h3 className="text-[13px] font-semibold text-zinc-200">
                  Apps
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {apps.map((project, idx) => renderAppItem(project, idx))}
              </div>
            </section>
          )}
        </div>

        <div className="px-5 sm:px-6 py-3.5 border-t border-white/[0.07] flex items-center justify-between gap-3 bg-[#09090d]">
          <span className="text-[12px] text-zinc-400 truncate">
            {SITE_PROFILE.brand} · {SITE_PROFILE.domain}
          </span>
          <a
            href={SITE_PROFILE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-[#A3E635] hover:text-[#bef264] whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] rounded"
          >
            Start a Project →
          </a>
        </div>
      </div>
    </div>
  );
}

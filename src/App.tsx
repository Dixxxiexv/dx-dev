import { useState } from 'react';
import {
  Check,
  ChevronRight,
  Copy,
  Globe,
  Instagram,
  Mail,
} from 'lucide-react';
import {
  CONTACT_CHANNELS,
  SITE_PROFILE,
  type ContactChannel,
} from './data/emblemPath';
import { WhatsAppIcon } from './components/DxEmblemIcon';
import { Logo3DScene } from './components/Logo3DScene';
import { PortfolioModal } from './components/PortfolioModal';

function ChannelIcon({ id }: { id: ContactChannel['id'] }) {
  switch (id) {
    case 'whatsapp':
      return <WhatsAppIcon className="w-[22px] h-[22px]" />;
    case 'email':
      return <Mail className="w-[18px] h-[18px]" strokeWidth={1.9} />;
    case 'instagram':
      return <Instagram className="w-[18px] h-[18px]" strokeWidth={1.9} />;
    case 'portfolio':
      return <Globe className="w-[18px] h-[18px]" strokeWidth={1.9} />;
  }
}

export default function App() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 1800);
    } catch {
      const input = document.createElement('textarea');
      input.value = text;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        setCopiedId(id);
        window.setTimeout(() => {
          setCopiedId((prev) => (prev === id ? null : prev));
        }, 1800);
      } finally {
        document.body.removeChild(input);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#070709] text-white flex flex-col items-center justify-between overflow-x-hidden px-4 sm:px-6 pb-8">
      <div className="dx-ambient-glow" aria-hidden="true" />
      <div className="dx-grid-pattern" aria-hidden="true" />
      <div className="dx-grid-wipe" aria-hidden="true" />

      <main className="relative z-10 w-full max-w-[740px] mx-auto flex flex-col items-center text-center pt-2 sm:pt-4">
        <div className="w-full max-w-[680px] -mb-4 sm:-mb-6">
          <Logo3DScene />
        </div>

        <h1 className="inline-flex items-center justify-center flex-nowrap whitespace-nowrap gap-2 sm:gap-3 text-[clamp(1.25rem,4.4vw,2.5rem)] font-extrabold tracking-[-0.03em] leading-tight mb-3">
          <span className="text-[#A3E635] font-extrabold tracking-[-0.02em] [text-shadow:0_0_20px_rgba(163,230,53,0.35)]">
            {SITE_PROFILE.brand}
          </span>
          <span
            aria-hidden="true"
            className="text-white/40 font-light select-none"
          >
            |
          </span>
          <span className="text-white">{SITE_PROFILE.role}</span>
        </h1>

        <p className="text-[15px] sm:text-[16px] text-zinc-400 max-w-[580px] leading-[1.65] [text-wrap:balance] mb-7 sm:mb-8">
          {SITE_PROFILE.description}
        </p>

        <section
          aria-label="Direct contact"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[660px]"
        >
          {CONTACT_CHANNELS.map((channel) => {
            const isCopied = copiedId === channel.id;
            const isPortfolio = channel.id === 'portfolio';

            const innerContent = (
              <>
                <span
                  className={`w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-zinc-400 shrink-0 transition-colors duration-200 ${
                    channel.id === 'whatsapp'
                      ? 'group-hover:bg-[#25D366]/15'
                      : 'group-hover:bg-[#A3E635] group-hover:text-[#070709]'
                  }`}
                >
                  <ChannelIcon id={channel.id} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold tracking-[0.06em] text-zinc-400">
                    {channel.label}
                  </span>
                  <span className="block text-[14px] font-semibold text-white truncate">
                    {channel.value}
                  </span>
                </span>
              </>
            );

            return (
              <div
                key={channel.id}
                className="group flex items-center bg-[#101014]/90 border border-white/[0.08] rounded-2xl transition-all duration-200 hover:bg-[#16161c]/95 hover:border-[#A3E635]/45 hover:-translate-y-0.5"
              >
                {isPortfolio ? (
                  <button
                    type="button"
                    onClick={() => setIsPortfolioOpen(true)}
                    className="flex-1 min-w-0 flex items-center gap-3.5 px-4 py-3.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] rounded-2xl"
                  >
                    {innerContent}
                    <ChevronRight
                      className="w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 group-hover:text-[#A3E635] group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </button>
                ) : (
                  <a
                    href={channel.href}
                    target={channel.external ? '_blank' : undefined}
                    rel={channel.external ? 'noopener noreferrer' : undefined}
                    className="flex-1 min-w-0 flex items-center gap-3.5 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] rounded-2xl"
                  >
                    {innerContent}
                  </a>
                )}

                {channel.copyText && (
                  <button
                    type="button"
                    onClick={() => handleCopy(channel.id, channel.copyText!)}
                    aria-label={`Copy ${channel.label}`}
                    title={isCopied ? 'Copied' : `Copy ${channel.label}`}
                    className="mr-3 w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635]"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-[#A3E635]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </section>
      </main>

      <footer className="relative z-10 mt-10 text-[12px] text-zinc-500 flex items-center justify-center gap-3">
        <span>{SITE_PROFILE.copyright}</span>
      </footer>

      <PortfolioModal
        open={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
      />
    </div>
  );
}

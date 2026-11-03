import { Send, Twitch, type LucideIcon } from 'lucide-react';
import type { SocialKey, SocialLinks } from '@/types';

const SOCIAL_ICONS: Record<SocialKey, { label: string; Icon: LucideIcon | null; text?: string }> = {
  twitch: { label: 'Twitch', Icon: Twitch },
  telegram: { label: 'Telegram', Icon: Send },
  vk: { label: 'VK', Icon: null, text: 'VK' },
};

interface SocialIconsProps {
  links: SocialLinks;
}

export function SocialIcons({ links }: SocialIconsProps) {
  const keys = (Object.keys(SOCIAL_ICONS) as SocialKey[]).filter((key) => links[key]);

  return (
    <div className="flex flex-wrap gap-2">
      {keys.map((key) => {
        const { label, Icon, text } = SOCIAL_ICONS[key];
        return (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-ink-100 transition duration-200 hover:border-accent hover:bg-accent hover:text-white"
          >
            {Icon ? <Icon className="h-4 w-4" /> : <span className="text-xs font-bold tracking-wide">{text}</span>}
          </a>
        );
      })}
    </div>
  );
}

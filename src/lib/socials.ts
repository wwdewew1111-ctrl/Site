import type { SocialKey, SocialLinks } from '@/types';

export const SOCIAL_FIELDS: { key: SocialKey; label: string }[] = [
  { key: 'twitch', label: 'Twitch' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'vk', label: 'VK' },
];

export function cleanSocials(links: SocialLinks): SocialLinks {
  const cleaned: SocialLinks = {};
  for (const { key } of SOCIAL_FIELDS) {
    const value = links[key]?.trim();
    if (value) cleaned[key] = value;
  }
  return cleaned;
}

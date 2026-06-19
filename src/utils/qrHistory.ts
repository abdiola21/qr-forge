import type { QrContent, QrDesign } from '../types/qr';
import { resolveSocialNetwork } from './contentTypeHelpers';

export interface QrHistoryEntry {
  id: string;
  content: QrContent;
  design: QrDesign;
  payload: string;
  label: string;
  createdAt: number;
}

const STORAGE_KEY = 'qr-forge-history';
const MAX_ENTRIES = 10;

export function loadHistory(): QrHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QrHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: QrHistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

/** Ajoute une entrée en tête (ignore les doublons consécutifs) */
export function addToHistory(entry: Omit<QrHistoryEntry, 'id' | 'createdAt'>) {
  const history = loadHistory();
  const last = history[0];
  if (
    last &&
    last.payload === entry.payload &&
    JSON.stringify(last.design) === JSON.stringify(entry.design)
  ) {
    return;
  }

  const newEntry: QrHistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  saveHistory([newEntry, ...history.filter((h) => h.payload !== entry.payload)].slice(0, MAX_ENTRIES));
}

export function removeHistoryEntry(id: string) {
  saveHistory(loadHistory().filter((e) => e.id !== id));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Libellé court pour l'historique */
export function getHistoryLabel(content: QrContent, payload: string, typeLabel: string): string {
  const truncate = (s: string, max = 40) => (s.length > max ? `${s.slice(0, max)}…` : s);

  switch (content.type) {
    case 'contact': {
      const name = [content.contact.firstName, content.contact.lastName].filter(Boolean).join(' ');
      return name ? `${typeLabel} · ${name}` : `${typeLabel} · ${truncate(payload)}`;
    }
    case 'business':
      return `${typeLabel} · ${content.business.company || truncate(payload)}`;
    case 'social':
    case 'facebook':
    case 'whatsapp':
    case 'instagram':
      return `${typeLabel} · ${resolveSocialNetwork(content)} / ${truncate(content.socialUsername)}`;
    case 'wifi':
      return `${typeLabel} · ${content.wifi.ssid}`;
    case 'coupon':
      return `${typeLabel} · ${content.coupon.code || truncate(payload)}`;
    case 'menu': {
      const modeLabel = content.menu.mode ?? 'menu';
      const name = content.menu.restaurantName || content.menu.linkUrl || content.menu.pdfUrl;
      return name ? `${typeLabel} · ${truncate(name)}` : `${typeLabel} · ${modeLabel}`;
    }
    default:
      return `${typeLabel} · ${truncate(payload)}`;
  }
}

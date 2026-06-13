/** Panneau d'historique local des QR codes générés */
import { Clock, Trash2, RotateCcw } from 'lucide-react';
import type { QrHistoryEntry } from '../utils/qrHistory';
import { useLanguage } from '../i18n/LanguageContext';

interface QrHistoryPanelProps {
  entries: QrHistoryEntry[];
  onRestore: (entry: QrHistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function QrHistoryPanel({ entries, onRestore, onRemove, onClear }: QrHistoryPanelProps) {
  const { t, lang } = useLanguage();
  const h = t.history;

  if (entries.length === 0) return null;

  const formatDate = (ts: number) =>
    new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(ts);

  return (
    <div className="history-panel">
      <div className="history-header">
        <div className="history-title">
          <Clock size={18} />
          <h3>{h.title}</h3>
        </div>
        <button type="button" className="history-clear" onClick={onClear}>
          {h.clearAll}
        </button>
      </div>
      <ul className="history-list">
        {entries.map((entry) => (
          <li key={entry.id} className="history-item">
            <button
              type="button"
              className="history-restore"
              onClick={() => onRestore(entry)}
              title={h.restore}
            >
              <RotateCcw size={14} />
              <span className="history-label">{entry.label}</span>
              <span className="history-date">{formatDate(entry.createdAt)}</span>
            </button>
            <button
              type="button"
              className="history-delete"
              onClick={() => onRemove(entry.id)}
              aria-label={h.remove}
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
      <p className="history-hint">{h.hint}</p>
    </div>
  );
}

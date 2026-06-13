/** Grille de sélection des réseaux sociaux */
import type { SocialNetwork } from '../types/qr';
import { SOCIAL_NETWORKS } from '../constants/designOptions';
import { useLanguage } from '../i18n/LanguageContext';
import SocialIcon from './SocialIcon';

interface SocialNetworkPickerProps {
  value: SocialNetwork;
  onChange: (network: SocialNetwork) => void;
  profileValue: string;
  onProfileChange: (value: string) => void;
}

export default function SocialNetworkPicker({
  value,
  onChange,
  profileValue,
  onProfileChange,
}: SocialNetworkPickerProps) {
  const { t } = useLanguage();
  const s = t.social;

  return (
    <div className="social-picker">
      <div className="social-grid">
        {SOCIAL_NETWORKS.map((network) => (
          <button
            key={network.id}
            type="button"
            className={`social-btn ${value === network.id ? 'active' : ''}`}
            onClick={() => onChange(network.id)}
            aria-pressed={value === network.id}
            title={s.networks[network.id]}
          >
            <span className="social-btn-icon">
              <SocialIcon network={network.id} size={26} />
            </span>
            <span className="social-btn-label">{s.networks[network.id]}</span>
          </button>
        ))}
      </div>

      <div className="field social-field">
        <label htmlFor="social-profile">{s.fieldLabel[value]}</label>
        <input
          id="social-profile"
          type="text"
          placeholder={s.placeholder[value]}
          value={profileValue}
          onChange={(e) => onProfileChange(e.target.value)}
        />
      </div>
    </div>
  );
}

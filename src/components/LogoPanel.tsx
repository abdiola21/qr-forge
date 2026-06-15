/** Ajout / remplacement du logo au centre du QR (onglet Contenu) */
import type { QrDesign, SocialNetwork } from '../types/qr';
import { useLanguage } from '../i18n/LanguageContext';

interface LogoPanelProps {
  design: QrDesign;
  onChange: (design: QrDesign) => void;
  autoSocialLogo?: boolean;
  effectiveLogoUrl?: string | null;
  socialNetwork?: SocialNetwork;
}

export default function LogoPanel({
  design,
  onChange,
  autoSocialLogo = false,
  effectiveLogoUrl = null,
  socialNetwork,
}: LogoPanelProps) {
  const { t } = useLanguage();
  const d = t.design;

  const update = <K extends keyof QrDesign>(key: K, value: QrDesign[K]) => {
    onChange({ ...design, [key]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const probe = new Image();
      probe.onload = () => update('logoUrl', dataUrl);
      probe.onerror = () => update('logoUrl', null);
      probe.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="content-logo-section">
      <h3 className="content-logo-title">{d.logo}</h3>
      <div className="logo-section">
        <label className="upload-btn">
          <input type="file" accept="image/*" onChange={handleLogoUpload} hidden />
          {design.logoUrl ? d.replaceLogo : d.addLogo}
        </label>

        {autoSocialLogo && effectiveLogoUrl && socialNetwork && (
          <div className="logo-auto-hint">
            <div className="logo-preview logo-preview-auto">
              <img src={effectiveLogoUrl} alt={d.logo} />
            </div>
            <p className="logo-auto-text">
              {d.autoLogoHint.replace('{network}', t.social.networks[socialNetwork])}
            </p>
          </div>
        )}

        {design.logoUrl && (
          <>
            <div className="logo-preview">
              <img src={design.logoUrl} alt={d.logo} />
              <button type="button" className="remove-logo" onClick={() => update('logoUrl', null)}>×</button>
            </div>
            {autoSocialLogo && (
              <p className="logo-auto-text">{d.customLogoActive}</p>
            )}
          </>
        )}

        {(design.logoUrl || autoSocialLogo) && (
          <div className="field">
            <label htmlFor="logo-size">{d.logoSize} ({design.logoSize}%)</label>
            <input
              id="logo-size"
              type="range"
              min={10}
              max={40}
              value={design.logoSize}
              onChange={(e) => update('logoSize', Number(e.target.value))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

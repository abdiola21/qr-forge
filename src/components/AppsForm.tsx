/** Formulaire Apps : informations, description, site web et liens stores */
import { useState } from 'react';
import { ChevronDown, Info, Link2 } from 'lucide-react';
import type { AppStore, AppsData } from '../types/qr';
import { useLanguage } from '../i18n/LanguageContext';

interface AppsFormProps {
  apps: AppsData;
  onChange: (apps: AppsData) => void;
}

const DESCRIPTION_MAX = 4000;

const STORES: AppStore[] = ['google', 'apple', 'amazon'];

function CollapsibleSection({
  id,
  icon,
  title,
  subtitle,
  required,
  open,
  onToggle,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  required?: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="business-section">
      <button
        type="button"
        className="business-section-head"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-body`}
      >
        <span className="business-section-icon">{icon}</span>
        <span className="business-section-titles">
          <span className="business-section-title">
            {title}
            {required && <span className="field-required" aria-hidden="true">*</span>}
          </span>
          <span className="business-section-subtitle">{subtitle}</span>
        </span>
        <ChevronDown size={18} className={`business-section-chevron ${open ? 'open' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div id={`${id}-body`} className="business-section-body">
          {children}
        </div>
      )}
    </section>
  );
}

export default function AppsForm({ apps, onChange }: AppsFormProps) {
  const { t } = useLanguage();
  const a = t.form.appsForm;
  const [infoOpen, setInfoOpen] = useState(true);
  const [storesOpen, setStoresOpen] = useState(true);

  const update = <K extends keyof AppsData>(key: K, value: AppsData[K]) => {
    onChange({ ...apps, [key]: value });
  };

  const toggleStore = (store: AppStore) => {
    const enabledKey = `${store}Enabled` as const;
    const urlKey = `${store}Url` as const;
    const next = !apps[enabledKey];
    onChange({
      ...apps,
      [enabledKey]: next,
      [urlKey]: next ? apps[urlKey] : '',
    });
  };

  const storeLabels: Record<AppStore, string> = {
    google: a.googleStore,
    apple: a.appleStore,
    amazon: a.amazonStore,
  };

  const storePlaceholders: Record<AppStore, string> = {
    google: a.googleUrlPlaceholder,
    apple: a.appleUrlPlaceholder,
    amazon: a.amazonUrlPlaceholder,
  };

  return (
    <div className="apps-form">
      <CollapsibleSection
        id="apps-info"
        icon={<Info size={18} strokeWidth={2} />}
        title={a.infoTitle}
        subtitle={a.infoSubtitle}
        required
        open={infoOpen}
        onToggle={() => setInfoOpen((v) => !v)}
      >
        <div className="field">
          <label htmlFor="apps-name">
            {a.appNameLabel}
            <span className="field-required" aria-hidden="true">*</span>
          </label>
          <input
            id="apps-name"
            type="text"
            placeholder={a.appNamePlaceholder}
            value={apps.appName}
            onChange={(e) => update('appName', e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="apps-developer">{a.developerLabel}</label>
          <input
            id="apps-developer"
            type="text"
            placeholder={a.developerPlaceholder}
            value={apps.developer}
            onChange={(e) => update('developer', e.target.value)}
          />
        </div>
      </CollapsibleSection>

      <div className="field">
        <label htmlFor="apps-description">{a.descriptionLabel}</label>
        <div className="field-textarea-wrap">
          <textarea
            id="apps-description"
            placeholder={a.descriptionPlaceholder}
            rows={4}
            maxLength={DESCRIPTION_MAX}
            value={apps.description}
            onChange={(e) => update('description', e.target.value)}
          />
          <span className="field-char-count" aria-live="polite">
            {apps.description.length} / {DESCRIPTION_MAX}
          </span>
        </div>
      </div>

      <div className="field">
        <label htmlFor="apps-website">{a.websiteLabel}</label>
        <input
          id="apps-website"
          type="url"
          placeholder={a.websitePlaceholder}
          value={apps.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      <CollapsibleSection
        id="apps-stores"
        icon={<Link2 size={18} strokeWidth={2} />}
        title={a.storesTitle}
        subtitle={a.storesSubtitle}
        required
        open={storesOpen}
        onToggle={() => setStoresOpen((v) => !v)}
      >
        <p className="apps-stores-hint">{a.storesHint}</p>

        <div className="apps-store-buttons" role="group" aria-label={a.storesTitle}>
          {STORES.map((store) => (
            <button
              key={store}
              type="button"
              className={`apps-store-btn ${apps[`${store}Enabled`] ? 'active' : ''}`}
              aria-pressed={apps[`${store}Enabled`]}
              onClick={() => toggleStore(store)}
            >
              {storeLabels[store]}
            </button>
          ))}
        </div>

        {STORES.map((store) => {
          const enabledKey = `${store}Enabled` as const;
          const urlKey = `${store}Url` as const;
          if (!apps[enabledKey]) return null;

          return (
            <div key={store} className="field apps-store-url">
              <label htmlFor={`apps-${store}-url`}>{storeLabels[store]}</label>
              <input
                id={`apps-${store}-url`}
                type="url"
                placeholder={storePlaceholders[store]}
                value={apps[urlKey]}
                onChange={(e) => update(urlKey, e.target.value)}
              />
            </div>
          );
        })}
      </CollapsibleSection>
    </div>
  );
}

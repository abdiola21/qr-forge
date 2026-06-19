/** Formulaire Entreprise : informations + localisation */
import { useRef, useState } from 'react';
import { ChevronDown, ImageUp, Info, MapPin } from 'lucide-react';
import type { BusinessData } from '../types/qr';
import { useLanguage } from '../i18n/LanguageContext';
import AddressFieldGroup from './AddressFieldGroup';

interface BusinessFormProps {
  business: BusinessData;
  onChange: (business: BusinessData) => void;
}

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

export default function BusinessForm({ business, onChange }: BusinessFormProps) {
  const { t } = useLanguage();
  const b = t.form.businessForm;
  const fileRef = useRef<HTMLInputElement>(null);
  const [infoOpen, setInfoOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);

  const update = <K extends keyof BusinessData>(key: K, value: BusinessData[K]) => {
    onChange({ ...business, [key]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const probe = new Image();
      probe.onload = () => update('imageUrl', dataUrl);
      probe.onerror = () => update('imageUrl', null);
      probe.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="business-form">
      <CollapsibleSection
        id="business-info"
        icon={<Info size={18} strokeWidth={2} />}
        title={b.infoTitle}
        subtitle={b.infoSubtitle}
        required
        open={infoOpen}
        onToggle={() => setInfoOpen((v) => !v)}
      >
        <div className="field">
          <label>{b.imageLabel}</label>
          <div className="business-image-upload">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
              id="business-image"
            />
            {business.imageUrl ? (
              <div className="business-image-preview">
                <img src={business.imageUrl} alt="" />
                <button type="button" className="business-image-remove" onClick={() => update('imageUrl', null)}>×</button>
              </div>
            ) : (
              <button type="button" className="business-image-btn" onClick={() => fileRef.current?.click()}>
                <ImageUp size={24} strokeWidth={1.75} />
              </button>
            )}
          </div>
          <span className="hint">{b.imageHint}</span>
        </div>

        <div className="field">
          <label htmlFor="business-company">
            {b.companyLabel}
            <span className="field-required" aria-hidden="true">*</span>
          </label>
          <input
            id="business-company"
            type="text"
            placeholder={b.companyPlaceholder}
            value={business.company}
            onChange={(e) => update('company', e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="business-title">{b.businessTitleLabel}</label>
          <input
            id="business-title"
            type="text"
            placeholder={b.businessTitlePlaceholder}
            value={business.title}
            onChange={(e) => update('title', e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="business-subtitle">{b.subtitleLabel}</label>
          <input
            id="business-subtitle"
            type="text"
            placeholder={b.subtitlePlaceholder}
            value={business.subtitle}
            onChange={(e) => update('subtitle', e.target.value)}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="business-location"
        icon={<MapPin size={18} strokeWidth={2} />}
        title={b.locationTitle}
        subtitle={b.locationSubtitle}
        open={locationOpen}
        onToggle={() => setLocationOpen((v) => !v)}
      >
        <AddressFieldGroup
          idPrefix="business"
          value={{
            searchAddress: business.searchAddress,
            manualEntry: business.manualEntry,
            street: business.street,
            city: business.city,
            state: business.state,
            zip: business.zip,
            country: business.country,
          }}
          onChange={(fields) => onChange({ ...business, ...fields })}
        />
      </CollapsibleSection>
    </div>
  );
}

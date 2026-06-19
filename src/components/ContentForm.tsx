/** Formulaire dynamique selon le type de contenu sélectionné */
import type { QrContent, SocialNetwork } from '../types/qr';
import { resolveSocialNetwork } from '../utils/contentTypeHelpers';
import { useLanguage } from '../i18n/LanguageContext';
import SocialNetworkPicker from './SocialNetworkPicker';
import MenuForm from './MenuForm';
import BusinessForm from './BusinessForm';
import AppsForm from './AppsForm';
import AddressFieldGroup from './AddressFieldGroup';
import AddressAutocomplete from './AddressAutocomplete';
import { suggestionToMapsUrl } from '../utils/addressSearch';

interface ContentFormProps {
  content: QrContent;
  onChange: (content: QrContent) => void;
}

function SocialProfileField({
  network,
  value,
  onChange,
}: {
  network: SocialNetwork;
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useLanguage();
  const s = t.social;

  return (
    <div className="field social-field">
      <label htmlFor="social-profile">{s.fieldLabel[network]}</label>
      <input
        id="social-profile"
        type="text"
        placeholder={s.placeholder[network]}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function ContentForm({ content, onChange }: ContentFormProps) {
  const { t } = useLanguage();
  const f = t.form;

  const update = <K extends keyof QrContent>(key: K, value: QrContent[K]) => {
    onChange({ ...content, [key]: value });
  };

  const updateContact = (field: keyof QrContent['contact'], value: string) => {
    onChange({ ...content, contact: { ...content.contact, [field]: value } });
  };

  const updateWifi = (field: keyof QrContent['wifi'], value: string) => {
    onChange({ ...content, wifi: { ...content.wifi, [field]: value } });
  };

  const updateCoupon = (field: keyof QrContent['coupon'], value: string) => {
    onChange({ ...content, coupon: { ...content.coupon, [field]: value } });
  };

  const couponTermsMax = 4000;

  const urlFields: Partial<Record<QrContent['type'], { label: string; placeholder: string; hint?: string; id: string }>> = {
    url: { id: 'url', label: f.urlLabel, placeholder: f.urlPlaceholder },
    video: { id: 'video-url', label: f.videoLabel, placeholder: f.videoPlaceholder, hint: f.videoHint },
    music: { id: 'music-url', label: f.musicLabel, placeholder: f.musicPlaceholder, hint: f.musicHint },
    pdf: { id: 'pdf-url', label: f.pdfLabel, placeholder: f.pdfPlaceholder },
    images: { id: 'images-url', label: f.imagesLabel, placeholder: f.imagesPlaceholder, hint: f.imagesHint },
  };

  const urlField = urlFields[content.type];

  return (
    <div className="content-form">
      {urlField && (
        <div className="field">
          <label htmlFor={urlField.id}>{urlField.label}</label>
          <input
            id={urlField.id}
            type="url"
            placeholder={urlField.placeholder}
            value={content.url}
            onChange={(e) => update('url', e.target.value)}
          />
          {urlField.hint && <span className="hint">{urlField.hint}</span>}
        </div>
      )}

      {content.type === 'location' && (
        <>
          {!content.locationManualLink ? (
            <div className="field">
              <label htmlFor="location-search">{t.form.addressAutocomplete.searchLabel}</label>
              <div className="business-address-search">
                <AddressAutocomplete
                  id="location-search"
                  value={content.locationQuery}
                  placeholder={t.form.addressAutocomplete.searchPlaceholder}
                  onChange={(locationQuery) => onChange({ ...content, locationQuery, url: '' })}
                  onSelect={(s) => onChange({
                    ...content,
                    locationQuery: s.label,
                    url: suggestionToMapsUrl(s),
                  })}
                />
                <button
                  type="button"
                  className="business-manual-btn"
                  onClick={() => onChange({ ...content, locationManualLink: true, url: '', locationQuery: '' })}
                >
                  {f.locationManualLink}
                </button>
              </div>
              {content.url && <span className="hint">{f.locationMapsReady}</span>}
            </div>
          ) : (
            <>
              <div className="business-manual-head">
                <span className="hint">{f.locationManualHint}</span>
                <button
                  type="button"
                  className="business-manual-back"
                  onClick={() => onChange({ ...content, locationManualLink: false, url: '' })}
                >
                  {t.form.addressAutocomplete.backToSearch}
                </button>
              </div>
              <div className="field">
                <label htmlFor="location-url">{f.locationLabel}</label>
                <input
                  id="location-url"
                  type="url"
                  placeholder={f.locationPlaceholder}
                  value={content.url}
                  onChange={(e) => update('url', e.target.value)}
                />
                <span className="hint">{f.locationHint}</span>
              </div>
            </>
          )}
        </>
      )}

      {content.type === 'text' && (
        <div className="field">
          <label htmlFor="text">{f.textLabel}</label>
          <textarea
            id="text"
            placeholder={f.textPlaceholder}
            rows={4}
            value={content.text}
            onChange={(e) => update('text', e.target.value)}
          />
        </div>
      )}

      {content.type === 'social' && (
        <SocialNetworkPicker
          value={content.socialNetwork}
          onChange={(network) => update('socialNetwork', network)}
          profileValue={content.socialUsername}
          onProfileChange={(value) => update('socialUsername', value)}
        />
      )}

      {(content.type === 'facebook' || content.type === 'whatsapp' || content.type === 'instagram') && (
        <SocialProfileField
          network={resolveSocialNetwork(content)}
          value={content.socialUsername}
          onChange={(value) => update('socialUsername', value)}
        />
      )}

      {content.type === 'email' && (
        <>
          <div className="field">
            <label htmlFor="email">{f.emailLabel}</label>
            <input
              id="email"
              type="email"
              placeholder={f.emailPlaceholder}
              value={content.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="email-subject">{f.emailSubjectLabel}</label>
            <input
              id="email-subject"
              type="text"
              placeholder={f.emailSubjectPlaceholder}
              value={content.emailSubject}
              onChange={(e) => update('emailSubject', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="email-body">{f.emailBodyLabel}</label>
            <textarea
              id="email-body"
              placeholder={f.emailBodyPlaceholder}
              rows={3}
              value={content.emailBody}
              onChange={(e) => update('emailBody', e.target.value)}
            />
          </div>
        </>
      )}

      {content.type === 'contact' && (
        <div className="contact-grid">
            <div className="field">
              <label htmlFor="first-name">{f.firstName}</label>
              <input id="first-name" type="text" value={content.contact.firstName} onChange={(e) => updateContact('firstName', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="last-name">{f.lastName}</label>
              <input id="last-name" type="text" value={content.contact.lastName} onChange={(e) => updateContact('lastName', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="phone">{f.phone}</label>
              <input id="phone" type="tel" placeholder={f.phonePlaceholder} value={content.contact.phone} onChange={(e) => updateContact('phone', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="contact-email">{f.contactEmail}</label>
              <input id="contact-email" type="email" placeholder={f.emailPlaceholder} value={content.contact.email} onChange={(e) => updateContact('email', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="company">{f.company}</label>
              <input id="company" type="text" value={content.contact.company} onChange={(e) => updateContact('company', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="job-title">{f.jobTitle}</label>
              <input id="job-title" type="text" value={content.contact.jobTitle} onChange={(e) => updateContact('jobTitle', e.target.value)} />
            </div>
            <div className="field full-width">
              <label htmlFor="contact-website">{f.website}</label>
              <input id="contact-website" type="url" placeholder={f.websitePlaceholder} value={content.contact.website} onChange={(e) => updateContact('website', e.target.value)} />
            </div>
            <div className="field full-width">
              <AddressFieldGroup
                idPrefix="contact"
                value={{
                  searchAddress: content.contact.searchAddress,
                  manualEntry: content.contact.manualEntry,
                  street: content.contact.street,
                  city: content.contact.city,
                  state: content.contact.state,
                  zip: content.contact.zip,
                  country: content.contact.country,
                }}
                onChange={(fields) => onChange({
                  ...content,
                  contact: { ...content.contact, ...fields },
                })}
              />
            </div>
            <div className="field full-width">
              <label htmlFor="note">{f.note}</label>
              <textarea id="note" rows={2} value={content.contact.note} onChange={(e) => updateContact('note', e.target.value)} />
            </div>
          </div>
      )}

      {content.type === 'business' && (
        <BusinessForm
          business={content.business}
          onChange={(business) => onChange({ ...content, business })}
        />
      )}

      {content.type === 'apps' && (
        <AppsForm
          apps={content.apps}
          onChange={(apps) => onChange({ ...content, apps })}
        />
      )}

      {content.type === 'wifi' && (
        <>
          <div className="field">
            <label htmlFor="ssid">{f.ssidLabel}</label>
            <input id="ssid" type="text" placeholder={f.ssidPlaceholder} value={content.wifi.ssid} onChange={(e) => updateWifi('ssid', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="wifi-password">{f.wifiPasswordLabel}</label>
            <input id="wifi-password" type="text" placeholder={f.wifiPasswordPlaceholder} value={content.wifi.password} onChange={(e) => updateWifi('password', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="encryption">{f.encryptionLabel}</label>
            <select
              id="encryption"
              value={content.wifi.encryption}
              onChange={(e) => updateWifi('encryption', e.target.value)}
            >
              <option value="WPA">{f.encryptionWpa}</option>
              <option value="WEP">{f.encryptionWep}</option>
              <option value="nopass">{f.encryptionNone}</option>
            </select>
          </div>
        </>
      )}

      {content.type === 'menu' && (
        <MenuForm
          menu={content.menu}
          onChange={(menu) => onChange({ ...content, menu })}
        />
      )}

      {content.type === 'coupon' && (
        <>
          <div className="field">
            <label htmlFor="coupon-code">
              {f.couponCodeLabel}
              <span className="field-required" aria-hidden="true">*</span>
            </label>
            <input
              id="coupon-code"
              type="text"
              placeholder={f.couponCodePlaceholder}
              value={content.coupon.code}
              onChange={(e) => updateCoupon('code', e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="coupon-valid-until">{f.couponValidUntilLabel}</label>
            <input
              id="coupon-valid-until"
              type="date"
              value={content.coupon.validUntil}
              onChange={(e) => updateCoupon('validUntil', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="coupon-terms">{f.couponTermsLabel}</label>
            <div className="field-textarea-wrap">
              <textarea
                id="coupon-terms"
                placeholder={f.couponTermsPlaceholder}
                rows={4}
                maxLength={couponTermsMax}
                value={content.coupon.terms}
                onChange={(e) => updateCoupon('terms', e.target.value)}
              />
              <span className="field-char-count" aria-live="polite">
                {content.coupon.terms.length} / {couponTermsMax}
              </span>
            </div>
          </div>
          <fieldset className="coupon-button-group">
            <legend>{f.couponButtonLabel}</legend>
            <div className="coupon-button-row">
              <div className="field">
                <label htmlFor="coupon-button-text" className="sr-only">{f.couponButtonTextLabel}</label>
                <input
                  id="coupon-button-text"
                  type="text"
                  placeholder={f.couponButtonTextPlaceholder}
                  value={content.coupon.buttonText}
                  onChange={(e) => updateCoupon('buttonText', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="coupon-button-url" className="sr-only">{f.couponButtonUrlLabel}</label>
                <input
                  id="coupon-button-url"
                  type="url"
                  placeholder={f.couponButtonUrlPlaceholder}
                  value={content.coupon.buttonUrl}
                  onChange={(e) => updateCoupon('buttonUrl', e.target.value)}
                />
              </div>
            </div>
          </fieldset>
        </>
      )}
    </div>
  );
}

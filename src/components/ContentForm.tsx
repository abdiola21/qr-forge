/** Formulaire dynamique selon le type de contenu sélectionné */
import type { QrContent } from '../types/qr';
import { useLanguage } from '../i18n/LanguageContext';
import SocialNetworkPicker from './SocialNetworkPicker';

interface ContentFormProps {
  content: QrContent;
  onChange: (content: QrContent) => void;
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

  return (
    <div className="content-form">
      {content.type === 'url' && (
        <div className="field">
          <label htmlFor="url">{f.urlLabel}</label>
          <input
            id="url"
            type="url"
            placeholder={f.urlPlaceholder}
            value={content.url}
            onChange={(e) => update('url', e.target.value)}
          />
        </div>
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

      {content.type === 'video' && (
        <div className="field">
          <label htmlFor="video-url">{f.videoLabel}</label>
          <input
            id="video-url"
            type="url"
            placeholder={f.videoPlaceholder}
            value={content.url}
            onChange={(e) => update('url', e.target.value)}
          />
          <span className="hint">{f.videoHint}</span>
        </div>
      )}

      {content.type === 'music' && (
        <div className="field">
          <label htmlFor="music-url">{f.musicLabel}</label>
          <input
            id="music-url"
            type="url"
            placeholder={f.musicPlaceholder}
            value={content.url}
            onChange={(e) => update('url', e.target.value)}
          />
          <span className="hint">{f.musicHint}</span>
        </div>
      )}

      {content.type === 'pdf' && (
        <div className="field">
          <label htmlFor="pdf-url">{f.pdfLabel}</label>
          <input
            id="pdf-url"
            type="url"
            placeholder={f.pdfPlaceholder}
            value={content.url}
            onChange={(e) => update('url', e.target.value)}
          />
        </div>
      )}

      {content.type === 'location' && (
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
      )}

      {content.type === 'social' && (
        <SocialNetworkPicker
          value={content.socialNetwork}
          onChange={(network) => update('socialNetwork', network)}
          profileValue={content.socialUsername}
          onProfileChange={(value) => update('socialUsername', value)}
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
            <label htmlFor="note">{f.note}</label>
            <textarea id="note" rows={2} value={content.contact.note} onChange={(e) => updateContact('note', e.target.value)} />
          </div>
        </div>
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
    </div>
  );
}

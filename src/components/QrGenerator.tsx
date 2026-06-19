/** Composant principal : générateur de QR code avec onglets Contenu / Design */
import { useState, useEffect, useCallback } from 'react';
import {
  Globe, User, Video, Music, FileText, MapPin, Share2, Type, Mail, Wifi,
  Download, FileDown, Sparkles, Palette, CheckCircle2, AlertCircle, FileCode2,
  Image, UtensilsCrossed, Briefcase, Smartphone, Link2, TicketPercent,
} from 'lucide-react';
import type { QrContent, QrDesign, QrContentType } from '../types/qr';
import { CONTENT_TYPES } from '../constants/designOptions';
import { buildQrPayload, getPayloadValidationIssue } from '../utils/qrPayload';
import { resolveEffectiveLogo, isAutoSocialLogo } from '../utils/resolveQrLogo';
import { isSocialContentType, resolveSocialNetwork, socialNetworkForType } from '../utils/contentTypeHelpers';
import { emptyAddressFields } from '../utils/addressFields';
import {
  loadHistory, addToHistory, removeHistoryEntry, clearHistory,
  getHistoryLabel, type QrHistoryEntry,
} from '../utils/qrHistory';
import { useQrCode } from '../hooks/useQrCode';
import { useLanguage } from '../i18n/LanguageContext';
import ContentForm from './ContentForm';
import DesignPanel from './DesignPanel';
import LogoPanel from './LogoPanel';
import QrHistoryPanel from './QrHistoryPanel';
import PhonePreviewMockup from './PhonePreviewMockup';
import SocialIcon from './SocialIcon';

const ICONS: Record<string, React.ReactNode> = {
  Globe: <Globe size={18} />,
  User: <User size={18} />,
  Video: <Video size={18} />,
  Music: <Music size={18} />,
  FileText: <FileText size={18} />,
  MapPin: <MapPin size={18} />,
  Share2: <Share2 size={18} />,
  Type: <Type size={18} />,
  Mail: <Mail size={18} />,
  Wifi: <Wifi size={18} />,
  Image: <Image size={18} />,
  UtensilsCrossed: <UtensilsCrossed size={18} />,
  Briefcase: <Briefcase size={18} />,
  Smartphone: <Smartphone size={18} />,
  Link2: <Link2 size={18} />,
  TicketPercent: <TicketPercent size={18} />,
};

/** Valeurs par défaut du contenu */
const defaultContent: QrContent = {
  type: 'url',
  url: '',
  locationQuery: '',
  locationManualLink: false,
  text: '',
  contact: {
    firstName: '', lastName: '', phone: '', email: '',
    company: '', jobTitle: '', website: '', note: '',
    ...emptyAddressFields(),
  },
  socialNetwork: 'instagram',
  socialUsername: '',
  email: '',
  emailSubject: '',
  emailBody: '',
  wifi: { ssid: '', password: '', encryption: 'WPA' },
  coupon: {
    code: '',
    validUntil: new Date().toISOString().slice(0, 10),
    terms: '',
    buttonText: '',
    buttonUrl: '',
  },
  menu: {
    mode: null,
    restaurantName: '',
    sections: [{ title: '', items: [{ name: '', price: '', description: '' }] }],
    pdfUrl: '',
    linkUrl: '',
  },
  business: {
    imageUrl: null,
    company: '',
    title: '',
    subtitle: '',
    searchAddress: '',
    manualEntry: false,
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  },
};

/** Design par défaut (thème néon) */
const defaultDesign: QrDesign = {
  foregroundColor: '#00f5d4',
  backgroundColor: '#0a0e17',
  dotStyle: 'rounded',
  cornerSquareStyle: 'extra-rounded',
  cornerDotStyle: 'dot',
  logoUrl: null,
  logoSize: 25,
  margin: 10,
};

export default function QrGenerator() {
  const { t } = useLanguage();
  const [content, setContent] = useState<QrContent>(defaultContent);
  const [design, setDesign] = useState<QrDesign>(defaultDesign);
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  const [resolution, setResolution] = useState(280);
  const [history, setHistory] = useState<QrHistoryEntry[]>(() => loadHistory());

  const payload = buildQrPayload(content);
  const validationIssue = getPayloadValidationIssue(content);
  const valid = validationIssue === null;
  const effectiveLogo = resolveEffectiveLogo(content, design);
  const autoSocialLogo = isAutoSocialLogo(content, design);
  const { containerRef, downloadPng, downloadPdf, downloadSvg } = useQrCode({
    data: payload,
    design,
    logoUrl: effectiveLogo,
    size: resolution,
    enabled: valid,
  });

  const persistHistory = useCallback(() => {
    if (!valid) return;
    addToHistory({
      content,
      design,
      payload,
      label: getHistoryLabel(content, payload, t.contentTypes[content.type]),
    });
    setHistory(loadHistory());
  }, [valid, content, design, payload, t.contentTypes]);

  // Sauvegarde automatique dans l'historique après 1,5 s de stabilité
  useEffect(() => {
    if (!valid) return;
    const timer = setTimeout(persistHistory, 1500);
    return () => clearTimeout(timer);
  }, [valid, persistHistory]);

  const handleDownload = async (fn: () => Promise<void>) => {
    if (!valid) return;
    await fn();
    persistHistory();
  };

  const handleRestore = (entry: QrHistoryEntry) => {
    setContent(entry.content);
    setDesign(entry.design);
    setActiveTab('content');
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRemoveHistory = (id: string) => {
    removeHistoryEntry(id);
    setHistory(loadHistory());
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleTypeChange = (typeId: QrContentType) => {
    const presetNetwork = socialNetworkForType(typeId);
    setContent({
      ...content,
      type: typeId,
      ...(presetNetwork ? { socialNetwork: presetNetwork } : {}),
    });
  };

  const activeSocialNetwork = isSocialContentType(content.type)
    ? resolveSocialNetwork(content)
    : undefined;

  return (
    <section id="generator" className="generator">
      <div className="generator-card">
        <div className="generator-tabs">
          <button
            type="button"
            className={`tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <Sparkles size={16} />
            {t.generator.tabContent}
          </button>
          <button
            type="button"
            className={`tab ${activeTab === 'design' ? 'active' : ''}`}
            onClick={() => setActiveTab('design')}
          >
            <Palette size={16} />
            {t.generator.tabDesign}
          </button>
        </div>

        <div className="generator-body">
          <div className="generator-left">
            {activeTab === 'content' ? (
              <>
                <div className="type-selector">
                  {CONTENT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className={`type-btn ${content.type === type.id ? 'active' : ''}`}
                      onClick={() => handleTypeChange(type.id)}
                    >
                      {'socialIcon' in type && type.socialIcon
                        ? <SocialIcon network={type.socialIcon} size={18} />
                        : ICONS[type.icon]}
                      <span>{t.contentTypes[type.id]}</span>
                    </button>
                  ))}
                </div>
                <ContentForm content={content} onChange={setContent} />
                <LogoPanel
                  design={design}
                  onChange={setDesign}
                  autoSocialLogo={autoSocialLogo}
                  effectiveLogoUrl={effectiveLogo}
                  socialNetwork={activeSocialNetwork}
                />
              </>
            ) : (
              <DesignPanel design={design} onChange={setDesign} />
            )}
          </div>

          <div className="generator-right">
            <div className="preview-panel">

              <div className={`validation-banner ${valid ? 'valid' : 'invalid'}`}>
                {valid ? (
                  <>
                    <CheckCircle2 size={22} className="validation-icon" />
                    <div className="validation-text">
                      <strong>{t.generator.validTitle}</strong>
                      <p>{t.generator.testScanHint}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle size={22} className="validation-icon" />
                    <div className="validation-text">
                      <p>
                        {validationIssue === 'unsafe_url'
                          ? t.generator.unsafeUrlMsg
                          : t.generator.validationMsg}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="qr-preview-wrap qr-preview-wrap--phone">
                <PhonePreviewMockup
                  hint={t.generator.selectTypeHint}
                  readyHint={t.generator.testScanHint}
                  valid={valid}
                  qrContainerRef={valid ? containerRef : undefined}
                  qrBackground={design.backgroundColor}
                />
              </div>

              <div className="field resolution-field">
                <label htmlFor="resolution">{t.generator.resolution} ({resolution}px)</label>
                <input
                  id="resolution"
                  type="range"
                  min={200}
                  max={600}
                  step={20}
                  value={resolution}
                  onChange={(e) => setResolution(Number(e.target.value))}
                />
              </div>

              <div className="download-actions download-actions-3">
                <button
                  type="button"
                  className="btn-download"
                  onClick={() => handleDownload(downloadPng)}
                  disabled={!valid}
                >
                  <Download size={18} />
                  PNG
                </button>
                <button
                  type="button"
                  className="btn-download"
                  onClick={() => handleDownload(downloadSvg)}
                  disabled={!valid}
                >
                  <FileCode2 size={18} />
                  SVG
                </button>
                <button
                  type="button"
                  className="btn-download"
                  onClick={() => handleDownload(downloadPdf)}
                  disabled={!valid}
                >
                  <FileDown size={18} />
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QrHistoryPanel
        entries={history}
        onRestore={handleRestore}
        onRemove={handleRemoveHistory}
        onClear={handleClearHistory}
      />
    </section>
  );
}

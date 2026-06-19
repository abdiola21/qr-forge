/** Bloc adresse réutilisable : autocomplétion + saisie manuelle */
import type { AddressFields } from '../utils/addressFields';
import { applyAddressSuggestion } from '../utils/addressFields';
import type { AddressSuggestion } from '../utils/addressSearch';
import { useLanguage } from '../i18n/LanguageContext';
import AddressAutocomplete from './AddressAutocomplete';

interface AddressFieldGroupProps {
  idPrefix: string;
  value: AddressFields;
  onChange: (value: AddressFields) => void;
}

export default function AddressFieldGroup({ idPrefix, value, onChange }: AddressFieldGroupProps) {
  const { t } = useLanguage();
  const a = t.form.addressAutocomplete;

  const update = <K extends keyof AddressFields>(key: K, val: AddressFields[K]) => {
    onChange({ ...value, [key]: val });
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    onChange(applyAddressSuggestion(value, suggestion));
  };

  if (!value.manualEntry) {
    return (
      <div className="address-field-group">
        <div className="field">
          <label htmlFor={`${idPrefix}-search`}>{a.searchLabel}</label>
          <div className="business-address-search">
            <AddressAutocomplete
              id={`${idPrefix}-search`}
              value={value.searchAddress}
              placeholder={a.searchPlaceholder}
              onChange={(searchAddress) => onChange({ ...value, searchAddress })}
              onSelect={handleSelect}
            />
            <button
              type="button"
              className="business-manual-btn"
              onClick={() => update('manualEntry', true)}
            >
              {a.manualEntry}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="address-field-group">
      <div className="business-manual-head">
        <span className="hint">{a.manualEntryHint}</span>
        <button
          type="button"
          className="business-manual-back"
          onClick={() => update('manualEntry', false)}
        >
          {a.backToSearch}
        </button>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-street`}>{a.streetLabel}</label>
        <AddressAutocomplete
          id={`${idPrefix}-street`}
          value={value.street || value.searchAddress}
          placeholder={a.streetPlaceholder}
          onChange={(street) => onChange({ ...value, street, searchAddress: street })}
          onSelect={(s) => onChange(applyAddressSuggestion({ ...value, manualEntry: true }, s))}
        />
      </div>
      <div className="contact-grid">
        <div className="field">
          <label htmlFor={`${idPrefix}-city`}>{a.cityLabel}</label>
          <input
            id={`${idPrefix}-city`}
            type="text"
            placeholder={a.cityPlaceholder}
            value={value.city}
            onChange={(e) => update('city', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-zip`}>{a.zipLabel}</label>
          <input
            id={`${idPrefix}-zip`}
            type="text"
            placeholder={a.zipPlaceholder}
            value={value.zip}
            onChange={(e) => update('zip', e.target.value)}
          />
        </div>
      </div>
      <div className="contact-grid">
        <div className="field">
          <label htmlFor={`${idPrefix}-state`}>{a.stateLabel}</label>
          <input
            id={`${idPrefix}-state`}
            type="text"
            placeholder={a.statePlaceholder}
            value={value.state}
            onChange={(e) => update('state', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-country`}>{a.countryLabel}</label>
          <input
            id={`${idPrefix}-country`}
            type="text"
            placeholder={a.countryPlaceholder}
            value={value.country}
            onChange={(e) => update('country', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

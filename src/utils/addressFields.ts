/** Champs d'adresse partagés (recherche + saisie manuelle) */
export interface AddressFields {
  searchAddress: string;
  manualEntry: boolean;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export const emptyAddressFields = (): AddressFields => ({
  searchAddress: '',
  manualEntry: false,
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
});

/** Applique une suggestion d'autocomplétion aux champs d'adresse */
export function applyAddressSuggestion(
  fields: AddressFields,
  suggestion: import('./addressSearch').AddressSuggestion,
): AddressFields {
  return {
    ...fields,
    searchAddress: suggestion.label,
    street: suggestion.street,
    city: suggestion.city,
    state: suggestion.state,
    zip: suggestion.zip,
    country: suggestion.country,
    manualEntry: false,
  };
}

export function hasStructuredAddress(fields: AddressFields): boolean {
  return !!(fields.street.trim() || fields.city.trim());
}

export function formatAddressLabel(fields: AddressFields): string {
  if (hasStructuredAddress(fields) || fields.manualEntry) {
    return [fields.street, fields.city, fields.state, fields.zip, fields.country]
      .filter(Boolean)
      .join(', ')
      .trim();
  }
  return fields.searchAddress.trim();
}

export function buildVCardAddress(fields: AddressFields): { adr: string; label: string } | null {
  const label = formatAddressLabel(fields);
  if (!label) return null;

  if (hasStructuredAddress(fields) || fields.manualEntry) {
    return {
      adr: `ADR;TYPE=work:;;${fields.street};${fields.city};${fields.state};${fields.zip};${fields.country}`,
      label,
    };
  }

  return {
    adr: `ADR;TYPE=work:;;${label};;;;`,
    label,
  };
}

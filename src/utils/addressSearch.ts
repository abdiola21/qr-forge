/** Résultat d'autocomplétion d'adresse (Photon / OpenStreetMap) */
export interface AddressSuggestion {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat: number;
  lon: number;
}

interface PhotonFeature {
  geometry?: { coordinates: [number, number] };
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    state?: string;
    country?: string;
    locality?: string;
    district?: string;
  };
}

function buildStreet(props: PhotonFeature['properties']): string {
  const parts = [props.housenumber, props.street].filter(Boolean);
  if (parts.length > 0) return parts.join(' ');
  return props.name ?? '';
}

function buildLabel(props: PhotonFeature['properties']): string {
  const street = buildStreet(props);
  const city = props.city ?? props.locality ?? props.district ?? '';
  const country = props.country ?? '';

  if (!street && props.name) {
    const placeParts = [props.name, city && city !== props.name ? city : '', props.state, country].filter(Boolean);
    return placeParts.join(', ');
  }

  const parts = [street, props.postcode, city, props.state, country].filter(Boolean);
  return parts.join(', ');
}

function toSuggestion(feature: PhotonFeature, index: number): AddressSuggestion | null {
  const props = feature.properties;
  const label = buildLabel(props);
  if (!label) return null;

  const [lon, lat] = feature.geometry?.coordinates ?? [0, 0];

  return {
    id: `${label}-${index}`,
    label,
    street: buildStreet(props),
    city: props.city ?? props.locality ?? props.district ?? '',
    state: props.state ?? '',
    zip: props.postcode ?? '',
    country: props.country ?? '',
    lat,
    lon,
  };
}

/** Lien Google Maps pour une adresse sélectionnée */
export function suggestionToMapsUrl(suggestion: AddressSuggestion): string {
  if (suggestion.lat !== 0 || suggestion.lon !== 0) {
    return `https://www.google.com/maps/search/?api=1&query=${suggestion.lat},${suggestion.lon}`;
  }
  return `https://maps.google.com/?q=${encodeURIComponent(suggestion.label)}`;
}

/** Recherche d'adresses via Photon (OpenStreetMap) — gratuit, sans clé API */
export async function searchAddresses(
  query: string,
  lang: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({
    q: trimmed,
    limit: '6',
    lang,
  });

  const res = await fetch(`https://photon.komoot.io/api/?${params}`, { signal });
  if (!res.ok) return [];

  const data = (await res.json()) as { features?: PhotonFeature[] };
  const features = data.features ?? [];

  return features
    .map((f, i) => toSuggestion(f, i))
    .filter((s): s is AddressSuggestion => s !== null);
}

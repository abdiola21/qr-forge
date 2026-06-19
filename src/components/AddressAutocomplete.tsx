/** Autocomplétion d'adresse (Photon / OpenStreetMap) */
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, MapPin, Search } from 'lucide-react';
import { searchAddresses, type AddressSuggestion } from '../utils/addressSearch';
import { useLanguage } from '../i18n/LanguageContext';

interface AddressAutocompleteProps {
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
}

function normalizeForMatch(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/** Trouve la plage à surligner dans la chaîne d'origine (accents ignorés) */
function findMatchRange(text: string, query: string): [number, number] | null {
  const q = normalizeForMatch(query.trim());
  if (!q) return null;

  let normalized = '';
  const indexMap: number[] = [];

  for (let i = 0; i < text.length; i++) {
    const chars = normalizeForMatch(text[i]);
    for (let j = 0; j < chars.length; j++) {
      normalized += chars[j];
      indexMap.push(i);
    }
  }

  const idx = normalized.indexOf(q);
  if (idx === -1) return null;

  const start = indexMap[idx];
  const end = indexMap[idx + q.length - 1] + 1;
  return [start, end];
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const range = findMatchRange(text, query);
  if (!range) return <>{text}</>;

  const [start, end] = range;
  return (
    <>
      {text.slice(0, start)}
      <strong className="address-suggestion-match">{text.slice(start, end)}</strong>
      {text.slice(end)}
    </>
  );
}

export default function AddressAutocomplete({
  id,
  value,
  placeholder,
  onChange,
  onSelect,
}: AddressAutocompleteProps) {
  const { lang, t } = useLanguage();
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number } | null>(null);
  const a = t.form.addressAutocomplete;

  const updateDropdownPosition = () => {
    const el = inputRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setDropdownStyle({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (value.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchAddresses(value, lang, controller.signal);
        setSuggestions(results);
        setOpen(results.length > 0 || value.trim().length >= 2);
        setActiveIndex(-1);
        if (results.length > 0) updateDropdownPosition();
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setSuggestions([]);
          setOpen(value.trim().length >= 2);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, lang]);

  useEffect(() => {
    if (!open) return;

    updateDropdownPosition();
    const onScrollOrResize = () => updateDropdownPosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open, suggestions.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target)) return;
      const portal = document.getElementById(`${listId}-portal`);
      if (portal?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [listId]);

  const pick = (suggestion: AddressSuggestion) => {
    onSelect(suggestion);
    setOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      pick(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showEmpty = value.trim().length >= 2 && !loading && suggestions.length === 0 && open;

  const dropdown = open && dropdownStyle && (suggestions.length > 0 || showEmpty) && createPortal(
    <div
      id={`${listId}-portal`}
      className="address-suggestions-portal"
      style={{ top: dropdownStyle.top, left: dropdownStyle.left, width: dropdownStyle.width }}
    >
      {suggestions.length > 0 && (
        <ul id={listId} className="address-suggestions" role="listbox">
          {suggestions.map((s, index) => (
            <li key={s.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`address-suggestion ${index === activeIndex ? 'active' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
              >
                <MapPin size={15} aria-hidden="true" />
                <span><HighlightMatch text={s.label} query={value} /></span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {showEmpty && (
        <p className="address-autocomplete-empty">{a.noResults}</p>
      )}
    </div>,
    document.body,
  );

  return (
    <div className="address-autocomplete" ref={wrapRef}>
      <div className="business-search-input-wrap">
        <Search size={16} className="business-search-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            updateDropdownPosition();
          }}
          onFocus={() => {
            updateDropdownPosition();
            if (suggestions.length > 0 || value.trim().length >= 2) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {loading && (
          <Loader2 size={16} className="address-autocomplete-spinner" aria-hidden="true" />
        )}
      </div>

      {dropdown}
    </div>
  );
}

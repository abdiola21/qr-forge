/** Formulaire Menu : choix du mode + champs associés */
import { ChevronRight, FileText, Link2, Plus, Trash2, Upload } from 'lucide-react';
import type { MenuData, MenuItem, MenuMode, MenuSection } from '../types/qr';
import { useLanguage } from '../i18n/LanguageContext';

interface MenuFormProps {
  menu: MenuData;
  onChange: (menu: MenuData) => void;
}

const MODES: MenuMode[] = ['digital', 'pdf', 'link'];

export default function MenuForm({ menu, onChange }: MenuFormProps) {
  const { t } = useLanguage();
  const m = t.form.menuModes;

  const setMode = (mode: MenuMode) => onChange({ ...menu, mode });

  const updateField = <K extends keyof MenuData>(key: K, value: MenuData[K]) => {
    onChange({ ...menu, [key]: value });
  };

  const updateSection = (index: number, section: MenuSection) => {
    const sections = [...menu.sections];
    sections[index] = section;
    onChange({ ...menu, sections });
  };

  const addSection = () => {
    onChange({
      ...menu,
      sections: [...menu.sections, { title: '', items: [{ name: '', price: '', description: '' }] }],
    });
  };

  const removeSection = (index: number) => {
    if (menu.sections.length <= 1) return;
    onChange({ ...menu, sections: menu.sections.filter((_, i) => i !== index) });
  };

  const updateItem = (sectionIndex: number, itemIndex: number, item: MenuItem) => {
    const section = menu.sections[sectionIndex];
    const items = [...section.items];
    items[itemIndex] = item;
    updateSection(sectionIndex, { ...section, items });
  };

  const addItem = (sectionIndex: number) => {
    const section = menu.sections[sectionIndex];
    updateSection(sectionIndex, {
      ...section,
      items: [...section.items, { name: '', price: '', description: '' }],
    });
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const section = menu.sections[sectionIndex];
    if (section.items.length <= 1) return;
    updateSection(sectionIndex, {
      ...section,
      items: section.items.filter((_, i) => i !== itemIndex),
    });
  };

  const modeIcons = {
    digital: <FileText size={22} strokeWidth={1.75} />,
    pdf: <Upload size={22} strokeWidth={1.75} />,
    link: <Link2 size={22} strokeWidth={1.75} />,
  };

  return (
    <div className="menu-form">
      <p className="menu-form-question">{m.question}</p>
      <div className="menu-mode-list" role="list">
        {MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            role="listitem"
            className={`menu-mode-option ${menu.mode === mode ? 'active' : ''}`}
            onClick={() => setMode(mode)}
            aria-pressed={menu.mode === mode}
          >
            <span className="menu-mode-icon">{modeIcons[mode]}</span>
            <span className="menu-mode-label">{m.options[mode]}</span>
            <ChevronRight size={18} className="menu-mode-chevron" aria-hidden="true" />
          </button>
        ))}
      </div>

      {menu.mode === 'digital' && (
        <div className="menu-digital-fields">
          <div className="field">
            <label htmlFor="menu-restaurant">{m.restaurantLabel}</label>
            <input
              id="menu-restaurant"
              type="text"
              placeholder={m.restaurantPlaceholder}
              value={menu.restaurantName}
              onChange={(e) => updateField('restaurantName', e.target.value)}
            />
          </div>

          {menu.sections.map((section, sIdx) => (
            <div key={sIdx} className="menu-section-block">
              <div className="menu-section-head">
                <div className="field menu-section-title-field">
                  <label htmlFor={`menu-section-${sIdx}`}>{m.sectionLabel}</label>
                  <input
                    id={`menu-section-${sIdx}`}
                    type="text"
                    placeholder={m.sectionPlaceholder}
                    value={section.title}
                    onChange={(e) => updateSection(sIdx, { ...section, title: e.target.value })}
                  />
                </div>
                {menu.sections.length > 1 && (
                  <button
                    type="button"
                    className="menu-icon-btn"
                    onClick={() => removeSection(sIdx)}
                    aria-label={m.removeSection}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="menu-item-row">
                  <div className="field">
                    <label htmlFor={`menu-item-name-${sIdx}-${iIdx}`}>{m.itemNameLabel}</label>
                    <input
                      id={`menu-item-name-${sIdx}-${iIdx}`}
                      type="text"
                      placeholder={m.itemNamePlaceholder}
                      value={item.name}
                      onChange={(e) => updateItem(sIdx, iIdx, { ...item, name: e.target.value })}
                    />
                  </div>
                  <div className="field menu-item-price">
                    <label htmlFor={`menu-item-price-${sIdx}-${iIdx}`}>{m.itemPriceLabel}</label>
                    <input
                      id={`menu-item-price-${sIdx}-${iIdx}`}
                      type="text"
                      placeholder={m.itemPricePlaceholder}
                      value={item.price}
                      onChange={(e) => updateItem(sIdx, iIdx, { ...item, price: e.target.value })}
                    />
                  </div>
                  <div className="field full-width">
                    <label htmlFor={`menu-item-desc-${sIdx}-${iIdx}`}>{m.itemDescLabel}</label>
                    <input
                      id={`menu-item-desc-${sIdx}-${iIdx}`}
                      type="text"
                      placeholder={m.itemDescPlaceholder}
                      value={item.description}
                      onChange={(e) => updateItem(sIdx, iIdx, { ...item, description: e.target.value })}
                    />
                  </div>
                  {section.items.length > 1 && (
                    <button
                      type="button"
                      className="menu-icon-btn menu-item-remove"
                      onClick={() => removeItem(sIdx, iIdx)}
                      aria-label={m.removeItem}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}

              <button type="button" className="menu-add-btn" onClick={() => addItem(sIdx)}>
                <Plus size={16} />
                {m.addItem}
              </button>
            </div>
          ))}

          <button type="button" className="menu-add-btn menu-add-section" onClick={addSection}>
            <Plus size={16} />
            {m.addSection}
          </button>
          <span className="hint">{m.digitalHint}</span>
        </div>
      )}

      {menu.mode === 'pdf' && (
        <div className="field">
          <label htmlFor="menu-pdf-url">{m.pdfLabel}</label>
          <input
            id="menu-pdf-url"
            type="url"
            placeholder={m.pdfPlaceholder}
            value={menu.pdfUrl}
            onChange={(e) => updateField('pdfUrl', e.target.value)}
          />
          <span className="hint">{m.pdfHint}</span>
        </div>
      )}

      {menu.mode === 'link' && (
        <div className="field">
          <label htmlFor="menu-link-url">{m.linkLabel}</label>
          <input
            id="menu-link-url"
            type="url"
            placeholder={m.linkPlaceholder}
            value={menu.linkUrl}
            onChange={(e) => updateField('linkUrl', e.target.value)}
          />
          <span className="hint">{m.linkHint}</span>
        </div>
      )}
    </div>
  );
}

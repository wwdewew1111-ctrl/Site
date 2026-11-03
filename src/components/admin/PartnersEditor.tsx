import { Plus, Trash2 } from 'lucide-react';
import { createId } from '@/lib/format';
import type { Partner } from '@/types';
import { Field } from '@/components/admin/FormField';
import { ImageInput } from '@/components/admin/ImageInput';
import { SortableList } from '@/components/admin/SortableList';

interface PartnersEditorProps {
  partners: Partner[];
  onChange: (partners: Partner[]) => void;
}

export function PartnersEditor({ partners, onChange }: PartnersEditorProps) {
  const updatePartner = (id: string, patch: Partial<Partner>) => {
    onChange(partners.map((partner) => (partner.id === id ? { ...partner, ...patch } : partner)));
  };

  const removePartner = (id: string) => {
    onChange(partners.filter((partner) => partner.id !== id));
  };

  const addPartner = () => {
    onChange([...partners, { id: createId(), name: '', logo: '', url: '' }]);
  };

  return (
    <div className="space-y-4">
      <SortableList
        items={partners}
        label="партнер"
        onReorder={onChange}
        renderItem={(partner) => (
          <div className="space-y-5 rounded-lg border border-border bg-elevated/40 p-4 sm:p-5">
            <div className="flex items-end gap-3">
              <div className="min-w-0 flex-1">
                <Field label="Название партнера">
                  <input
                    type="text"
                    value={partner.name}
                    onChange={(event) => updatePartner(partner.id, { name: event.target.value })}
                    placeholder="Например: NORTHLINE"
                    className="input"
                  />
                </Field>
              </div>
              <button
                type="button"
                onClick={() => removePartner(partner.id)}
                aria-label={`Удалить партнера ${partner.name}`}
                className="btn-icon mb-0.5 hover:border-error-500 hover:text-error-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Field label="Ссылка на сайт партнера" hint="Необязательно.">
              <input
                type="url"
                value={partner.url}
                onChange={(event) => updatePartner(partner.id, { url: event.target.value })}
                placeholder="https://..."
                className="input"
              />
            </Field>
            <ImageInput
              label="Логотип партнера (необязательно)"
              value={partner.logo}
              onChange={(logo) => updatePartner(partner.id, { logo })}
            />
          </div>
        )}
      />

      <button type="button" onClick={addPartner} className="btn-outline">
        <Plus className="h-4 w-4" />
        Добавить партнера
      </button>
    </div>
  );
}

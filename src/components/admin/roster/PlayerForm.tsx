import { useState, type FormEvent } from 'react';
import type { Player } from '@/types';
import { CS2_ROLES } from '@/lib/roles';
import { ImageInput } from '@/components/admin/ImageInput';
import { Field } from '@/components/admin/FormField';

type PlayerErrors = Partial<Record<'nickname' | 'role', string>>;

interface PlayerFormProps {
  initial: Player;
  onSave: (player: Player) => void;
  onCancel: () => void;
}

export function PlayerForm({ initial, onSave, onCancel }: PlayerFormProps) {
  const [form, setForm] = useState<Player>(initial);
  const [errors, setErrors] = useState<PlayerErrors>({});
  const isNew = initial.nickname === '';

  const update = <K extends keyof Player>(key: K, value: Player[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: PlayerErrors = {};
    if (!form.nickname.trim()) nextErrors.nickname = 'Введите никнейм';
    if (!form.role.trim()) nextErrors.role = 'Укажите роль в CS2';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      ...form,
      nickname: form.nickname.trim(),
      name: form.name.trim(),
      role: form.role.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 p-6 sm:p-8">
      <h2 className="pr-10 text-2xl text-text">{isNew ? 'Новый игрок' : 'Редактирование игрока'}</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Никнейм" error={errors.nickname}>
          <input
            type="text"
            value={form.nickname}
            onChange={(event) => update('nickname', event.target.value)}
            placeholder="Например: Kolibri"
            className="input"
          />
        </Field>
        <Field label="Имя">
          <input
            type="text"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="Например: Артём"
            className="input"
          />
        </Field>
      </div>

      <Field label="Роль в CS2" error={errors.role} hint="Выберите из списка или напишите свою роль.">
        <input
          type="text"
          list="cs2-roles"
          value={form.role}
          onChange={(event) => update('role', event.target.value)}
          placeholder="Например: AWPer / Снайпер"
          className="input"
        />
        <datalist id="cs2-roles">
          {CS2_ROLES.map((role) => (
            <option key={role} value={role} />
          ))}
        </datalist>
      </Field>

      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-text">
        <input
          type="checkbox"
          checked={form.isCoach}
          onChange={(event) => update('isCoach', event.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        Это тренер команды
      </label>

      <ImageInput label="Фото игрока (необязательно)" value={form.photo} onChange={(value) => update('photo', value)} />

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-outline">
          Отмена
        </button>
        <button type="submit" className="btn-primary">
          Сохранить игрока
        </button>
      </div>
    </form>
  );
}

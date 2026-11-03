import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useSite } from '@/context/siteStore';
import { createId } from '@/lib/format';
import { Modal } from '@/components/ui/Modal';
import { AdminToolbar } from '@/components/admin/AdminToolbar';
import { SortableList } from '@/components/admin/SortableList';
import { PlayerForm } from './PlayerForm';
import type { Player } from '@/types';

function createBlankPlayer(): Player {
  return {
    id: createId(),
    nickname: '',
    name: '',
    role: '',
    photo: '',
    isCoach: false,
  };
}

export function RosterAdmin() {
  const { data, actions } = useSite();
  const [draft, setDraft] = useState<Player | null>(null);

  const handleDelete = (player: Player) => {
    if (window.confirm(`Удалить игрока ${player.nickname} из состава?`)) {
      actions.deletePlayer(player.id);
    }
  };

  return (
    <div>
      <AdminToolbar
        title="Состав CS2"
        description="Поменяйте никнейм, роль или фото у любого игрока, либо добавьте нового."
        action={
          <button type="button" onClick={() => setDraft(createBlankPlayer())} className="btn-primary">
            <Plus className="h-4 w-4" />
            Добавить игрока
          </button>
        }
      />

      {data.players.length === 0 ? (
        <div className="card p-10 text-center text-muted">В составе пока никого нет.</div>
      ) : (
        <SortableList
          items={data.players}
          label="игрок"
          onReorder={actions.reorderPlayers}
          renderItem={(player) => (
            <div className="card flex items-center gap-4 p-4">
              {player.photo ? (
                <img src={player.photo} alt="" className="h-20 w-16 shrink-0 rounded-md object-cover" />
              ) : (
                <div className="grid h-20 w-16 shrink-0 place-items-center rounded-md bg-elevated font-display text-2xl uppercase text-muted">
                  {player.nickname.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg uppercase text-text">{player.nickname}</p>
                <p className="truncate text-sm text-muted">{player.name}</p>
                <p className="mt-1 truncate text-xs font-semibold uppercase tracking-wider text-accent">{player.role}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => setDraft(player)} className="btn-icon" aria-label={`Редактировать ${player.nickname}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(player)}
                  className="btn-icon hover:border-error-500 hover:text-error-500"
                  aria-label={`Удалить ${player.nickname}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        />
      )}

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.nickname ? 'Редактирование игрока' : 'Новый игрок'}
        widthClass="max-w-2xl"
      >
        {draft && (
          <PlayerForm
            key={draft.id}
            initial={draft}
            onCancel={() => setDraft(null)}
            onSave={async (player) => {
              if (await actions.savePlayer(player)) setDraft(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

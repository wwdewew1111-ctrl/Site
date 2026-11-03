import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react';

interface SortableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => ReactNode;
  label: string;
}

function moveItem<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function SortableList<T extends { id: string }>({ items, onReorder, renderItem, label }: SortableListProps<T>) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const resetDrag = () => {
    setDragId(null);
    setOverId(null);
  };

  const handleDrop = (targetId: string) => {
    resetDrag();
    if (!dragId || dragId === targetId) return;
    const from = items.findIndex((item) => item.id === dragId);
    const to = items.findIndex((item) => item.id === targetId);
    if (from < 0 || to < 0) return;
    onReorder(moveItem(items, from, to));
  };

  const shift = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    onReorder(moveItem(items, index, target));
  };

  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li
          key={item.id}
          onDragOver={(event) => {
            if (!dragId) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            setOverId(item.id);
          }}
          onDragLeave={() => setOverId((current) => (current === item.id ? null : current))}
          onDrop={(event) => {
            event.preventDefault();
            handleDrop(item.id);
          }}
          className={`flex items-stretch gap-3 rounded-xl transition duration-200 ${
            overId === item.id && dragId !== item.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''
          } ${dragId === item.id ? 'opacity-40' : ''}`}
        >
          <div className="flex shrink-0 flex-col items-center justify-center gap-1">
            <button
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', item.id);
                const row = event.currentTarget.closest('li');
                if (row) event.dataTransfer.setDragImage(row, 24, 24);
                setDragId(item.id);
              }}
              onDragEnd={resetDrag}
              aria-label={`Перетащить: ${label}`}
              title="Перетащите, чтобы изменить порядок"
              className="grid h-9 w-9 cursor-grab place-items-center rounded-md border border-border text-muted transition hover:border-accent hover:text-accent active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => shift(index, -1)}
              disabled={index === 0}
              aria-label={`Поднять выше: ${label}`}
              className="grid h-7 w-9 place-items-center rounded-md text-muted transition hover:text-accent disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => shift(index, 1)}
              disabled={index === items.length - 1}
              aria-label={`Опустить ниже: ${label}`}
              className="grid h-7 w-9 place-items-center rounded-md text-muted transition hover:text-accent disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="min-w-0 flex-1">{renderItem(item)}</div>
        </li>
      ))}
    </ul>
  );
}

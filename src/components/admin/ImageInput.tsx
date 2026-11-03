import { useState } from 'react';
import { ImageIcon, Trash2, Upload } from 'lucide-react';
import { readImageFile } from '@/lib/readImageFile';

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ImageInput({ label, value, onChange, error }: ImageInputProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isUploaded = value.startsWith('data:');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      onChange(await readImageFile(file));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Не удалось загрузить изображение');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="grid h-28 w-full shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-elevated sm:w-40">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <input
            type="text"
            value={isUploaded ? '' : value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={isUploaded ? 'Картинка загружена с компьютера' : 'Вставьте ссылку на картинку'}
            aria-label={`${label}: ссылка на картинку`}
            className="input"
          />
          <div className="flex flex-wrap gap-2">
            <label className="btn-outline w-fit cursor-pointer">
              <Upload className="h-4 w-4" />
              {uploading ? 'Загрузка...' : 'Загрузить с компьютера'}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploading}
                onChange={(event) => {
                  void handleFile(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />
            </label>
            {value && (
              <button type="button" onClick={() => onChange('')} className="btn-danger">
                <Trash2 className="h-4 w-4" />
                Удалить
              </button>
            )}
          </div>
          {(uploadError || error) && (
            <p role="alert" className="text-sm text-error-700 dark:text-error-500">
              {uploadError ?? error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

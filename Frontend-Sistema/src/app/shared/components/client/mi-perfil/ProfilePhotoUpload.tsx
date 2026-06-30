import { Camera } from "lucide-react";
import { useRef } from "react";

type ProfilePhotoUploadProps = {
  initials: string;
  previewUrl?: string;
  error?: string;
  onFileSelect: (file: File) => void;
};

export default function ProfilePhotoUpload({
  initials,
  previewUrl,
  error,
  onFileSelect,
}: ProfilePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Foto de perfil"
          className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-teal-100"
        />
      ) : (
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-teal-500 text-2xl font-bold text-white"
          aria-hidden
        >
          {initials}
        </div>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-teal-500 px-4 py-2 text-sm font-semibold text-teal-600 transition hover:bg-teal-50"
        >
          <Camera className="h-4 w-4" />
          Cambiar foto
        </button>
        <p className="mt-1 text-xs text-slate-500">JPG o PNG, máx. 5MB</p>
        {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
      </div>
    </div>
  );
}

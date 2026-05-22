import { useState } from "react";
import { validateTagItem } from "../../utils/validation";
import TagBadge, { type TagVariant } from "./TagBadge";

type TagListInputProps = {
  label: string;
  placeholder: string;
  tags: string[];
  variant: TagVariant;
  onChange: (tags: string[]) => void;
  error?: string;
};

export default function TagListInput({
  label,
  placeholder,
  tags,
  variant,
  onChange,
  error,
}: TagListInputProps) {
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState<string | undefined>();

  const addTag = () => {
    const err = validateTagItem(input);
    if (err) {
      setInputError(err);
      return;
    }
    const trimmed = input.trim();
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setInputError("Ya existe en la lista");
      return;
    }
    onChange([...tags, trimmed]);
    setInput("");
    setInputError(undefined);
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value.slice(0, 80));
            if (inputError) setInputError(undefined);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          maxLength={80}
          className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
        <button
          type="button"
          onClick={addTag}
          className="shrink-0 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
        >
          Agregar
        </button>
      </div>
      {(inputError || error) && (
        <p className="text-xs font-medium text-red-500">{inputError ?? error}</p>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <TagBadge
              key={`${tag}-${i}`}
              label={tag}
              variant={variant}
              onRemove={() => removeTag(i)}
              showWarning={variant === "allergy"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

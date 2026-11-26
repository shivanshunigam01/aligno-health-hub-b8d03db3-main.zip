import { adminApi } from "@/lib/api/services";
import { getToken } from "@/lib/api/client";
import { readFilesAsDataUrls } from "@/lib/imageUpload";
import { X } from "lucide-react";

type Props = {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  uploadFolder?: string;
};

export function ImageUploadField({ label, images, onChange, multiple = true, uploadFolder = "aligno/products" }: Props) {
  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      if (getToken()) {
        const urls = await adminApi.uploadImages(Array.from(files), uploadFolder);
        onChange(multiple ? [...images, ...urls] : urls.slice(0, 1));
      } else {
        const urls = await readFilesAsDataUrls(files);
        onChange(multiple ? [...images, ...urls] : urls.slice(0, 1));
      }
    } catch {
      const urls = await readFilesAsDataUrls(files);
      onChange(multiple ? [...images, ...urls] : urls.slice(0, 1));
    }
    e.target.value = "";
  };

  return (
    <div>
      <p className="mb-2 text-sm font-bold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {images.map((src, i) => (
          <div key={`${src.slice(0, 32)}-${i}`} className="relative h-20 w-20 overflow-hidden rounded-lg border border-border bg-secondary">
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-ink/80 text-white"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white text-[10px] font-semibold text-muted-foreground hover:border-gold hover:text-ink">
          + Add
          <input type="file" accept="image/*" multiple={multiple} className="hidden" onChange={onPick} />
        </label>
      </div>
    </div>
  );
}

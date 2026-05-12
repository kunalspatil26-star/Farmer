import { ImageIcon } from 'lucide-react';

export default function ImagePlaceholder({ className = "aspect-video", iconSize = 48 }) {
  return (
    <div className={`${className} flex items-center justify-center rounded-xl bg-farmsoil text-farmgray`}>
      <ImageIcon size={iconSize} />
    </div>
  );
}
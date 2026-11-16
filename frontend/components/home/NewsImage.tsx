
"use client";

import { useState } from "react";

type NewsImageProps = {
  imageUrl: string | null;
  title: string;
  featured?: boolean;
  sourceName?: string;
};

export default function NewsImage({
  imageUrl,
  title,
  featured = false,
  sourceName = "Хөгжих Капитал ББСБ",
}: NewsImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#EDF3FC]">
      {imageUrl && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-5 text-center">
          <span className="text-[12px] font-semibold text-[#003189]">
            {sourceName} • Мэдээ, мэдээлэл
          </span>
        </div>
      )}

      {featured && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#003189]/45 via-transparent to-transparent" />
      )}
    </div>
  );
}

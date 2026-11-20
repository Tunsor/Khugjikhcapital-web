"use client";

import { useState } from "react";

export default function CopyButton({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (insecure context / denied) — ignore.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label} хуулах`}
      className="shrink-0 rounded-[8px] border border-[#E4EAF4] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#003189] transition-colors hover:border-[#003189]"
    >
      {copied ? "Хуулсан ✓" : "Хуулах"}
    </button>
  );
}

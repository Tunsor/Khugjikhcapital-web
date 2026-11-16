
"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api/client";

export default function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    async function fetchServerYear() {
      const { data, error } = await api<{ year: number }>("/server-time");

      if (error !== null) {
        console.error("Failed to fetch server year:", error);
        return;
      }

      setYear(data.year);
    }

    fetchServerYear();
  }, []);

  return <>{year ?? "—"}</>;
}

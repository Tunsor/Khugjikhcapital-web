
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function CompanyNewsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all"
  );
  const [status, setStatus] = useState(
    searchParams.get("status") ?? "all"
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    const value = query.trim();

    if (value) params.set("q", value);
    if (category !== "all") params.set("category", category);
    if (status !== "all") params.set("status", status);

    const search = params.toString();

    router.push(search ? `/admin/news?${search}` : "/admin/news");
  }

  function handleReset() {
    setQuery("");
    setCategory("all");
    setStatus("all");
    router.push("/admin/news");
  }

  const inputClass =
    "w-full rounded-[10px] border border-[#E4EAF4] bg-white px-4 py-3 text-[12px] outline-none focus:border-brand-blue";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3"
    >
      <div className="min-w-[200px] flex-[2]">
        <label
          htmlFor="news-search"
          className="mb-2 block text-[11px] font-semibold text-[#657487]"
        >
          Хайх
        </label>
        <input
          id="news-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Гарчиг, тайлбараар хайх..."
          className={inputClass}
        />
      </div>

      <div className="min-w-[150px] flex-1">
        <label
          htmlFor="news-category"
          className="mb-2 block text-[11px] font-semibold text-[#657487]"
        >
          Ангилал
        </label>
        <select
          id="news-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={inputClass}
        >
          <option value="all">Бүх ангилал</option>
          <option value="company">Байгууллага</option>
          <option value="announcement">Зарлал</option>
          <option value="promotion">Урамшуулал</option>
          <option value="event">Арга хэмжээ</option>
        </select>
      </div>

      <div className="min-w-[150px] flex-1">
        <label
          htmlFor="news-status"
          className="mb-2 block text-[11px] font-semibold text-[#657487]"
        >
          Төлөв
        </label>
        <select
          id="news-status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={inputClass}
        >
          <option value="all">Бүх төлөв</option>
          <option value="draft">Ноорог</option>
          <option value="published">Нийтлэгдсэн</option>
        </select>
      </div>

      <button
        type="submit"
        className="rounded-[10px] bg-brand-blue px-5 py-3 text-[12px] font-semibold text-white"
      >
        Шүүх
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="rounded-[10px] border border-[#E4EAF4] px-5 py-3 text-[12px] font-semibold text-[#657487]"
      >
        Цэвэрлэх
      </button>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="border border-[#A7ADAF]/40 bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#0D1216] transition hover:border-[#003189] hover:text-[#003189]"
    >
      Гарах
    </button>
  );
}
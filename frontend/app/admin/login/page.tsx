"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; 

import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);

      setErrorMessage(
        "И-мэйл эсвэл нууц үг буруу байна."
      );

      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#F7F8F8]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT */}
        <section className="relative hidden overflow-hidden bg-[#003189] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.05]" />

          <div className="relative">
            <Image
              src="/images/logos/logo-white.png"
              alt="Хөгжих Капитал"
              width={220}
              height={70}
              className="h-auto w-[190px]"
              priority
            />
          </div>

          <div className="relative max-w-[520px]">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-7 bg-[#F4AC38]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#F4AC38]">
                Administration
              </p>
            </div>

            <h1 className="text-[48px] font-semibold leading-[1.05] tracking-[-0.045em]">
              Website
              <br />
              <span className="text-[#F4AC38]">
                management.
              </span>
            </h1>

            <p className="mt-6 max-w-[430px] text-[11px] leading-6 text-white/45">
              Зээлийн хүсэлт, бүтээгдэхүүн, мэдээ болон вебсайтын
              мэдээллийг нэг дороос удирдана.
            </p>
          </div>

          <p className="relative text-[8px] uppercase tracking-[0.15em] text-white/25">
            Хөгжих Капитал ББСБ
          </p>
        </section>

        {/* RIGHT */}
        <section className="flex items-center justify-center px-6 py-16 sm:px-10">
          <div className="w-full max-w-[430px]">

            <div className="lg:hidden">
              <Image
                src="/images/logos/logo-blue.png"
                alt="Хөгжих Капитал"
                width={200}
                height={60}
                className="h-auto w-[170px]"
                priority
              />
            </div>

            <div className="mt-12 lg:mt-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
                Admin panel
              </p>

              <h2 className="mt-4 text-[34px] font-semibold tracking-[-0.04em] text-[#0D1216]">
                Нэвтрэх
              </h2>

              <p className="mt-3 text-[11px] leading-5 text-[#0D1216]/45">
                Удирдлагын системд нэвтрэх мэдээллээ оруулна уу.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="mt-9"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#0D1216]/50"
                >
                  И-мэйл
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@company.mn"
                  className="h-14 w-full border border-[#A7ADAF]/40 bg-white px-4 text-[12px] text-[#0D1216] outline-none transition placeholder:text-[#A7ADAF] focus:border-[#003189]"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="password"
                  className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#0D1216]/50"
                >
                  Нууц үг
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-14 w-full border border-[#A7ADAF]/40 bg-white px-4 text-[12px] text-[#0D1216] outline-none transition placeholder:text-[#A7ADAF] focus:border-[#003189]"
                />
              </div>

              {errorMessage && (
                <div className="mt-5 border-l-2 border-red-500 bg-red-50 px-4 py-3">
                  <p className="text-[10px] text-red-700">
                    {errorMessage}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group mt-7 flex h-14 w-full items-center justify-between bg-[#003189] px-6 text-[11px] font-semibold text-white transition hover:bg-[#0D1216] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {loading
                    ? "Нэвтэрч байна..."
                    : "Нэвтрэх"}
                </span>

                <span className="text-[#F4AC38] transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </form>

            <div className="mt-8 border-t border-[#A7ADAF]/25 pt-5">
              <p className="text-[8px] leading-4 text-[#A7ADAF]">
                Энэхүү хэсэг нь зөвхөн эрх бүхий администраторт
                зориулагдсан.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
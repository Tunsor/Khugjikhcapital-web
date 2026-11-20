import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import CopyButton from "@/components/payment/CopyButton";
import { apiGet } from "@/lib/api/server";
import type { PublicPaymentAccount } from "@/lib/api/types";
import { getSiteSettings } from "@/lib/data/site-settings";

export const instant = false;

export const metadata: Metadata = {
  title: "Төлбөр төлөх",
  description: "Зээлийн төлбөр төлөх дансны мэдээлэл болон QR код.",
};

export default async function PaymentPage() {
  await connection();

  const [{ data, error }, settings] = await Promise.all([
    apiGet<PublicPaymentAccount[]>("/payment-accounts"),
    getSiteSettings(),
  ]);

  if (error) {
    console.error("Public payment accounts error:", error);
  }

  const accounts = data ?? [];

  return (
    <>
      <SiteHeader />

      <main id="main-content">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#003189] text-white">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/[0.06]" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-[260px] w-[260px] rounded-full border border-white/[0.06]" />

          <div className="container-main relative z-10 py-20 md:py-24">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#F4AC38]">
                Төлбөр төлөх
              </p>
            </div>

            <h1 className="mt-7 max-w-[850px] text-[40px] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-[54px] lg:text-[64px]">
              Зээлийн төлбөрөө{" "}
              <span className="text-[#F4AC38]">хялбар</span> төлөөрэй.
            </h1>

            <p className="mt-7 max-w-[580px] text-[13px] leading-7 text-white/70">
              Доорх дансанд шилжүүлэх эсвэл банкны аппликейшнээрээ QR кодыг
              уншуулж төлбөрөө төлнө үү. Гүйлгээний утга дээр зээлийн гэрээний
              дугаар эсвэл регистрийн дугаараа заавал бичнэ үү.
            </p>
          </div>
        </section>

        {/* ACCOUNTS */}
        <section className="bg-[#F8FAFD] py-16 lg:py-24">
          <div className="container-main">
            {accounts.length === 0 ? (
              <div className="rounded-[17px] border border-[#E4EAF4] bg-white px-6 py-16 text-center shadow-[0_4px_18px_#00318908]">
                <h2 className="text-[18px] font-semibold text-[#0D1216]">
                  Төлбөрийн мэдээлэл удахгүй нэмэгдэнэ
                </h2>
                <p className="mt-3 text-[12px] leading-6 text-[#657487]">
                  Дансны мэдээлэл авахыг хүсвэл
                  {settings?.phone ? ` ${settings.phone} утсаар` : " бидэнтэй"}{" "}
                  холбогдоно уу.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {accounts.map((account) => (
                  <article
                    key={account.id}
                    className="flex flex-col gap-6 rounded-[17px] border border-[#E4EAF4] bg-white p-6 shadow-[0_4px_18px_#00318908] sm:flex-row sm:p-8"
                  >
                    {account.qr_image_url && (
                      <div className="mx-auto w-full max-w-[220px] shrink-0 sm:mx-0 sm:w-[180px]">
                        <div className="aspect-square overflow-hidden rounded-[12px] border border-[#E4EAF4] bg-white p-2">
                          <Image
                            src={account.qr_image_url}
                            alt={`${account.bank_name} QR код`}
                            width={220}
                            height={220}
                            unoptimized
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <p className="mt-2 text-center text-[10px] text-[#657487]">
                          Банкны аппаар уншуулна уу
                        </p>
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#F4AC38]">
                        {account.bank_name}
                      </p>

                      <dl className="mt-4 space-y-4">
                        <Field
                          label="Дансны дугаар"
                          value={account.account_number}
                          copy
                          emphasize
                        />
                        <Field
                          label="Данс эзэмшигч"
                          value={account.account_holder}
                        />
                        {account.iban && (
                          <Field label="IBAN" value={account.iban} copy />
                        )}
                      </dl>

                      {account.description && (
                        <p className="mt-5 whitespace-pre-line rounded-[10px] bg-[#FFF7EA] px-4 py-3 text-[11px] leading-5 text-[#7A5414]">
                          {account.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            <p className="mt-10 text-center text-[11px] text-[#657487]">
              QPay-ээр шууд төлөх боломж удахгүй нэмэгдэнэ.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function Field({
  label,
  value,
  copy = false,
  emphasize = false,
}: {
  label: string;
  value: string;
  copy?: boolean;
  emphasize?: boolean;
}) {
  return (
    <div>
      <dt className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#657487]">
        {label}
      </dt>
      <dd className="mt-1.5 flex items-center justify-between gap-3">
        <span
          className={`min-w-0 break-all ${
            emphasize
              ? "text-[22px] font-semibold tracking-[0.02em] text-[#003189]"
              : "text-[14px] font-medium text-[#0D1216]"
          }`}
        >
          {value}
        </span>
        {copy && <CopyButton value={value} label={label} />}
      </dd>
    </div>
  );
}

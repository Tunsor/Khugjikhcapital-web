import { connection } from "next/server";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { adminGet } from "@/lib/api/server";
import type { AdminPaymentAccount } from "@/lib/api/types";

import PaymentAccountsManager from "./PaymentAccountsManager";

export const instant = false;

export default async function AdminPaymentsPage() {
  await connection();

  const result = await adminGet<AdminPaymentAccount[]>("/payment-accounts");

  if (result.forbidden) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFD] px-5">
        <p className="text-sm text-red-700">Админ эрх шаардлагатай.</p>
      </main>
    );
  }

  if (result.error) {
    console.error("Payment accounts fetch error:", result.error);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFD]">
      <div className="min-h-screen md:flex">
        <AdminSidebar />

        <section className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
          <header className="border-b border-[#E4EAF4] pb-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Payments
            </p>

            <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.04em] text-brand-blue">
              Төлбөрийн данс
            </h1>

            <p className="mt-2 max-w-[620px] text-[11px] leading-5 text-[#657487]">
              QPay холбогдох хүртэл зээлийн төлбөр хүлээн авах данс болон QR
              зургийг энд оруулна. Идэвхтэй дансууд вебсайтын “Төлбөр төлөх”
              хуудсанд харагдана.
            </p>
          </header>

          <div className="mt-8">
            {result.error || !result.data ? (
              <p className="rounded-[22px] border border-[#E4EAF4] bg-white p-6 text-[12px] text-red-700">
                Төлбөрийн дансны мэдээлэл уншихад алдаа гарлаа.
              </p>
            ) : (
              <PaymentAccountsManager initialAccounts={result.data} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

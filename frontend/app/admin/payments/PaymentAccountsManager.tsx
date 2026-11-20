"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { adminApi } from "@/lib/api/client";
import type { AdminPaymentAccount } from "@/lib/api/types";

type FormValues = {
  bank_name: string;
  account_holder: string;
  account_number: string;
  iban: string;
  description: string;
  is_active: boolean;
};

const EMPTY_FORM: FormValues = {
  bank_name: "",
  account_holder: "",
  account_number: "",
  iban: "",
  description: "",
  is_active: true,
};

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const inputClass =
  "mt-2 w-full rounded-[10px] border border-[#E4EAF4] bg-white px-4 py-3 text-[11px] text-[#0D1216] outline-none transition-colors placeholder:text-[#A7ADAF] focus:border-[#003189] focus:ring-2 focus:ring-[#003189]/10";

const labelClass =
  "text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]";

const primaryButton =
  "rounded-[10px] bg-[#003189] px-6 py-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#00266C] disabled:cursor-not-allowed disabled:opacity-50";

const outlineButton =
  "rounded-[10px] border border-[#E4EAF4] px-4 py-2 text-[11px] font-semibold text-[#003189] transition-colors hover:border-[#003189] disabled:opacity-50";

const dangerButton =
  "rounded-[10px] border border-red-200 px-4 py-2 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50";

function toForm(account: AdminPaymentAccount): FormValues {
  return {
    bank_name: account.bank_name,
    account_holder: account.account_holder,
    account_number: account.account_number,
    iban: account.iban ?? "",
    description: account.description ?? "",
    is_active: account.is_active,
  };
}

export default function PaymentAccountsManager({
  initialAccounts,
}: {
  initialAccounts: AdminPaymentAccount[];
}) {
  const router = useRouter();
  const [accounts, setAccounts] = useState(initialAccounts);
  const [editingId, setEditingId] = useState<string | "new" | null>(
    initialAccounts.length === 0 ? "new" : null
  );

  function upsert(account: AdminPaymentAccount) {
    setAccounts((current) => {
      const exists = current.some((item) => item.id === account.id);
      return exists
        ? current.map((item) => (item.id === account.id ? account : item))
        : [...current, account];
    });
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= accounts.length) return;

    const next = [...accounts];
    [next[index], next[target]] = [next[target], next[index]];
    setAccounts(next);

    const result = await adminApi("/payment-accounts/order", {
      method: "PUT",
      body: { ids: next.map((item) => item.id) },
    });

    if (result.error !== null) {
      alert(result.error);
      setAccounts(accounts);
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[12px] text-[#657487]">
          Нийт {accounts.length} данс
        </p>

        {editingId !== "new" && (
          <button
            type="button"
            className={primaryButton}
            onClick={() => setEditingId("new")}
          >
            + Данс нэмэх
          </button>
        )}
      </div>

      {editingId === "new" && (
        <AccountForm
          onCancel={accounts.length > 0 ? () => setEditingId(null) : undefined}
          onSaved={(account) => {
            upsert(account);
            setEditingId(account.id);
            router.refresh();
          }}
        />
      )}

      {accounts.map((account, index) =>
        editingId === account.id ? (
          <AccountForm
            key={account.id}
            account={account}
            onCancel={() => setEditingId(null)}
            onSaved={(saved) => {
              upsert(saved);
              router.refresh();
            }}
            onQrChange={(qr_image_url) =>
              upsert({ ...account, qr_image_url })
            }
            onDeleted={() => {
              setAccounts((current) =>
                current.filter((item) => item.id !== account.id)
              );
              setEditingId(null);
              router.refresh();
            }}
          />
        ) : (
          <AccountRow
            key={account.id}
            account={account}
            isFirst={index === 0}
            isLast={index === accounts.length - 1}
            onEdit={() => setEditingId(account.id)}
            onMove={(direction) => move(index, direction)}
          />
        )
      )}
    </div>
  );
}

function AccountRow({
  account,
  isFirst,
  isLast,
  onEdit,
  onMove,
}: {
  account: AdminPaymentAccount;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-[22px] border border-[#E4EAF4] bg-white p-6 sm:flex-row sm:items-center">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#CBD5E1] bg-[#F8FAFD]">
        {account.qr_image_url ? (
          <Image
            src={account.qr_image_url}
            alt={`${account.bank_name} QR`}
            width={80}
            height={80}
            unoptimized
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-[9px] text-[#657487]">QR алга</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[16px] font-semibold text-[#0D1216]">
            {account.bank_name}
          </h3>
          <span
            className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
              account.is_active
                ? "bg-green-50 text-green-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {account.is_active ? "Идэвхтэй" : "Нуугдсан"}
          </span>
        </div>
        <p className="mt-1 text-[13px] font-semibold tracking-[0.04em] text-[#003189]">
          {account.account_number}
        </p>
        <p className="mt-1 text-[11px] text-[#657487]">
          {account.account_holder}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          type="button"
          className={outlineButton}
          disabled={isFirst}
          onClick={() => onMove(-1)}
          aria-label="Дээш зөөх"
        >
          ↑
        </button>
        <button
          type="button"
          className={outlineButton}
          disabled={isLast}
          onClick={() => onMove(1)}
          aria-label="Доош зөөх"
        >
          ↓
        </button>
        <button type="button" className={outlineButton} onClick={onEdit}>
          Засах
        </button>
      </div>
    </div>
  );
}

function AccountForm({
  account,
  onCancel,
  onSaved,
  onQrChange,
  onDeleted,
}: {
  account?: AdminPaymentAccount;
  onCancel?: () => void;
  onSaved: (account: AdminPaymentAccount) => void;
  onQrChange?: (url: string | null) => void;
  onDeleted?: () => void;
}) {
  const [values, setValues] = useState<FormValues>(
    account ? toForm(account) : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setMessage("");
    setError("");

    const result = await adminApi<AdminPaymentAccount>(
      account ? `/payment-accounts/${account.id}` : "/payment-accounts",
      { method: account ? "PUT" : "POST", body: values }
    );

    setSaving(false);

    if (result.error !== null) {
      setError(result.error);
      return;
    }

    setMessage(
      account
        ? "Хадгалагдлаа."
        : "Данс нэмэгдлээ. Одоо QR зургаа оруулж болно."
    );
    onSaved(result.data);
  }

  async function handleDelete() {
    if (!account || deleting) return;
    if (!confirm(`"${account.bank_name}" дансыг устгах уу?`)) return;

    setDeleting(true);
    const result = await adminApi(`/payment-accounts/${account.id}`, {
      method: "DELETE",
    });
    setDeleting(false);

    if (result.error !== null) {
      setError(result.error);
      return;
    }

    onDeleted?.();
  }

  return (
    <div className="rounded-[22px] border border-[#003189]/30 bg-white p-6 shadow-[0_8px_28px_#0031890d] sm:p-8">
      <h2 className="text-[18px] font-semibold text-[#003189]">
        {account ? "Данс засах" : "Шинэ данс"}
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="bank_name">
              Банкны нэр *
            </label>
            <input
              id="bank_name"
              required
              maxLength={200}
              value={values.bank_name}
              onChange={(e) => set("bank_name", e.target.value)}
              placeholder="Хаан банк"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="account_number">
              Дансны дугаар *
            </label>
            <input
              id="account_number"
              required
              maxLength={64}
              value={values.account_number}
              onChange={(e) => set("account_number", e.target.value)}
              placeholder="5000 1234 56"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="account_holder">
              Данс эзэмшигч *
            </label>
            <input
              id="account_holder"
              required
              maxLength={200}
              value={values.account_holder}
              onChange={(e) => set("account_holder", e.target.value)}
              placeholder="Хөгжих Капитал ББСБ ХХК"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="iban">
              IBAN
            </label>
            <input
              id="iban"
              maxLength={64}
              value={values.iban}
              onChange={(e) => set("iban", e.target.value)}
              placeholder="MN12 0005 00..."
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="description">
              Тайлбар / гүйлгээний утга
            </label>
            <textarea
              id="description"
              rows={3}
              maxLength={1000}
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Гүйлгээний утга дээр зээлийн гэрээний дугаар, регистрийн дугаараа бичнэ үү."
              className={`${inputClass} resize-none leading-5`}
            />
          </div>

          <label className="flex items-center gap-3 text-[12px] text-[#31415B] md:col-span-2">
            <input
              type="checkbox"
              checked={values.is_active}
              onChange={(e) => set("is_active", e.target.checked)}
              className="h-4 w-4 accent-[#003189]"
            />
            Вебсайт дээр харуулах
          </label>

          {error && (
            <p className="text-[12px] text-red-700 md:col-span-2">{error}</p>
          )}
          {message && (
            <p className="text-[12px] text-green-700 md:col-span-2">
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button type="submit" disabled={saving} className={primaryButton}>
              {saving ? "Хадгалж байна..." : "Хадгалах"}
            </button>
            {onCancel && (
              <button type="button" onClick={onCancel} className={outlineButton}>
                Хаах
              </button>
            )}
            {account && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className={`${dangerButton} ml-auto`}
              >
                {deleting ? "Устгаж байна..." : "Устгах"}
              </button>
            )}
          </div>
        </form>

        {account ? (
          <QrUpload
            accountId={account.id}
            initialUrl={account.qr_image_url}
            onChange={(url) => onQrChange?.(url)}
          />
        ) : (
          <div className="flex items-center justify-center rounded-[12px] border border-dashed border-[#CBD5E1] bg-[#F8FAFD] p-6 text-center text-[11px] leading-5 text-[#657487]">
            Дансаа хадгалсны дараа QR зураг оруулах боломжтой.
          </div>
        )}
      </div>
    </div>
  );
}

function QrUpload({
  accountId,
  initialUrl,
  onChange,
}: {
  accountId: string;
  initialUrl: string | null;
  onChange: (url: string | null) => void;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const preview = fileUrl ?? initialUrl;

  // Revoke the previous object URL when it is replaced or on unmount.
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  function selectFile(selected: File | null) {
    setFile(selected);
    setFileUrl(selected ? URL.createObjectURL(selected) : null);
  }

  async function upload() {
    if (!file || busy) return;

    setBusy(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const result = await adminApi<{ qr_image_url: string }>(
      `/payment-accounts/${accountId}/qr`,
      { method: "POST", body: formData }
    );

    setBusy(false);

    if (result.error !== null) {
      setError(result.error);
      return;
    }

    selectFile(null);
    onChange(result.data.qr_image_url);
    router.refresh();
  }

  async function remove() {
    if (busy || !confirm("QR зургийг устгах уу?")) return;

    setBusy(true);
    setError("");

    const result = await adminApi(`/payment-accounts/${accountId}/qr`, {
      method: "DELETE",
    });

    setBusy(false);

    if (result.error !== null) {
      setError(result.error);
      return;
    }

    onChange(null);
    router.refresh();
  }

  return (
    <div>
      <p className={labelClass}>QR зураг</p>

      <div className="mt-2 flex aspect-square items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#CBD5E1] bg-[#F8FAFD] p-3">
        {preview ? (
          <Image
            src={preview}
            alt="QR зураг"
            width={240}
            height={240}
            unoptimized
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-[11px] text-[#657487]">QR оруулаагүй</span>
        )}
      </div>

      <input
        type="file"
        accept={IMAGE_TYPES.join(",")}
        disabled={busy}
        onChange={(event) => {
          const selected = event.target.files?.[0] ?? null;
          setError("");

          if (
            selected &&
            (selected.size > MAX_IMAGE_SIZE ||
              !IMAGE_TYPES.includes(selected.type))
          ) {
            selectFile(null);
            setError("PNG, JPG, WebP төрлийн 5 MB-аас бага зураг сонгоно уу.");
            event.target.value = "";
            return;
          }

          selectFile(selected);
        }}
        className="mt-3 block w-full text-[11px] text-[#31415B] file:mr-3 file:rounded-[9px] file:border-0 file:bg-[#EDF3FC] file:px-3 file:py-2 file:font-semibold file:text-[#003189] hover:file:bg-[#E4EAF4]"
      />

      {error && <p className="mt-3 text-[11px] text-red-700">{error}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={upload}
          disabled={!file || busy}
          className={primaryButton}
        >
          {busy ? "Түр хүлээнэ үү..." : "QR хадгалах"}
        </button>
        {initialUrl && !file && (
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className={dangerButton}
          >
            QR устгах
          </button>
        )}
      </div>
    </div>
  );
}

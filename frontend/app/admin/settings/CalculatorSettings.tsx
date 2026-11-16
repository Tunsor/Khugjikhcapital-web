
"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/client";

type CalculatorSetting = {
  id: string;
  loan_name: string;
  monthly_interest_rate: number;
  max_dti_ratio: number;
  min_term_months: number;
  max_term_months: number;
  max_loan_amount: number | null;
  is_active: boolean;
};

export default function CalculatorSettings() {
  const [settings, setSettings] = useState<CalculatorSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const result = await adminApi<CalculatorSetting[]>("/calculator-settings");

      if (result.error !== null) {
          throw new Error(result.error || "Тохиргоо уншихад алдаа гарлаа.");
        }

        setSettings(result.data ?? []);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Алдаа гарлаа."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadSettings();
  }, []);

  function updateSetting(
    id: string,
    field: keyof CalculatorSetting,
    value: number | boolean | null
  ) {
    setSettings((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  async function saveSetting(setting: CalculatorSetting) {
    setSavingId(setting.id);
    setMessage("");

    try {
      const result = await adminApi<CalculatorSetting>("/calculator-settings", { method: "PATCH", body: setting });

      if (result.error !== null) {
        throw new Error(result.error || "Хадгалахад алдаа гарлаа.");
      }

      setMessage(`${setting.loan_name} — тохиргоо хадгалагдлаа.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Алдаа гарлаа."
      );
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Тохиргоо уншиж байна...</p>;
  }

  return (
    <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Зээлийн тооцоолуурын тохиргоо
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Зээлийн төрөл тус бүрийн хүү, хугацаа, дээд хэмжээ болон
          өр-орлогын харьцааг удирдана.
        </p>
      </div>

      {message && (
        <div
          role="status"
          className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800"
        >
          {message}
        </div>
      )}

      <div className="space-y-5">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="rounded-xl border border-gray-200 p-5"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="font-semibold text-gray-900">
                {setting.loan_name}
              </h3>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={setting.is_active}
                  onChange={(event) =>
                    updateSetting(
                      setting.id,
                      "is_active",
                      event.target.checked
                    )
                  }
                />
                Идэвхтэй
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-gray-700">
                <span>Сарын хүү (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.001"
                  value={setting.monthly_interest_rate}
                  onChange={(event) =>
                    updateSetting(
                      setting.id,
                      "monthly_interest_rate",
                      Number(event.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm text-gray-700">
                <span>Өр-орлогын харьцаа (%)</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="0.01"
                  value={setting.max_dti_ratio}
                  onChange={(event) =>
                    updateSetting(
                      setting.id,
                      "max_dti_ratio",
                      Number(event.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm text-gray-700">
                <span>Хамгийн бага хугацаа (сар)</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={setting.min_term_months}
                  onChange={(event) =>
                    updateSetting(
                      setting.id,
                      "min_term_months",
                      Number(event.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm text-gray-700">
                <span>Хамгийн их хугацаа (сар)</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={setting.max_term_months}
                  onChange={(event) =>
                    updateSetting(
                      setting.id,
                      "max_term_months",
                      Number(event.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm text-gray-700 sm:col-span-2">
                <span>Зээлийн дээд хэмжээ (₮)</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Хязгааргүй"
                  value={setting.max_loan_amount ?? ""}
                  onChange={(event) =>
                    updateSetting(
                      setting.id,
                      "max_loan_amount",
                      event.target.value === ""
                        ? null
                        : Number(event.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                disabled={savingId !== null}
                onClick={() => void saveSetting(setting)}
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {savingId === setting.id
                  ? "Хадгалж байна..."
                  : "Тохиргоо хадгалах"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

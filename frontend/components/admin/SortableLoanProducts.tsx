
"use client";

import Link from "next/link";
import { useState } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { adminApi } from "@/lib/api/client";

type LoanProduct = {
  id: string;
  title: string;
  slug: string;
  interest_rate: number | string;
  max_amount: number | string | null;
  max_term: number;
  is_active: boolean;
  sort_order: number;
};

function SortableItem({
  product,
}: {
  product: LoanProduct;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 border-b border-[#E4EAF4] bg-white px-5 py-4 transition-colors last:border-b-0 hover:bg-[#EDF3FC]/40 ${
        isDragging
          ? "z-50 opacity-60 shadow-[0_12px_30px_#00318918]"
          : ""
      }`}
    >
      {/* DRAG HANDLE */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-[10px] text-[#657487] transition-colors hover:bg-brand-light hover:text-brand-blue active:cursor-grabbing"
        aria-label={`${product.title} дараалал өөрчлөх`}
      >
        <span className="text-[20px] leading-none">
          ☰
        </span>
      </button>

      {/* PRODUCT */}
      <div className="min-w-0 flex-1">
        <Link
          href={`/admin/loans/${product.id}`}
          className="group inline-block max-w-full"
        >
          <p className="truncate text-[11px] font-semibold text-brand-dark transition-colors group-hover:text-brand-blue">
            {product.title}
          </p>

          <p className="mt-1 truncate text-[9px] text-[#657487]">
            /{product.slug}
          </p>

          <p className="mt-1 text-[8px] font-semibold text-brand-blue opacity-0 transition-opacity group-hover:opacity-100">
            Засах →
          </p>
        </Link>
      </div>

      {/* INTEREST */}
      <div className="hidden text-right sm:block">
        <p className="text-[9px] text-[#657487]">
          Сарын хүү
        </p>

        <p className="mt-1 text-[11px] font-semibold text-brand-dark">
          {Number(product.interest_rate)}%
        </p>
      </div>

      {/* TERM */}
      <div className="hidden min-w-[70px] text-right md:block">
        <p className="text-[9px] text-[#657487]">
          Хугацаа
        </p>

        <p className="mt-1 text-[11px] font-semibold text-brand-dark">
          {product.max_term} сар
        </p>
      </div>

      {/* STATUS */}
      <div className="min-w-[70px] text-right">
        <span
          className={`inline-flex rounded-[10px] px-2 py-1 text-[8px] font-semibold ${
            product.is_active
              ? "bg-green-50 text-green-700"
              : "bg-[#EDF3FC] text-[#657487]"
          }`}
        >
          {product.is_active
            ? "Идэвхтэй"
            : "Идэвхгүй"}
        </span>
      </div>
    </div>
  );
}

export default function SortableLoanProducts({
  products,
}: {
  products: LoanProduct[];
}) {
  const [items, setItems] = useState(products);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex(
      (item) => item.id === active.id
    );

    const newIndex = items.findIndex(
      (item) => item.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedItems = arrayMove(
      items,
      oldIndex,
      newIndex
    );

    // Дэлгэц дээр шинэ дараалал харуулах
    setItems(reorderedItems);

    // API-д дараалал хадгалах
    const { error } = await adminApi("/loan-products/order", {
      method: "PUT",
      body: { ids: reorderedItems.map((product) => product.id) },
    });

    if (error !== null) {
      console.error("Loan product reorder error:", error);

      // Алдаа гарвал өмнөх дараалалд буцаах
      setItems(items);
    }
  }

  return (
    <DndContext
      id="loan-products-dnd"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="overflow-hidden rounded-[22px] border border-[#E4EAF4] bg-white shadow-[0_8px_30px_#00318908]">
          {items.map((product) => (
            <SortableItem
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

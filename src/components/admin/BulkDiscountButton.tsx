"use client";

import { useState } from "react";
import { Percent } from "lucide-react";
import BulkDiscountModal from "./BulkDiscountModal";

export default function BulkDiscountButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="border border-gold/40 text-gold px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gold/10 transition-colors"
      >
        <Percent size={18} />
        Storewide Promotion
      </button>
      {isOpen && <BulkDiscountModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

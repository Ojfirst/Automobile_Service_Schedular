import { useEffect, useRef, type ReactNode } from "react";
import PartsForm from "../parts-form";
import { createPortal } from "react-dom";
import type { PartWithDetails } from "../parts-table";
import type { Supplier } from "@prisma/client";

// Render form when requested


export const renderPartsForm = (showPartsForm: boolean, setShowPartsForm: (show: boolean) => void, editingPart: PartWithDetails | null, setEditingPart: (part: PartWithDetails | null) => void, editSuppliers: Supplier[]) => {
  if (!showPartsForm) return null;

  const Modal = ({ children, onClose }: { children: ReactNode; onClose: () => void }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', onKey);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = prevOverflow;
      };
    }, [onClose]);

    const modal = (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />

        <div ref={containerRef} className="relative w-full max-w-3xl max-h-[90vh] overflow-auto z-10">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden p-5">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-lg font-medium text-gray-200">{editingPart ? 'Edit Part' : 'Create Part'}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-300 hover:bg-gray-800"
                title="Close"
              >
                ✕
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    );

    return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
  };

  return (
    <Modal onClose={() => { setShowPartsForm(false); setEditingPart(null); }}>
      <PartsForm
        part={editingPart ?? undefined}
        suppliers={editSuppliers}
        onCancel={() => { setShowPartsForm(false); setEditingPart(null); }}
        onSuccess={() => { setShowPartsForm(false); setEditingPart(null); }}
      />
    </Modal>
  );
}
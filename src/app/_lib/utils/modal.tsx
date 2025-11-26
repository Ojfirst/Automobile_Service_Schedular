'use client';

interface ConfirmCancelModalProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmCancelModal({
  open,
  onConfirm,
  onClose,
}: ConfirmCancelModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl w-full max-w-sm shadow-xl">

        <h2 className="text-lg font-semibold text-white mb-2">
          Cancel Appointment?
        </h2>

        <p className="text-gray-300 mb-6">
          Are you sure you want to cancel this appointment?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            No, Keep It
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Yes, Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

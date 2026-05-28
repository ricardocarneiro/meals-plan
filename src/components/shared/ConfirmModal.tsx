import { AlertTriangle } from "lucide-react";
import { brand } from "../../theme/tokens";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export function ConfirmModal({
  open, title, message,
  confirmLabel = "Confirm", cancelLabel = "Cancel",
  onConfirm, onCancel, loading,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
         onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: "#FEF3C7" }}>
            <AlertTriangle size={22} style={{ color: "#D97706" }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1" style={{ color: brand.ink }}>{title}</h3>
            <p className="text-sm" style={{ color: brand.inkSoft }}>{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onCancel} disabled={loading}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
                  style={{ color: brand.ink }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} disabled={loading}
                  className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:shadow-md transition disabled:opacity-60"
                  style={{ background: brand.primary }}>
            {loading ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
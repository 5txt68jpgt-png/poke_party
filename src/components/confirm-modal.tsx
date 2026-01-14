"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = "キャンセル",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white w-full max-w-sm rounded-pokemon p-5 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* アイコン */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-full">
            <span className="text-3xl">⚠️</span>
          </div>
        </div>

        {/* タイトル */}
        <h2 className="text-lg font-bold text-center text-gray-800 mb-2">
          {title}
        </h2>

        {/* メッセージ */}
        <p className="text-center text-gray-600 mb-6">
          {message}
        </p>

        {/* ボタン */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 min-h-[44px] bg-gray-200 text-gray-700 rounded-pokemon font-bold hover:bg-gray-300 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 min-h-[44px] bg-red-500 text-white rounded-pokemon font-bold hover:bg-red-600 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const ConfirmModal = ({
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-xl bg-zinc-900 border border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          {title}
        </h2>

        <p className="text-sm text-zinc-400 mb-6">
          {description}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700
                       text-sm font-medium text-white
                       disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

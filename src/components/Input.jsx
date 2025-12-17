const Input = ({ label, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-zinc-400">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg bg-zinc-800 border border-zinc-700
                   px-4 py-2 text-white outline-none
                   focus:border-indigo-500 focus:ring-2
                   focus:ring-indigo-500/20"
      />
    </div>
  );
};

export default Input;

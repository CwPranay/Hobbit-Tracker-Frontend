const Button = ({ loading, children, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading}
      className="w-full rounded-lg bg-indigo-600 py-2
                 font-medium text-white transition
                 hover:bg-indigo-700 disabled:opacity-50"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;

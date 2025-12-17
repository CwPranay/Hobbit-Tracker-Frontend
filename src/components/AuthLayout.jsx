const AuthLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

export default function LoginLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite">
      <svg className="w-10 h-10 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  );
}
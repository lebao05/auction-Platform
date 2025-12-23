function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-300 border-t-blue-600" />
    </div>
  );
}

export default Spinner;

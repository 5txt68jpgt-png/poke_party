export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-pokemon-blue-200 border-t-pokemon-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-pokemon-blue-600 font-medium">パーティを生成中...</p>
    </div>
  );
}

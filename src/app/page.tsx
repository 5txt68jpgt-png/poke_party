import { PartyGenerator } from "@/components/party-generator";

export default function Home() {
  return (
    <main className="min-h-screen pokemon-pattern">
      <div className="max-w-md mx-auto p-4 pb-8">
        {/* ゲーム風ヘッダー */}
        <header className="mb-6 pokemon-header">
          <h1 className="text-3xl font-bold tracking-wide">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300">
              PokeParty
            </span>
          </h1>
          <p className="text-white/70 text-sm mt-1">
            ポケモンバトルごっこ用パーティ生成
          </p>
        </header>

        {/* メインコンテンツ */}
        <div className="pokemon-card p-4">
          <PartyGenerator />
        </div>
      </div>
    </main>
  );
}

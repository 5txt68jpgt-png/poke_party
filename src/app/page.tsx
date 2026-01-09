import { PartyGenerator } from "@/components/party-generator";

export default function Home() {
  return (
    <main className="max-w-md mx-auto p-4 pb-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          PokeParty
        </h1>
        <p className="text-center text-gray-600 text-sm">
          ポケモンバトルごっこ用パーティ生成
        </p>
      </header>

      <PartyGenerator />
    </main>
  );
}

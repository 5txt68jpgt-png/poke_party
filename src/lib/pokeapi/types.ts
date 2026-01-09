// PokeAPI レスポンス型

// 共通: 名前付きリソース
export interface NamedAPIResource {
  name: string;
  url: string;
}

// 共通: 多言語名
export interface Name {
  name: string;
  language: NamedAPIResource;
}

// ポケモン基本情報
export interface PokeAPIPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
  types: {
    slot: number;
    type: NamedAPIResource;
  }[];
  moves: {
    move: NamedAPIResource;
    version_group_details: {
      level_learned_at: number;
      move_learn_method: NamedAPIResource;
      version_group: NamedAPIResource;
    }[];
  }[];
}

// ポケモン種族情報（日本語名取得用）
export interface PokeAPISpecies {
  id: number;
  name: string;
  names: Name[];
}

// 技情報
export interface PokeAPIMove {
  id: number;
  name: string;
  type: NamedAPIResource;
  damage_class: NamedAPIResource;
  names: Name[];
  flavor_text_entries: {
    flavor_text: string;
    language: NamedAPIResource;
    version_group: NamedAPIResource;
  }[];
}

// タイプ情報
export interface PokeAPIType {
  id: number;
  name: string;
  names: Name[];
}

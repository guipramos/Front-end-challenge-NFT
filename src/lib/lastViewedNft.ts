const STORAGE_KEY = "kurio:last-viewed-nft";

/** Guarda o id do último NFT visitado (usado pelo breadcrumb "Mercado"). */
export function setLastViewedNftId(id: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, id);
  } catch {
    // sessionStorage indisponível (ex.: modo privado): o breadcrumb usa o fallback.
  }
}

export function getLastViewedNftId(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

const STORAGE_KEY = "kurio:last-viewed-nft";

export function setLastViewedNftId(id: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, id);
  } catch {
    return;
  }
}

export function getLastViewedNftId(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

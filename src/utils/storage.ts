export function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem('omni_favorites');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  // Default favorites
  return ['basic-calc', 'currency-converter', 'conversion-hub', 'password-generator', 'qr-generator', 'quick-timer'];
}

export function saveStoredFavorites(favs: string[]) {
  try {
    localStorage.setItem('omni_favorites', JSON.stringify(favs));
  } catch {
    // ignore
  }
}

export function getStoredRecents(): string[] {
  try {
    const raw = localStorage.getItem('omni_recents');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return ['basic-calc', 'conversion-hub', 'pomodoro-timer'];
}

export function addStoredRecent(toolId: string) {
  try {
    const current = getStoredRecents().filter(id => id !== toolId);
    current.unshift(toolId);
    localStorage.setItem('omni_recents', JSON.stringify(current.slice(0, 8)));
  } catch {
    // ignore
  }
}

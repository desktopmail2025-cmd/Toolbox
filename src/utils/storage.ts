export function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem('omni_favorites');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Clear legacy hardcoded mock favorites if present
        const legacyDefaults = ['basic-calc', 'currency-converter', 'conversion-hub', 'password-generator', 'qr-generator', 'quick-timer'];
        if (parsed.length === legacyDefaults.length && legacyDefaults.every(id => parsed.includes(id))) {
          localStorage.setItem('omni_favorites', JSON.stringify([]));
          return [];
        }
        return parsed.filter((item): item is string => typeof item === 'string');
      }
    }
  } catch {
    // ignore
  }
  // Starred page starts at 0 tools unless user explicitly adds tools to favorites
  return [];
}

export function saveStoredFavorites(favs: string[]) {
  try {
    const safeFavs = Array.isArray(favs) ? favs : [];
    localStorage.setItem('omni_favorites', JSON.stringify(safeFavs));
  } catch {
    // ignore
  }
}

export function getStoredRecents(): string[] {
  try {
    const raw = localStorage.getItem('omni_recents');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
    }
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

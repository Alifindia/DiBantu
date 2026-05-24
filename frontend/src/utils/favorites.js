// Favorites management using localStorage
const STORAGE_KEY = 'temujasa_favorites';

export const getFavorites = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const isFavorite = (technicianId) => {
  return getFavorites().includes(technicianId);
};

export const toggleFavorite = (technicianId) => {
  const favorites = getFavorites();
  const idx = favorites.indexOf(technicianId);
  if (idx >= 0) {
    favorites.splice(idx, 1);
  } else {
    favorites.push(technicianId);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  return favorites;
};

export const removeFavorite = (technicianId) => {
  const favorites = getFavorites().filter(id => id !== technicianId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  return favorites;
};

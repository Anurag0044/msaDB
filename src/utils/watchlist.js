export const getWatchlist = () => {
    try {
        return JSON.parse(localStorage.getItem('watchlist') || '[]');
    } catch {
        return [];
    }
};

export const addToWatchlist = (item) => {
    const current = getWatchlist();
    if (!current.find(i => i.id === item.id)) {
        localStorage.setItem('watchlist', JSON.stringify([...current, item]));
        return true;
    }
    return false; // Already in watchlist
};

export const removeFromWatchlist = (id) => {
    const current = getWatchlist();
    localStorage.setItem('watchlist', JSON.stringify(current.filter(i => i.id !== id)));
};

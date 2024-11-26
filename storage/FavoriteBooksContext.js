import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoriteBooksContext = createContext();

export const FavoriteBooksProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    };

    const addFavorite = async (book) => {
        const updatedFavorites = [...favorites, book];
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const removeFavorite = async (bookId) => {
        const updatedFavorites = favorites.filter((book) => book.id !== bookId);
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const isFavorite = (bookId) => favorites.some((book) => book.id === bookId);

    return (
        <FavoriteBooksContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </FavoriteBooksContext.Provider>
    );
};

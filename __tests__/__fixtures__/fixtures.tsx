import React, { PropsWithChildren } from 'react';
import { addDays, subDays, format } from 'date-fns';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

// Dates
export const today = format(new Date(), 'yyyy-MM-dd');
export const thirtyDaysAgo = format(subDays(today, 30), 'yyyy-MM-dd');
export const fifteenDaysAgo = format(subDays(today, 15), 'yyyy-MM-dd');
export const yesterday = format(subDays(today, 1), 'yyyy-MM-dd');
export const tomorrow = format(addDays(today, 1), 'yyyy-MM-dd');
export const fifteenDaysFromNow = format(addDays(today, 15), 'yyyy-MM-dd');

// Books
export const littleSecretsBook = {
    id: '1',
    title: 'Little Secrets',
    authors: ['Jennifer Hillier'],
    releaseDateRaw: '2020-05-07',
    coverImage: 'https://book.com/little-secrets-cover.jpg',
    description: 'Marin had the perfect life...',
};

export const hiddenPicturesBook = {
    id: '2',
    title: 'Hidden Pictures',
    authors: ['Jason Rekulak'],
    releaseDateRaw: '2024-10-17',
    coverImage: 'https://book.com/hidden-pictures-cover.jpg',
};

export const itBook = {
    id: '3',
    title: 'It',
    authors: ['Stephen King'],
    releaseDateRaw: '1987-10-01',
    coverImage: null,
    description: 'Welcome to Derry, Maine...',
    language: 'en',
    isbn10: '0450411435',
    isbn13: '9780450411434',
};

export const veryAnticipatedBook = {
    id: '4',
    title: 'Very anticipated book!',
    authors: ['Famous Author'],
    releaseDateRaw: format(fifteenDaysFromNow, 'yyyy-MM-dd'),
    coverImage: null,
};

const mockAddFavorite = jest.fn();
const mockRemoveFavorite = jest.fn();
const mockIsFavorite = jest.fn();
export const FavoriteBooksContextWrapper = ({
    children,
    favorites = [],
    addFavorite = mockAddFavorite,
    removeFavorite = mockRemoveFavorite,
    isFavorite = mockIsFavorite,
}: PropsWithChildren<{
    favorites?: any[];
    addFavorite?: typeof mockAddFavorite;
    removeFavorite?: typeof mockRemoveFavorite;
    isFavorite?: typeof mockIsFavorite;
}>) => {
    return (
        <FavoriteBooksContext.Provider
            value={{
                favorites,
                addFavorite,
                removeFavorite,
                isFavorite,
            }}
        >
            {children}
        </FavoriteBooksContext.Provider>
    );
};

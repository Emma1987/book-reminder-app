import React, { PropsWithChildren } from 'react';
import { addDays, subDays, format } from 'date-fns';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

// Dates
export const today = new Date();
export const thirtyDaysAgo = subDays(today, 30);
export const fifteenDaysAgo = subDays(today, 15);
export const yesterday = subDays(today, 1);
export const tomorrow = addDays(today, 1);
export const fifteenDaysFromNow = addDays(today, 15);

export const formattedDates = {
    thirtyDaysAgo: format(thirtyDaysAgo, 'yyyy-MM-dd'),
    fifteenDaysAgo: format(fifteenDaysAgo, 'yyyy-MM-dd'),
    yesterday: format(yesterday, 'yyyy-MM-dd'),
    today: format(today, 'yyyy-MM-dd'),
    tomorrow: format(tomorrow, 'yyyy-MM-dd'),
    fifteenDaysFromNow: format(fifteenDaysFromNow, 'yyyy-MM-dd'),
};

// Books
export const littleSecretsBook = {
    id: '1',
    title: 'Little Secrets',
    authors: ['Jennifer Hillier'],
    publicationDateStr: '2020-05-07',
    publicationDate: new Date('2020-05-07'),
    coverImage: 'https://book.com/little-secrets-cover.jpg',
    description: 'Marin had the perfect life...',
};

export const hiddenPicturesBook = {
    id: '2',
    title: 'Hidden Pictures',
    authors: ['Jason Rekulak'],
    publicationDateStr: '2024-10-17',
    publicationDate: new Date('2024-10-17'),
    coverImage: 'https://book.com/hidden-pictures-cover.jpg',
};

export const itBook = {
    id: '3',
    title: 'It',
    authors: ['Stephen King'],
    publicationDateStr: '1987-10-01',
    publicationDate: new Date('1987-10-01'),
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
    publicationDateStr: format(fifteenDaysFromNow, 'yyyy-MM-dd'),
    publicationDate: fifteenDaysFromNow,
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


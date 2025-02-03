// BookDetailModal.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { itBook } from '@/__tests__/__fixtures__/fixtures';
import { BookDetailModal } from '@/components/BookDetailModal';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

describe('BookDetailModal', () => {
    it('renders book details correctly', () => {
        const { getByText, debug } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </FavoriteBooksContext.Provider>
        );

        expect(getByText('It')).toBeTruthy();
        expect(getByText('Author: Stephen King')).toBeTruthy();
        expect(getByText('Release date: 1 Oct 1987')).toBeTruthy();
        expect(getByText('ISBN10: 0450411435')).toBeTruthy();
        expect(getByText('ISBN13: 9780450411434')).toBeTruthy();
        expect(getByText('Welcome to Derry, Maine...')).toBeTruthy();
    });

    it('calls addFavorite when Add to favorites button is pressed', () => {
        const mockAddFavorite = jest.fn();
        
        const { getByText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: mockAddFavorite, removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </FavoriteBooksContext.Provider>
        );

        fireEvent.press(getByText('Add to favorites'));
        expect(mockAddFavorite).toHaveBeenCalledWith(itBook);
    });

    it('calls removeFavorite when Remove from favorites button is pressed', () => {
        const mockRemoveFavorite = jest.fn();
        const mockIsFavorite = jest.fn();
        mockIsFavorite.mockReturnValue(true);

        const { getByText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: mockRemoveFavorite, isFavorite: mockIsFavorite}}>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </FavoriteBooksContext.Provider>
        );

        fireEvent.press(getByText('Remove from favorites'));
        expect(mockRemoveFavorite).toHaveBeenCalledWith(itBook.id);
    });

    it('matches the snapshot', () => {
        const tree = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </FavoriteBooksContext.Provider>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});

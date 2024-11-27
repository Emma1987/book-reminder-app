// BookDetailModal.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { itBook, FavoriteBooksContextWrapper } from '@/__tests__/__fixtures__/fixtures';
import { BookDetailModal } from '@/components/BookDetailModal';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

describe('BookDetailModal', () => {
    it('renders book details correctly', () => {
        const { getByText, debug } = render(
            <FavoriteBooksContextWrapper>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </FavoriteBooksContextWrapper>
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
            <FavoriteBooksContextWrapper addFavorite={mockAddFavorite}>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </FavoriteBooksContextWrapper>
        );

        fireEvent.press(getByText('Add to favorites'));
        expect(mockAddFavorite).toHaveBeenCalledWith(itBook);
    });

    it('calls removeFavorite when Remove from favorites button is pressed', () => {
        const mockRemoveFavorite = jest.fn();
        const mockIsFavorite = jest.fn();
        mockIsFavorite.mockReturnValue(true);

        const { getByText } = render(
            <FavoriteBooksContextWrapper isFavorite={mockIsFavorite} removeFavorite={mockRemoveFavorite}>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </FavoriteBooksContextWrapper>
        );

        fireEvent.press(getByText('Remove from favorites'));
        expect(mockRemoveFavorite).toHaveBeenCalledWith(itBook.id);
    });

    it('matches the snapshot', () => {
        const tree = render(
            <FavoriteBooksContextWrapper>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </FavoriteBooksContextWrapper>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});

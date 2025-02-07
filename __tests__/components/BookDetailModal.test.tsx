// BookDetailModal.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { itBook } from '@/__tests__/__fixtures__/fixtures';
import { ContextWrapper } from '@/__tests__/__fixtures__/context';
import { BookDetailModal } from '@/components/BookDetailModal';

jest.mock('expo-localization');

describe('BookDetailModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders book details correctly', () => {
        const { getByText, debug } = render(
            <ContextWrapper>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </ContextWrapper>
        );

        expect(getByText('It')).toBeTruthy();
        expect(getByText('Author: Stephen King')).toBeTruthy();
        expect(getByText('Release date: Oct 1, 1987')).toBeTruthy();
        expect(getByText('ISBN10: 0450411435')).toBeTruthy();
        expect(getByText('ISBN13: 9780450411434')).toBeTruthy();
        expect(getByText('Welcome to Derry, Maine...')).toBeTruthy();
    });

    it('calls addFavorite when Add to favorites button is pressed', () => {
        const mockAddFavorite = jest.fn();
        
        const { getByText } = render(
            <ContextWrapper addFavorite={mockAddFavorite}>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </ContextWrapper>
        );

        fireEvent.press(getByText('Add this book to your favorites'));
        expect(mockAddFavorite).toHaveBeenCalledWith(itBook);
    });

    it('calls removeFavorite when Remove from favorites button is pressed', () => {
        const mockRemoveFavorite = jest.fn();
        const mockIsFavorite = jest.fn();
        mockIsFavorite.mockReturnValue(true);

        const { getByText } = render(
            <ContextWrapper removeFavorite={mockRemoveFavorite} isFavorite={mockIsFavorite}>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </ContextWrapper>
        );

        fireEvent.press(getByText('Remove from favorites'));
        expect(mockRemoveFavorite).toHaveBeenCalledWith(itBook.id);
    });

    it('matches the snapshot', () => {
        const tree = render(
            <ContextWrapper>
                <BookDetailModal visible={true} onClose={jest.fn()} book={itBook} />
            </ContextWrapper>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});

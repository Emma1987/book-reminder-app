import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { hiddenPicturesBook, FavoriteBooksContextWrapper } from '@/__tests__/__fixtures__/fixtures';
import { BookCardWatchList } from '@/components/BookCardWatchList';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

jest.spyOn(Alert, 'alert');

describe('BookCardWatchList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders book information correctly', () => {
        const { getByText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardWatchList book={hiddenPicturesBook} />
            </FavoriteBooksContextWrapper>
        );

        expect(getByText('Hidden Pictures')).toBeTruthy();
        expect(getByText('Jason Rekulak')).toBeTruthy();
        expect(getByText('Release date: 17 Oct 2024')).toBeTruthy();
    });

    it('renders only first author when several authors', () => {
        const mockBookWithSeveralAuthors = {
            ...hiddenPicturesBook,
            authors: ['Stephen King', 'Jason Rekulak'],
        };

        const { getByText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardWatchList book={mockBookWithSeveralAuthors} />
            </FavoriteBooksContextWrapper>
        );

        expect(getByText('Hidden Pictures')).toBeTruthy();
        expect(getByText('Stephen King')).toBeTruthy();
        expect(getByText('Release date: 17 Oct 2024')).toBeTruthy();
    });

    it('renders placeholder image when coverImage is null', () => {
        const mockBookWithoutCover = {
            ...hiddenPicturesBook,
            coverImage: null,
        };

        const { getByLabelText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardWatchList book={mockBookWithoutCover} />
            </FavoriteBooksContextWrapper>
        );

        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual(require('@/assets/images/book-cover-placeholder.jpg'));
    });

    it('renders book cover when coverImage is provided', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardWatchList book={hiddenPicturesBook} />
            </FavoriteBooksContextWrapper>
        );
    
        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual({ uri: 'https://book.com/hidden-pictures-cover.jpg' });
    });

    it('shows a confirmation dialog when delete button is clicked', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardWatchList book={hiddenPicturesBook} />
            </FavoriteBooksContextWrapper>
        );

        const deleteButton = getByLabelText('Remove from favorites');
        fireEvent.press(deleteButton);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Remove Favorite',
            `Are you sure you want to remove "Hidden Pictures" from your favorites?`,
            expect.any(Array)
        );
    });

    it('calls removeFavorite when confirmation is accepted', () => {
        const mockRemoveFavorite = jest.fn();
        
        const { getByLabelText } = render(
            <FavoriteBooksContextWrapper removeFavorite={mockRemoveFavorite}>
                <BookCardWatchList book={hiddenPicturesBook} />
            </FavoriteBooksContextWrapper>
        );

        const deleteButton = getByLabelText('Remove from favorites');
        fireEvent.press(deleteButton);

        const [, positiveButton] = Alert.alert.mock.calls[0][2];
        positiveButton.onPress();

        expect(mockRemoveFavorite).toHaveBeenCalledWith(hiddenPicturesBook.id);
    });

    it('does not call removeFavorite when cancellation is chosen', () => {
        const mockRemoveFavorite = jest.fn();

        const { getByLabelText } = render(
            <FavoriteBooksContextWrapper removeFavorite={mockRemoveFavorite}>
                <BookCardWatchList book={hiddenPicturesBook} />
            </FavoriteBooksContextWrapper>
        );

        const deleteButton = getByLabelText('Remove from favorites');
        fireEvent.press(deleteButton);

        const [negativeButton] = Alert.alert.mock.calls[0][2];
        negativeButton.onPress();

        expect(mockRemoveFavorite).not.toHaveBeenCalled();
    });

    it('has correct accessibility labels for the button', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardWatchList book={hiddenPicturesBook} />
            </FavoriteBooksContextWrapper>
        );

        const deleteButton = getByLabelText('Remove from favorites');
        expect(deleteButton).toBeTruthy();
    });

    it('matches the snapshot', () => {
        const tree = render(
            <FavoriteBooksContextWrapper>
                <BookCardWatchList book={hiddenPicturesBook} />
            </FavoriteBooksContextWrapper>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});

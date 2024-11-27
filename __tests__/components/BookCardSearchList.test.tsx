import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { littleSecretsBook, FavoriteBooksContextWrapper } from '@/__tests__/__fixtures__/fixtures';
import { BookCardSearchList } from '@/components/BookCardSearchList';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

describe('BookCardSearchList', () => {
    it('renders book information correctly', () => {
        const { getByText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </FavoriteBooksContextWrapper>
        );

        expect(getByText('Little Secrets')).toBeTruthy();
        expect(getByText('Jennifer Hillier')).toBeTruthy();
        expect(getByText('Release date: 7 May 2020')).toBeTruthy();
    });

    it('renders only first author when several authors', () => {
        const mockBookWithSeveralAuthors = {
            ...littleSecretsBook,
            authors: ['Stephen King', 'Jennifer Hillier'],
        };

        const { getByText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardSearchList book={mockBookWithSeveralAuthors} onSeeDetails={jest.fn()} />
            </FavoriteBooksContextWrapper>
        );

        expect(getByText('Little Secrets')).toBeTruthy();
        expect(getByText('Stephen King')).toBeTruthy();
        expect(getByText('Release date: 7 May 2020')).toBeTruthy();
    });

    it('renders placeholder image when coverImage is null', () => {
        const mockBookWithoutCover = {
            ...littleSecretsBook,
            coverImage: null,
        };
        
        const { getByLabelText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardSearchList book={mockBookWithoutCover} onSeeDetails={jest.fn()} />
            </FavoriteBooksContextWrapper>
        );

        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual(require('@/assets/images/book-cover-placeholder.jpg'));
    });

    it('renders book cover when coverImage is provided', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </FavoriteBooksContextWrapper>
        );
    
        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual({ uri: 'https://book.com/little-secrets-cover.jpg' });
    });

    it('adds book to favorite when favorite button is clicked and book is not favorite', () => {
        const mockAddFavorite = jest.fn();
        const mockIsFavorite = jest.fn();
        mockIsFavorite.mockReturnValue(false);

        const { getByLabelText, rerender } = render(
            <FavoriteBooksContextWrapper isFavorite={mockIsFavorite} addFavorite={mockAddFavorite}>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </FavoriteBooksContextWrapper>
        );

        const favoriteButton = getByLabelText('Add to favorites');
        fireEvent.press(favoriteButton);

        expect(mockAddFavorite).toHaveBeenCalledWith(littleSecretsBook);
    });

    it('removes book from favorites when favorite button is clicked and book is already favorite', () => {
        const mockRemoveFavorite = jest.fn();
        const mockIsFavorite = jest.fn();
        mockIsFavorite.mockReturnValue(true);

        const { getByLabelText, rerender } = render(
            <FavoriteBooksContextWrapper isFavorite={mockIsFavorite} removeFavorite={mockRemoveFavorite}>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </FavoriteBooksContextWrapper>
        );

        const favoriteButton = getByLabelText('Add to favorites');
        fireEvent.press(favoriteButton);

        expect(mockRemoveFavorite).toHaveBeenCalledWith(littleSecretsBook.id);
    });

    it('calls onSeeDetails when details button is clicked', () => {
        const mockOnSeeDetails = jest.fn();

        const { getByLabelText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={mockOnSeeDetails} />
            </FavoriteBooksContextWrapper>
        );

        const detailsButton = getByLabelText('View book details');
        fireEvent.press(detailsButton);

        expect(mockOnSeeDetails).toHaveBeenCalledWith(littleSecretsBook);
    });

    it('has correct accessibility labels for the buttons', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContextWrapper>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </FavoriteBooksContextWrapper>
        );

        const favoriteButton = getByLabelText('Add to favorites');
        expect(favoriteButton).toBeTruthy();

        const detailsButton = getByLabelText('View book details');
        expect(detailsButton).toBeTruthy();
    });

    it('matches the snapshot', () => {
        const tree = render(
            <FavoriteBooksContextWrapper>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </FavoriteBooksContextWrapper>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});

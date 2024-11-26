import React from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddBookScreen from '@/app/(tabs)/add';
import { useBookSearch } from '@/hooks/useBookSearch';
import { littleSecretsBook } from '@/__tests__/__fixtures__/fixtures';

jest.mock('@/hooks/useBookSearch', () => ({
    useBookSearch: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useFocusEffect: jest.fn(),
}));

jest.mock('@/components/BookCardSearchList', () => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');

    return {
        BookCardSearchList: ({ book, onSeeDetails }) => (
            <TouchableOpacity onPress={onSeeDetails} testID={`book-card-${book.id}`}>
                <Text>{book.title}</Text>
            </TouchableOpacity>
        ),
    };
});

jest.mock('@/components/BookDetailModal', () => {
    const React = require('react');
    const { Button, Text, View } = require('react-native');

    return {
        BookDetailModal: ({ visible, onClose, book }) => {
            if (!visible) return null;
        
            return (
                <View testID="book-detail-modal">
                    <Text>{book.description}</Text>
                    <Button onPress={onClose} title="Close" />
                </View>
            )
        },
    };
});

describe('AddBookScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders input field and search icon initially', () => {
        useBookSearch.mockReturnValue({ books: [], isLoading: false });
        const { getByPlaceholderText, getByLabelText } = render(
            <AddBookScreen />
        );

        expect(getByPlaceholderText('Search book')).toBeTruthy();
        expect(getByLabelText('Search icon')).toBeTruthy();
    });

    it('renders clear icon when input is filled', () => {
        useBookSearch.mockReturnValue({ books: [], isLoading: false });
        const { getByPlaceholderText, getByLabelText, queryByLabelText } = render(
            <AddBookScreen />
        );
            
        const input = getByPlaceholderText('Search book');
        
        // Initially, only the search icon should be present
        expect(queryByLabelText('Search icon')).toBeTruthy();
        expect(queryByLabelText('Clear search input')).toBeNull();
    
        // Simulate entering text in the input
        fireEvent.changeText(input, 'Test Search');
    
        // After entering text, the clear icon should appear
        expect(queryByLabelText('Clear search input')).toBeTruthy();
        expect(queryByLabelText('Search icon')).toBeNull();
    });

    it('displays a spinner when loading', () => {
        useBookSearch.mockReturnValue({ books: [], isLoading: true });
        const { getByText, getByAccessibilityHint } = render(
            <AddBookScreen />
        );

        expect(getByAccessibilityHint('Loading')).toBeTruthy();
        expect(getByText('Loading books...')).toBeTruthy();
    });

    it('renders search results', async () => {
        useBookSearch.mockReturnValue({ books: [littleSecretsBook], isLoading: false });
        const { getByText, queryByText } = render(
            <AddBookScreen />
        );

        expect(queryByText('Little Secrets')).toBeTruthy();
        expect(queryByText('No results found')).toBeNull();
    });

    it('shows empty state when no books found', async () => {
        useBookSearch.mockReturnValue({ books: [], isLoading: false });
        const { getByText, getByPlaceholderText } = render(
            <AddBookScreen />
        );

        const input = getByPlaceholderText('Search book');
        fireEvent.changeText(input, 'Test Search');

        expect(getByText('No results found')).toBeTruthy();
    });

    it('clears search when close icon is pressed', () => {
        const { getByPlaceholderText, getByLabelText } = render(
            <AddBookScreen />
        );

        const input = getByPlaceholderText('Search book');
        fireEvent.changeText(input, 'Some search');
        expect(input.props.value).toBe('Some search');

        const clearIcon = getByLabelText('Clear search input');
        fireEvent.press(clearIcon);
        expect(input.props.value).toBe('');
    });

    it('opens and closes the book detail modal', async () => {
        useBookSearch.mockReturnValue({ books: [littleSecretsBook], isLoading: false });
        const { getByText, queryByText, queryByTestId, debug } = render(
            <AddBookScreen />
        );

        const bookCard = getByText('Little Secrets');

        fireEvent.press(bookCard);

        expect(queryByTestId('book-detail-modal')).toBeTruthy();
        expect(queryByText('Marin had the perfect life...')).toBeTruthy();

        const closeButton = getByText('Close');
        fireEvent.press(closeButton);

        expect(queryByTestId('book-detail-modal')).toBeNull();
        expect(queryByText('Marin had the perfect life...')).toBeNull();
    });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '@/components/EmptyState';

jest.mock('expo-localization');

describe('EmptyState', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders title, description, and button', () => {
        const mockPress = jest.fn();
        const { getByText } = render(
            <EmptyState
                title="No Books"
                description="Add some books to get started!"
                buttonText="Add Book"
                onButtonPress={mockPress}
            />
        );

        expect(getByText('No Books')).toBeTruthy();
        expect(getByText('Add some books to get started!')).toBeTruthy();

        fireEvent.press(getByText('Add Book'));
        expect(mockPress).toHaveBeenCalled();
    });

    it('renders the image with the correct source', () => {
        const testImage = { uri: 'https://example.com/test.png' };

        const { getByLabelText } = render(
            <EmptyState
                title="No Data"
                description="Add items to see them here."
                imageSource={testImage}
            />
        );

        const image = getByLabelText('No books found illustration');
        expect(image.props.source).toEqual(testImage);
    });

    it('does not render the button if buttonText or onButtonPress is missing', () => {
        const { queryByText } = render(
            <EmptyState
                title="No Data"
                description="Add items to see them here."
                imageSource={{ uri: 'https://example.com/test.png' }}
            />
        );
    
        expect(queryByText('Add Item')).toBeNull();
    });

    it('provides correct accessibility labels for elements', () => {
        const { getByRole } = render(
            <EmptyState
                title="No Data"
                description="Add items to see them here."
                imageSource={{ uri: 'https://example.com/test.png' }}
                buttonText="Browse books"
                onButtonPress={() => {}}
            />
        );
    
        const button = getByRole('button');
        expect(button.props.accessibilityLabel).toBe('Browse books');
    });

    it('matches the snapshot', () => {
        const tree = render(
            <EmptyState
                title="No Data"
                description="Add items to see them here."
                imageSource={{ uri: 'https://example.com/test.png' }}
                buttonText="Add Item"
                onButtonPress={() => {}}
            />
        ).toJSON();
    
        expect(tree).toMatchSnapshot();
    });
});

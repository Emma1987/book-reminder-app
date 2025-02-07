import React from 'react';
import { render } from '@testing-library/react-native';
import { EmptySearchResult } from '@/components/EmptySearchResult';

jest.mock('expo-localization');

describe('EmptySearchResult', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText, getByLabelText } = render(<EmptySearchResult />);

        expect(getByText('No results found')).toBeTruthy();
        expect(getByText('Have you tried searching by the book title and author?')).toBeTruthy();

        const image = getByLabelText('No books found');
        expect(image).toBeTruthy();
    });

    it('matches the snapshot', () => {
        const tree = render(<EmptySearchResult />).toJSON();
    
        expect(tree).toMatchSnapshot();
    });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { EmptySearchResult } from '@/components/EmptySearchResult';

describe('EmptySearchResult', () => {
    it('renders correctly', () => {
        const { getByText, getByLabelText } = render(<EmptySearchResult />);

        expect(getByText('No results found')).toBeTruthy();
        expect(getByText('Have you tried searching with the title of the book and the author?')).toBeTruthy();

        const image = getByLabelText('No books found');
        expect(image).toBeTruthy();
    });

    it('matches the snapshot', () => {
        const tree = render(<EmptySearchResult />).toJSON();
    
        expect(tree).toMatchSnapshot();
    });
});

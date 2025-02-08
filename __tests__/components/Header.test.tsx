import React from 'react';
import { render } from '@testing-library/react-native';
import { Header } from '@/components/Header';

describe('Header', () => {
    it('renders the logo correctly', () => {
        const { getByLabelText } = render(<Header />);

        const logo = getByLabelText('Next Read logo');
        expect(logo).toBeTruthy();
    });

    it('renders the subheader when subHeaderText is passed', () => {
        const { getByText } = render(
            <Header subHeaderText='I am extremely happy with this app 🥳' />
        );

        expect(getByText('I am extremely happy with this app 🥳')).toBeTruthy();
    });

    it('renders the subheader icon when subHeaderIcon is passed', () => {
        const { getByText } = render(
            <Header subHeaderText='I am extremely happy with this app 🥳' subHeaderIcon='heart' />
        );

        expect(getByText('I am extremely happy with this app 🥳')).toBeTruthy();
        expect(getByText('heart')).toBeTruthy();
    });

    it('does not render subheader when subHeaderText is not passed', () => {
        const { queryByTestId } = render(<Header />);

        expect(queryByTestId('subheader-container')).toBeNull();
    });

    it('matches the snapshot', () => {
        const tree = render(
            <Header subHeaderText='I am extremely happy with this app 🥳' subHeaderIcon='heart' />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { EmptyNotification } from '@/components/EmptyNotification';

describe('EmptyNotification', () => {
    it('renders title, description, and button', () => {
        const { getByText } = render(
            <EmptyNotification />
        );

        expect(getByText('No notification yet!')).toBeTruthy();
    });

    it('matches the snapshot', () => {
        const tree = render(
            <EmptyNotification />
        ).toJSON();
    
        expect(tree).toMatchSnapshot();
    });
});

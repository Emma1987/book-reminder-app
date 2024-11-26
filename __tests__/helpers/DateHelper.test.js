import { formatDateStr, getDateObject } from '@/helpers/DateHelper';

describe('DateHelper functions', () => {
    describe('test function formatDateStr', () => {
        it('formats a full date string correctly', () => {
            expect(formatDateStr('2024-11-20')).toBe('20 Nov 2024');
            expect(formatDateStr('2024-11')).toBe('Nov 2024');
            expect(formatDateStr('2024')).toBe('2024');

            expect(formatDateStr('22')).toBeNull();
            expect(formatDateStr(12)).toBeNull();
            expect(formatDateStr('invalid-date')).toBeNull();
            expect(getDateObject(null)).toBeNull();
        });
    });

    describe('getDateObject', () => {
        it('parses a full date string correctly', () => {
            expect(getDateObject('2024-11-20')).toEqual(new Date(2024, 10, 20));
            
            // Expect to get a Date object for November 2024
            expect(getDateObject('2024-11')).toEqual(new Date(2024, 10));
            
            // Expect to get a Date object for Jan 1, 2024
            expect(getDateObject('2024')).toEqual(new Date(2024, 0, 1));

            expect(getDateObject('22')).toBeNull();
            expect(getDateObject(12)).toBeNull();
            expect(getDateObject('invalid-date')).toBeNull();
            expect(getDateObject(null)).toBeNull();
        });
    });
});

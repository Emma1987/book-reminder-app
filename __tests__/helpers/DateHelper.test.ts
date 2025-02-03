import { addMinutes, subMinutes, subHours, subDays, subMonths } from 'date-fns';
import { formatDateStr, getDateObject, timeAgo } from '@/helpers/DateHelper';

describe('DateHelper functions', () => {
    describe('formatDateStr function', () => {
        it('formats a full date with dayFirst param correctly', () => {
            expect(formatDateStr('2024-11-20')).toBe('20 Nov 2024');
            expect(formatDateStr('2024-11')).toBe('Nov 2024');
            expect(formatDateStr('2024')).toBe('2024');

            expect(formatDateStr('22')).toBeNull();
            expect(formatDateStr(12)).toBeNull();
            expect(formatDateStr('invalid-date')).toBeNull();
            expect(getDateObject(null)).toBeNull();
        });

        it('formats a full date with monthFirst param correctly', () => {
            expect(formatDateStr('2024-11-20', 'monthFirst')).toBe('Nov 20, 2024');
            expect(formatDateStr('2024-11', 'monthFirst')).toBe('Nov 2024');
            expect(formatDateStr('2024', 'monthFirst')).toBe('2024');

            expect(formatDateStr('22', 'monthFirst')).toBeNull();
            expect(formatDateStr(12, 'monthFirst')).toBeNull();
            expect(formatDateStr('invalid-date', 'monthFirst')).toBeNull();
            expect(getDateObject(null, 'monthFirst')).toBeNull();
        });
    });

    describe('getDateObject function', () => {
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

    describe('timeAgo function', () => {
        it('should return "now" for the current date', () => {
            const currentDate = new Date();
            expect(timeAgo(currentDate)).toBe('now');
        });

        it('should return "now" for a future date', () => {
            const inOneMinute = addMinutes(new Date(), 1)
            expect(timeAgo(inOneMinute)).toBe('now');
        });

        it('should return "1 minute ago" for 1 minute ago', () => {
            const oneMinuteAgo = subMinutes(new Date(), 1)
            expect(timeAgo(oneMinuteAgo)).toBe('1 minute ago');
        });

        it('should return "5 minutes ago" for 5 minutes ago', () => {
            const fiveMinutesAgo = subMinutes(new Date(), 5);
            expect(timeAgo(fiveMinutesAgo)).toBe('5 minutes ago');
        });

        it('should return "1 hour ago" for 1 hour ago', () => {
            const oneHourAgo = subHours(new Date(), 1);
            expect(timeAgo(oneHourAgo)).toBe('1 hour ago');
        });

        it('should return "3 hours ago" for 3 hours ago', () => {
            const threeHoursAgo = subHours(new Date(), 3);
            expect(timeAgo(threeHoursAgo)).toBe('3 hours ago');
        });

        it('should return "1 day ago" for 1 day ago', () => {
            const oneDayAgo = subDays(new Date(), 1);
            expect(timeAgo(oneDayAgo)).toBe('1 day ago');
        });

        it('should return "7 days ago" for 7 days ago', () => {
            const sevenDaysAgo = subDays(new Date(), 7);
            expect(timeAgo(sevenDaysAgo)).toBe('7 days ago');
        });

        it('should return "1 month ago" for 1 month ago', () => {
            const oneMonthAgo = subMonths(new Date(), 1);
            expect(timeAgo(oneMonthAgo)).toBe('1 month ago');
        });

        it('should return "3 months ago" for 3 months ago', () => {
            const threeMonthsAgo = subMonths(new Date(), 3);
            expect(timeAgo(threeMonthsAgo)).toBe('3 months ago');
        });

        it('should return "14 months ago" for 14 months ago', () => {
            const threeMonthsAgo = subMonths(new Date(), 14);
            expect(timeAgo(threeMonthsAgo)).toBe('14 months ago');
        });

        it('should return "" for a wrong date', () => {
            const threeMonthsAgo = new Date('wrong_date');
            expect(timeAgo(threeMonthsAgo)).toBe('');
        });
    });
});

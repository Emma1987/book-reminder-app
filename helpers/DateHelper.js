import { parse, isBefore, startOfDay } from 'date-fns';

export const formatDateStr = (dateString: string): string | null => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fullDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    const monthYearPattern = /^\d{4}-\d{2}$/;
    const yearPattern = /^\d{4}$/;
    
    if (fullDatePattern.test(dateString)) {
        const [year, month, day] = dateString.split('-');
        const monthName = months[parseInt(month, 10) - 1];

        return `${day} ${monthName} ${year}`;
    }

    if (monthYearPattern.test(dateString)) {
        const [year, month] = dateString.split('-');
        const monthName = months[parseInt(month, 10) - 1];

        return `${monthName} ${year}`;
    }

    if (yearPattern.test(dateString)) {
        return dateString;
    }

    return null;
};

export const getDateObject = (dateString: string): Date | null => {
    const fullDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    const monthYearPattern = /^\d{4}-\d{2}$/;
    const yearPattern = /^\d{4}$/;

    if (fullDatePattern.test(dateString)) {
        return parse(dateString, 'yyyy-MM-dd', new Date());
    }

    if (monthYearPattern.test(dateString)) {
        return parse(dateString, 'yyyy-MM', new Date());
    }

    if (yearPattern.test(dateString)) {
        return parse(dateString, 'yyyy', new Date());
    }

    return null;
}

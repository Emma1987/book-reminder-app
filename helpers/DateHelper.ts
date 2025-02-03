import { parse } from 'date-fns';

export const formatDateStr = (
    dateString: string | null,
    formatType: 'dayFirst' | 'monthFirst' = 'dayFirst',
): string | null => {
    if (!dateString) return null;

    const fullDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    const monthYearPattern = /^\d{4}-\d{2}$/;
    const yearPattern = /^\d{4}$/;

    try {
        if (fullDatePattern.test(dateString)) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'short' });
            const year = date.getFullYear();

            if (formatType === 'dayFirst') {
                return `${day} ${month} ${year}`;
            } else {
                return `${month} ${day}, ${year}`;
            }
        }

        if (monthYearPattern.test(dateString)) {
            const [year, month] = dateString.split('-');
            const date = new Date(Number(year), Number(month) - 1);

            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                year: 'numeric',
            }).format(date);
        }

        if (yearPattern.test(dateString)) {
            return dateString;
        }
    } catch (error) {
        console.error('Error formatting date:', error);
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
};

export const timeAgo = (date: Date) => {
    const now = new Date().getTime();
    const scheduledTime = new Date(date).getTime();

    const diffInMs = now - scheduledTime;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (isNaN(diffInMinutes)) {
        return '';
    }

    if (diffInMinutes < 60) {
        if (diffInMinutes < 1) {
            return 'now';
        }

        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
};

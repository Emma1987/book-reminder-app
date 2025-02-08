import { parse } from 'date-fns';
import i18n from '@/i18n/translations';
import { ApplicationLanguageEnum } from '@/types/types';

const getLocaleStringFromApplicationLanguage = (lang: ApplicationLanguageEnum): string => {
    switch (lang) {
        case ApplicationLanguageEnum.ENGLISH:
            return 'en-GB';
        case ApplicationLanguageEnum.FRENCH:
            return 'fr-Fr';
        default:
            return 'fr-Fr';
    }
};

export const formatDateStr = (dateString: string | null, lang: ApplicationLanguageEnum): string | null => {
    if (!dateString) return null;

    const fullDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    const monthYearPattern = /^\d{4}-\d{2}$/;
    const yearPattern = /^\d{4}$/;

    try {
        const localeString = getLocaleStringFromApplicationLanguage(lang);

        if (fullDatePattern.test(dateString)) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.toLocaleString(localeString, { month: 'short' });
            const year = date.getFullYear();

            if (lang === 'en') {
                return `${month} ${day}, ${year}`;
            } else {
                return `${day} ${month} ${year}`;
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

export const getDateObject = (dateString: string | null): Date | null => {
    if (!dateString) return null;

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
            return i18n.t('time_ago.now');
        }

        return i18n.t('time_ago.minutes_ago_count', { count: diffInMinutes });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return i18n.t('time_ago.hours_ago_count', { count: diffInHours });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return i18n.t('time_ago.days_ago_count', { count: diffInDays });
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return i18n.t('time_ago.months_ago_count', { count: diffInMonths });
};

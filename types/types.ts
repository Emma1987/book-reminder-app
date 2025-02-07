export type BookType = {
    id: string;
    title: string;
    authors: string[];
    description: string;
    releaseDateRaw: string | null;
    isbn10: string | null;
    isbn13: string | null;
    coverImage: string | null;
    language: string | null;
};

export type NotificationType = {
    id: string;
    bookId: string;
    notificationIdentifier: any;
    scheduledTime: Date;
    title: string;
    content: string;
    readAt: Date | null;
};

export type LanguageItemType = {
    key: string;
    code: string;
    language: string;
    country: FlagEnum;
};

export enum ApplicationLanguageEnum {
    ENGLISH = 'en',
    FRENCH = 'fr',
}

export enum BookApiLanguageEnum {
    ARMENIAN = 'hy',
    BULGARIAN = 'bg',
    CHINESE = 'zh-CN',
    CROATIAN = 'hr',
    DANISH = 'da',
    DUTCH = 'nl',
    ENGLISH = 'en',
    FINNISH = 'fi',
    FRENCH = 'fr',
    GERMAN = 'de',
    GREEK = 'el',
    HUNGARIAN = 'hu',
    ICELANDIC = 'is',
    ITALIAN = 'it',
    JAPANESE = 'ja',
    KOREAN = 'ko',
    NORWEGIAN = 'no',
    POLISH = 'pl',
    PORTUGUESE = 'pt-PT',
    ROMANIAN = 'ro',
    SERBIAN = 'sr',
    SLOVAK = 'sk',
    SLOVENIAN = 'sl',
    SPANISH = 'es',
    SWEDISH = 'sv',
    THAI = 'th',
    UKRAINIAN = 'uk',
    VIETNAMESE = 'vi',
}

export enum FlagEnum {
    ARMENIAN = 'AM',
    BULGARIAN = 'BG',
    CHINESE = 'CN',
    CROATIAN = 'HR',
    DANISH = 'DK',
    DUTCH = 'NL',
    ENGLISH = 'GB',
    FINNISH = 'FI',
    FRENCH = 'FR',
    GERMAN = 'DE',
    GREEK = 'GR',
    HUNGARIAN = 'HU',
    ICELANDIC = 'IS',
    ITALIAN = 'IT',
    JAPANESE = 'JP',
    KOREAN = 'KR',
    NORWEGIAN = 'NO',
    POLISH = 'PL',
    PORTUGUESE = 'PT',
    ROMANIAN = 'RO',
    SERBIAN = 'RS',
    SLOVAK = 'SK',
    SLOVENIAN = 'SL',
    SPANISH = 'ES',
    SWEDISH = 'SE',
    THAI = 'TH',
    UKRAINIAN = 'UA',
    VIETNAMESE = 'VN',
}

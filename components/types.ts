export type BookType = {
    id: string
    title: string
    authors: string[]
    description: string
    publicationDateStr: string | null
    publicationDate: Date | null
    isbn10: string | null
    isbn13: string | null
    coverImage: string | null
    language: string | null
};

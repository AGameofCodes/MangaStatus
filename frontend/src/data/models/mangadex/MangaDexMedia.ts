export type MangaDexMedia = {
  id: string, //uuid
  type: 'manga' | string,
  attributes: {
    title: {
      //2 letter language code: name
      [key: string]: string,
    },
    altTitles: {
      //2 letter language code: name
      [key: string]: string
    }[],
    description: {
      //2 letter language code: description
      [key: string]: string
    },
    isLocked: boolean,
    links?: {
      al?: string, //anilist id
      ap?: string, //human-readable title,
      bw?: string, //'series/<id>',
      kt?: string, //kt id
      mu?: string, //mangaupdates id
      nu?: string, //human-readable title,
      amz?: string, //url
      ebj?: string, //url
      mal?: string, //myanimelist id
      raw?: string, //url
      engtl?: string, //url
      [key: string]: string | undefined,
    },
    originalLanguage: string,//2 letter language code
    lastVolume: string,
    lastChapter: string,
    publicationDemographic: 'shounen' | string,
    status: 'ongoing' | string,
    year: number,
    contentRating: 'suggestive' | string,
    tags: {
      id: string, //uuid
      type: 'tag',
      attributes: {
        name: {
          //2 letter language code: name
          [key: string]: string
        },
        description: {},
        group: 'theme' | string,
        version: number
      },
      relationships: []
    }[],
    state: 'published' | string,
    chapterNumbersResetOnNewVolume: boolean,
    createdAt: string, //iso date string
    updatedAt: string, //iso date string
    version: number,
    availableTranslatedLanguages: string[], //2 letter language code
    latestUploadedChapter: string, //uuid
  },
  relationships: {
    id: string, //uuid
    type: 'author' | 'artist' | 'cover_art' | 'adapted_from' | 'side_story' | string,
    related?: 'main_story' | string,
  }[]
}
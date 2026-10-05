  export const routes = {
    home: '/',
    manga: '/manga',
    movie: '/movie',
    quiz: '/quiz',
    ranking: '/ranking',
    mangaDetail: (mangaId: string) => `/manga/${mangaId}`,
    chapter: (mangaId: string, chapterId: string) => `/manga/${mangaId}/chapter/${chapterId}`,
  };

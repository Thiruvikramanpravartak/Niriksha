export const newsQueries = {
  getNewsById: 'SELECT id, title, status, language FROM news WHERE id = $1 LIMIT 1',
  getPublishedNews: 'SELECT id, title, status, language FROM news WHERE status = $1 ORDER BY id DESC',
} as const;

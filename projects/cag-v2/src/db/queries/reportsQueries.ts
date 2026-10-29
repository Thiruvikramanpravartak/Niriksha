export const reportsQueries = {
  getReportById: 'SELECT id, title, year, type FROM reports WHERE id = $1 LIMIT 1',
  getReportsByType: 'SELECT id, title, year, type FROM reports WHERE type = $1',
} as const;

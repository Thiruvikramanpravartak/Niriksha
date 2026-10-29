module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['tsx'],
    require: ['steps/**/*.ts', 'support/**/*.ts'],
    format: [
      'progress',
      'summary',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'allure-cucumberjs/reporter',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      resultsDir: 'allure-results',
    },
    parallel: 1,
  },
};

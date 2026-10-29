module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['steps/**/*.ts', 'support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar', 'html:cucumber-report.html', 'allure-cucumberjs/reporter'],
    formatOptions: {
      resultsDir: 'allure-results',
    },
    parallel: 2,
  },
};

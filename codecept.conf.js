exports.config = {
  output: './test/output',
  helpers: {
    Playwright: {
      show: true,
      windowSize: '1366x768',
      browser: 'firefox' // chromium, firefox, webkit, electron
    }
  },
  include: {
    I: './test/steps_file.js'
  },
  mocha: {},
  bootstrap: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: './test/features/*.feature',
    steps: './test/step_definitions/*.js'
  },
  plugins: {
    screenshotOnFail: {
      enabled: true
    },
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    }
  },
  tests: 'test/features/*',
  name: 'auto-testing'
}

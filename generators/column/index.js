/**
 * Route Generator
 */

const routeExists = require('../utils/routeExists');

module.exports = {
  description: 'Add a column',
  prompts: [
    {
      type: 'input',
      name: 'nameColumn',
      message: 'What column name?',
      default: (answers) => "Test Column",
      validate: (value) => {
        if ((/.+/).test(value)) {
          return routeExists(value) ? 'A file with this name already exists' : true;
        }
        return 'The name is required';
      },
    },
  ],
  actions: (answers) => {
    // Generate index.js.hbs.hbs and index.test.js
    let actions = [
      {
        type: 'add',
        path: '../src/columns/{{dashCase nameColumn}}/index.js',
        templateFile: `./column/files/index.js.hbs`,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../src/columns/{{dashCase nameColumn}}/{{dashCase nameColumn}}.js',
        templateFile: `./column/files/column.js.hbs`,
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: '../public/locales/en/translation.json',
        pattern: /(\n      "columnAdmin": {)/gi,
        template: `\n      "{{dashCase nameColumn}}": {},$1`,
      },
      {
        type: 'modify',
        path: '../public/locales/vi/translation.json',
        pattern: /(\n      "columnAdmin": {)/gi,
        template: `\n      "{{dashCase nameColumn}}": {},$1`,
      },
    ];
    return actions;
  },
};

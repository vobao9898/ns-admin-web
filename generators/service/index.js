/**
 * Route Generator
 */

const routeExists = require('../utils/routeExists');

module.exports = {
  description: 'Add a service',
  prompts: [
    {
      type: 'input',
      name: 'nameService',
      message: 'What should it be called?',
      default: (answers) => "Test Service",
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
        path: '../src/services/{{dashCase nameService}}/index.js',
        templateFile: `./service/files/service.js.hbs`,
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: '../src/utils/router-links.js',
        pattern: /(\n {2}}; \/\/ 💬 generate api to here)/gi,
        template: `\n    {{ properCase nameService }}: '/{{ dashCase nameService }}',$1`,
      }
    ];
    return actions;
  },
};

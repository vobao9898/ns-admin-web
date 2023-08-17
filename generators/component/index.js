/**
 * Route Generator
 */

const routeExists = require('../utils/routeExists');

module.exports = {
  description: 'Add a component',
  prompts: [
    {
      type: 'input',
      name: 'nameComponent',
      message: 'What should it be called?',
      default: (answers) => "Test Component",
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
        path: '../src/components/{{dashCase nameComponent}}/index.js',
        templateFile: `./component/files/component.js.hbs`,
        abortOnFail: true,
      },
    ];
    return actions;
  },
};

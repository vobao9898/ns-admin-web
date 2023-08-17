/**
 * Route Generator
 */

const routeExists = require('../utils/routeExists');

module.exports = {
  description: 'Add a route component',
  prompts: [
    {
      type: 'input',
      name: 'nameRouter',
      message: 'What should it be called?',
      default: (answers) => "Test Router",
      validate: (value) => {
        if ((/.+/).test(value)) {
          return routeExists(value) ? 'A file with this name already exists' : true;
        }
        return 'The name is required';
      },
    },
    {
      type: 'input',
      name: 'nameColumn',
      message: 'What should it be called?',
      default: (answers) => answers.nameRouter,
      validate: (value) => {
        if ((/.+/).test(value)) {
          return routeExists(value) ? 'A file with this name already exists' : true;
        }
        return 'The name is required';
      },
    },
    {
      type: 'input',
      name: 'nameService',
      message: 'What service name?',
      default: (answers) => answers.nameRouter,
      validate: (value) => {
        if ((/.+/).test(value)) {
          return routeExists(value) ? 'A file with this name already exists' : true;
        }
        return 'The name is required';
      },
    },
    {
      type: 'input',
      name: 'listModal',
      message: 'What list modal name?',
    },
    {
      when: (answers) => !!answers.listModal,
      type: 'input',
      name: 'listModalColumn',
      message: 'What column list modal name?',
      default: (answers) => answers.listModal,
    },
    {
      when: (answers) => !!answers.listModal,
      type: 'input',
      name: 'listModalService',
      message: 'What service list modal name?',
      default: (answers) => answers.listModal,
    },
  ],
  actions: (answers) => {
    // Generate index.js.hbs.hbs and index.test.js
    let actions = [
      {
        type: 'add',
        path: '../src/routes/admin/{{dashCase nameRouter}}/index.js',
        templateFile: `./route/files/route.js.hbs`,
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: '../public/locales/en/translation.json',
        pattern: /(\n      "Layout": {)/gi,
        template: `\n      "{{dashCase nameRouter}}": {},$1`,
      },
      {
        type: 'modify',
        path: '../public/locales/vi/translation.json',
        pattern: /(\n      "Layout": {)/gi,
        template: `\n      "{{dashCase nameRouter}}": {},$1`,
      },
      {
        type: 'modify',
        path: '../public/locales/en/translation.json',
        pattern: /(\n  "titles": {)/gi,
        template: `\n  "titles": {\n    "{{properCase nameRouter}}": "{{dashCase nameRouter}}",`,
      },
      {
        type: 'modify',
        path: '../public/locales/vi/translation.json',
        pattern: /(\n  "titles": {)/gi,
        template: `\n  "titles": {\n    "{{properCase nameRouter}}": "{{dashCase nameRouter}}",`,
      },
      {
        type: 'modify',
        path: '../src/utils/router-links.js',
        pattern: /(\n {2}}; \/\/ 💬 generate link to here)/gi,
        template: `\n    {{ properCase nameRouter }}: '/{{ dashCase nameRouter }}',$1`,
      },
      {
        type: 'modify',
        path: '../src/routes/routes.js',
        pattern: /(], \/\/ 💬 generate link to here)/gi,
        template: `  {\n        path: routerLinks('{{properCase nameRouter}}'),\n        component: React.lazy(() => import('./admin/{{dashCase nameRouter}}')),\n        title: '{{properCase nameRouter}}'\n      },\n    $1`,
      },
      {
        type: 'modify',
        path: '../src/layouts/admin/menus.js',
        pattern: /(];)/gi,
        template: `  {\n    icon: 'las la-lg la-user-graduate',\n    name: '{{ properCase nameRouter}}'\n  },\n];`,
      },
    ];

    if (answers.nameColumn) {
      actions.push({
        type: 'add',
        path: '../src/columns/{{dashCase nameColumn}}/index.js',
        templateFile: `./column/files/index.js.hbs`,
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../src/columns/{{dashCase nameColumn}}/{{dashCase nameColumn}}.js',
        templateFile: `./column/files/column.js.hbs`,
        abortOnFail: true,
      });
      actions.push({
        type: 'modify',
        path: '../public/locales/en/translation.json',
        pattern: /(\n      "columnAdmin": {)/gi,
        template: `\n      "{{dashCase nameColumn}}": {},$1`,
      });
      actions.push({
        type: 'modify',
        path: '../public/locales/vi/translation.json',
        pattern: /(\n      "columnAdmin": {)/gi,
        template: `\n      "{{dashCase nameColumn}}": {},$1`,
      });
    }

    if (answers.nameService) {
      actions.push({
        type: 'add',
        path: '../src/services/{{dashCase nameService}}/index.js',
        templateFile: `./service/files/service.js.hbs`,
        abortOnFail: true,
      });
      actions.push({
        type: 'modify',
        path: '../src/utils/router-links.js',
        pattern: /(\n {2}}; \/\/ 💬 generate api to here)/gi,
        template: `\n    {{ properCase nameService }}: '/{{ dashCase nameService }}',$1`,
      });
    }

    if (!!answers.listModal) {
      if(!!answers.listModalColumn) {
        actions.push({
          type: 'add',
          path: '../src/columns/{{dashCase nameColumn}}/{{dashCase listModalColumn}}.js',
          templateFile: `./column/files/column.js.hbs`,
          abortOnFail: true,
        });
        actions.push({
          type: 'modify',
          path: '../public/locales/en/translation.json',
          pattern: /(\n      "columnAdmin": {)/gi,
          template: `\n      "{{dashCase listModalColumn}}": {},$1`,
        });
        actions.push({
          type: 'modify',
          path: '../public/locales/vi/translation.json',
          pattern: /(\n      "columnAdmin": {)/gi,
          template: `\n      "{{dashCase listModalColumn}}": {},$1`,
        });
      }
      if(!!answers.listModalService) {
        actions.push({
          type: 'add',
          path: '../src/services/{{dashCase listModalService}}/index.js',
          templateFile: `./service/files/serviceModal.js.hbs`,
          abortOnFail: true,
        });
        actions.push({
          type: 'modify',
          path: '../src/utils/router-links.js',
          pattern: /(\n {2}}; \/\/ 💬 generate api to here)/gi,
          template: `\n    {{ properCase listModalService }}: '/{{ dashCase listModalService }}',$1`,
        });
      }
    }
    return actions;
  },
};

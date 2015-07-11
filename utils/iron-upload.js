'use strict';

/* global env, exec */

var path = require('path');
require('shelljs/global');

const PROJECT_DIR = path.join(__dirname, '..');

var iron = {
  'token': env.IRON_TOKEN,
  'project_id': env.IRON_PROJECT_ID
};

JSON.stringify(iron).to(PROJECT_DIR + '/iron.json');

var worker = [
  'runtime "node"',
  'stack "node-0.10"',
  'exec "main.js"',
  'file "package.json"',
  'build "npm config set strict-ssl false; npm install --production"',
  'set_env "GH_TOKEN", "' + env.GH_TOKEN + '"',
  'set_env "GH_REF", "' + env.GH_REF + '"',
  'remote'
];

worker.join('\n').to(PROJECT_DIR + '/blood.worker');


exec('iron_worker upload blood', { silent: true });

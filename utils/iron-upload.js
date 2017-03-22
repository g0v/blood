/* global env, exec */

const path = require('path');
require('shelljs/global');
require('dotenv').config();

const PROJECT_DIR = path.join(__dirname, '..');

const iron = {
  token: process.env.IRON_TOKEN,
  project_id: process.env.IRON_PROJECT_ID,
};

JSON.stringify(iron).to(`${PROJECT_DIR}/iron.json`);

const worker = [
  'runtime "node"',
  'stack "node-4.1"',
  'exec "main.js"',
  'file "package.json"',
  'build "npm config set strict-ssl false; npm install --production"',
  `set_env "GH_TOKEN", "${process.env.GH_TOKEN}"`,
  `set_env "GH_REF", "${process.env.GH_REF}"`,
  'remote',
];

worker.join('\n').to(`${PROJECT_DIR}/blood.worker`);


exec('iron_worker upload blood', { silent: true });

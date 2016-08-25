'use strict';

/* global exec, rm, env, cd, exit */

const jsdom = require('jsdom');
const moment = require('moment-timezone');
require('shelljs/global');
require('dotenv').config();

const repo = `https://${process.env.GH_TOKEN}@${process.env.GH_REF}`;

const status = {
  'images/StorageIcon001.jpg': 'empty',
  'images/StorageIcon002.jpg': 'medium',
  'images/StorageIcon003.jpg': 'full'
};

jsdom.env(
  'http://www.blood.org.tw/Internet/main/index.aspx',
  ['http://code.jquery.com/jquery.js'],
  (errors, window) => {
    const $ = window.$;
    const storages = $('.Storage').toArray();
    const json = {time: moment().tz('Asia/Taipei').format()};
    storages.forEach(s => {
      const name = $(s).find('#StorageHeader a').text();
      json[name] = {name: name};
      const types = ['StorageA', 'StorageB', 'StorageO', 'StorageAB'];
      types.forEach(type => {
        const data = status[$(s).find(`#${type} img`).attr('src')];
        json[name][type] = data;
      });
    });
    rm('-rf', 'out');
    exec(`git clone ${repo} --depth 1 -b gh-pages out`);
    cd('out');
    exec('git config user.name "Automatic Commit"');
    exec('git config user.email "blood@g0v.tw"');
    JSON.stringify(json, null, 2).to('blood.json');
    exec('git add .');
    exec(`git commit -m "Automatic commit: ${Date()}"`);
    exec(`git push ${repo} gh-pages`, {silent: true});
    exit(0);
  }
);

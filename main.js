'use strict';

/* global exec, rm, env, cd, exit */

const request = require('request');
const cheerio = require('cheerio')
const moment = require('moment-timezone');
require('shelljs/global');
require('dotenv').config();

const repository = `https://${process.env.GH_TOKEN}@${process.env.GH_REF}`;
const dataSource = 'http://www.blood.org.tw/Internet/main/index.aspx';
const bloodTypes = ['StorageA', 'StorageB', 'StorageO', 'StorageAB'];
const statusMap = {
  'images/StorageIcon001.jpg': 'empty',
  'images/StorageIcon002.jpg': 'medium',
  'images/StorageIcon003.jpg': 'full'
};

const commitToRepo = (repo, blood) => {
  rm('-rf', 'out');
  exec(`git clone ${repo} --depth 1 -b gh-pages out`);
  cd('out');
  exec('git config user.name "Automatic Commit"');
  exec('git config user.email "blood@g0v.tw"');
  JSON.stringify(blood, null, 2).to('blood.json');
  exec('git add .');
  exec(`git commit -m "Automatic commit: ${Date()}"`);
  exec(`git push ${repo} gh-pages`, {silent: true});
  exit(0);
}

request(dataSource, (err, res, body) => {
  if (err) {
    console.error(err);
    return;
  }

  const $ = cheerio.load(body);
  let blood = {
    time: moment().tz('Asia/Taipei').format()
  };

  $('.Storage').each((i, elem) => {
    const name = $('#StorageHeader a', elem).text();

    blood[name] = bloodTypes.reduce((acc, bloodType) => {
      acc[bloodType] = statusMap[$(`#${bloodType} img`, elem).attr('src')];
      return acc;
    }, { name });
  });

  commitToRepo(repository, blood);
});

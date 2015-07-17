'use strict';

/* global exec, rm, env, cd, exit */

var jsdom = require('jsdom');
var moment = require('moment-timezone');
require('shelljs/global');

var status = {
  'images/StorageIcon001.jpg': 'empty',
  'images/StorageIcon002.jpg': 'medium',
  'images/StorageIcon003.jpg': 'full'
};

jsdom.env(
  'http://www.blood.org.tw/Internet/main/index.aspx',
  ['http://code.jquery.com/jquery.js'],
  function (errors, window) {
    var $ = window.$;
    var storages = $('.Storage').toArray();
    var json = {time: moment().tz('Asia/Taipei').format()};
    storages.forEach(function(s) {
      var name = $(s).find('#StorageHeader a').text();
      json[name] = {name: name};
      var types = ['StorageA', 'StorageB', 'StorageO', 'StorageAB'];
      types.forEach(function(type) {
        var data = status[$(s).find('#' + type + ' img').attr('src')];
        json[name][type] = data;
      });
    });
    rm('-rf', 'out');
    exec('git clone "https://' + env.GH_TOKEN +
         '@' + env.GH_REF + '" --depth 1 -b gh-pages out');
    cd('out');
    exec('git config user.name "Automatic Commit"');
    exec('git config user.email "blood@g0v.tw"');
    JSON.stringify(json, null, 2).to('blood.json');
    exec('git add .');
    exec('git commit -m "Automatic commit: ' + Date() + '"');
    exec('git push "https://' + env.GH_TOKEN +
         '@' + env.GH_REF + '" gh-pages', {silent: true});
    exit(0);
  }
);

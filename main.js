'use strict';

/* global exec, rm, env, cd, exit */
var moment = require('moment-timezone');
var cheerio = require('cheerio');
require('isomorphic-fetch');
require('shelljs/global');

module.exports.fetch = (event, context, callback) => {
  var status = {
    'images/StorageIcon001.jpg': 'empty',
    'images/StorageIcon002.jpg': 'medium',
    'images/StorageIcon003.jpg': 'full'
  };

  fetch('http://www.blood.org.tw/Internet/main/index.aspx')
  .then(res => res.text())
  .then(html => {
    var $ = cheerio.load(html);
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

    mkdir('-p', 'out');
    JSON.stringify(json, null, 2).to('out/blood.json');
    callback(null, json);
  })
  .catch(err => callback(err));
}

if (require.main === module) {
  module.exports.fetch(null, null, (err, result) => {
    console.log(result);
  });
}

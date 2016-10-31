const tap = require('tap');
const Zone = require('../zone');

const DNS = '8.8.8.8';
let zone = new Zone(DNS, ['qq.com']);;
zone.buildIndex();
tap.type(zone.root.com, 'object');
tap.equal(zone.root.com.__, 1);
tap.type(zone.root.com.qq, 'object');
tap.equal(zone.root.com.qq.__, 0);

zone = new Zone(DNS, ['qq.com', 'baidu.com', 'cn']);
zone.buildIndex();
tap.ok(zone.match('qq.com'));
tap.ok(zone.match('baidu.com'));
tap.ok(zone.match('cn'));
tap.notOk(zone.match('notfound.com'));
tap.ok(zone.match('qq.cn'));
tap.ok(zone.match('what.ever.qq.cn'));
tap.ok(zone.match('www.baidu.com'));
tap.ok(zone.match('www.qq.com'));
tap.notOk(zone.match('com'));
tap.notOk(zone.match('qqcn'));
tap.notOk(zone.match('www.qq.com', true));

const assert = require('chai').assert;
const Zone = require('../zone');

const DNS = '8.8.8.8';

describe('zone', () => {
  describe('build index', () => {
    it('can build a domain index', () => {
      const zone = new Zone(DNS, ['qq.com']);;
      zone.buildIndex();
      assert.typeOf(zone.root.com, 'object');
      assert.equal(zone.root.com.__, 1);
      assert.typeOf(zone.root.com.qq, 'object');
      assert.equal(zone.root.com.qq.__, 0);
    });
  });
  describe('match', () => {
    let zone;
    before(() => {
      zone = new Zone(DNS, ['qq.com', 'baidu.com', 'cn']);
      zone.buildIndex();
    });
    it('exact match', () => {
      assert(zone.match('qq.com'));
      assert(zone.match('baidu.com'));
      assert(zone.match('cn'));
      assert.isNotOk(zone.match('notfound.com'));
    });
    it('suffix match', () => {
      assert(zone.match('qq.cn'));
      assert(zone.match('what.ever.qq.cn'));
      assert(zone.match('www.baidu.com'));
      assert(zone.match('www.qq.com'));
      assert.isNotOk(zone.match('com'));
      assert.isNotOk(zone.match('qqcn'));
    });
  })
});

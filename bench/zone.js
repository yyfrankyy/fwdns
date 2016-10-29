const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;
const whitelist = require('./whitelist').names;

const Zone = require('../zone');
const zone = new Zone('114.114.114.114', whitelist);
zone.buildIndex();

const hitDomain = 'www.qq.com';
const missDomain = 'www.google.com';

const dotWhiteList = whitelist.map(val => '.' + val);
const dotRegWhiteList = whitelist.map(val => new RegExp('.' + val + '$'));

function EndsWithLoop(domain) {
  for (let s of dotWhiteList) {
    if (domain.endsWith(s)) {
      return true;
    }
  }
}

function RegExpLoop(domain) {
  for (let s of dotRegWhiteList) {
    if (s.test(domain)) {
      return true;
    }
  }
}

suite
  .add('EndsWithLoop#hit', function() {
    EndsWithLoop(hitDomain);
  })
  .add('RegExpLoop#hit', function() {
    RegExpLoop(hitDomain);
  })
  .add('ReverseIndex#hit', function() {
    zone.match(hitDomain)
  })
  .add('EndsWithLoop#miss', function() {
    EndsWithLoop(missDomain);
  })
  .add('RegExpLoop#miss', function() {
    RegExpLoop(missDomain);
  })
  .add('ReverseIndex#miss', function() {
    zone.match(missDomain)
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({async: true});

'use strict';

class Zone {
  constructor(hosts, whitelist) {
    this.root = {};
    this.whitelist = whitelist;
    this.hosts = hosts;
    this.buildIndex();
  }
  buildIndex() {
    const root = this.root;
    this.whitelist
      .map(domain => reverse(domain))
      .sort()
      .forEach(reversed => {
        let words = reversed.split('.');
        let subtree = root;
        for (let w of words) {
          if (!subtree[w]) {
            subtree[w] = {__: 0};
            subtree.__++;
          }
          subtree = subtree[w];
        }
      });
    return root;
  }
  match(domain) {
    let subtree = this.root;
    const reversedDomain = reverse(domain).split('.');
    let matched = false;
    for (let m of reversedDomain) {
      if (m in subtree) {
        if (subtree[m].__ === 0) {
          matched = true;
          break;
        } else {
          subtree = subtree[m];
        }
      } else {
        break;
      }
    }
    return matched;
  }
}

function reverse(domain) {
  return domain.split('.').reverse().join('.')
}

module.exports = Zone;

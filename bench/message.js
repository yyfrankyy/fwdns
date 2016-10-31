const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

const domain = '1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa';

const encode1 = function(full_domain, position_offset, option) {
  var domains = {}

  var domain = full_domain
  domain = domain.replace(/\.$/, '') // Strip the trailing dot.
  position = 0

  var body = []
    , bytes

  var i = 0
  var max_iterations = 40 // Enough for 1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa

  while(++i < max_iterations) {
    if(domain == '') {
      // Encode the root domain and be done.
      body.push(new Buffer([0]))
      return Buffer.concat(body)
    }

    else if(domains[domain] && option !== 'nocompress') {
      // Encode a pointer and be done.
      body.push(new Buffer([0xc0, domains[domain]]))
      return Buffer.concat(body)
    }

    else {
      // Encode the next part of the domain, saving its position in the lookup table for later.
      domains[domain] = position

      var parts = domain.split(/\./)
        , car = parts[0]
      domain = parts.slice(1).join('.')

      // Write the first part of the domain, with a length prefix.
      var buf = new Buffer(car.length + 1)
      buf.write(car, 1, car.length, 'ascii')
      buf.writeUInt8(car.length, 0)
      body.push(buf)
      position += buf.length
    }
  }

  throw new Error('Too many iterations encoding domain: ' + full_domain)
}

const encode2 = function(full_domain, position_offset, option) {
  var domains = {}

  var domain = full_domain
  domain = domain.replace(/\.$/, '') // Strip the trailing dot.
  position = 0

  var body = []
    , bytes

  var i = 0
  var max_iterations = 40 // Enough for 1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa

  while(++i < max_iterations) {
    if(domain == '') {
      // Encode the root domain and be done.
      body.push(new Buffer([0]))
      return Buffer.concat(body)
    }

    else if(domains[domain] && option !== 'nocompress') {
      // Encode a pointer and be done.
      body.push(new Buffer([0xc0, domains[domain]]))
      return Buffer.concat(body)
    }

    else {
      // Encode the next part of the domain, saving its position in the lookup table for later.
      domains[domain] = position

      let idx = domain.indexOf('.'), car;
      if (idx === -1) {
        car = domain;
        domain = '';
      } else {
        car = domain.substring(0, idx);
        domain = domain.substring(idx + 1);
      }

      // Write the first part of the domain, with a length prefix.
      var buf = new Buffer(car.length + 1)
      buf.write(car, 1, car.length, 'ascii')
      buf.writeUInt8(car.length, 0)
      body.push(buf)
      position += buf.length
    }
  }

  throw new Error('Too many iterations encoding domain: ' + full_domain)
}

const encode3 = function(full_domain, position_offset, option) {
  var domains = {}

  var domain = full_domain
  domain = domain.replace(/\.$/, '') // Strip the trailing dot.
  position = 0

  var body = []
    , bytes

  var i = 0
  var max_iterations = 40 // Enough for 1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa

  while(++i < max_iterations) {
    if(domain == '') {
      // Encode the root domain and be done.
      body.push(Buffer.from([0]))
      return Buffer.concat(body)
    }

    else if(domains[domain] && option !== 'nocompress') {
      // Encode a pointer and be done.
      body.push(Buffer.from([0xc0, domains[domain]]))
      return Buffer.concat(body)
    }

    else {
      // Encode the next part of the domain, saving its position in the lookup table for later.
      domains[domain] = position

      let idx = domain.indexOf('.'), car;
      if (idx === -1) {
        car = domain;
        domain = '';
      } else {
        car = domain.substring(0, idx);
        domain = domain.substring(idx + 1);
      }

      // Write the first part of the domain, with a length prefix.
      var buf = Buffer.allocUnsafe(car.length + 1)
      buf.write(car, 1, car.length, 'ascii')
      buf.writeUInt8(car.length, 0)
      body.push(buf)
      position += buf.length
    }
  }

  throw new Error('Too many iterations encoding domain: ' + full_domain)
}

const encode4 = function(full_domain, position_offset, option) {
  var domains = {};

  let domain = full_domain;
  domain = domain.replace(/\.$/, ''); // Strip the trailing dot.

  let bodyBuf = Buffer.allocUnsafe(domain.length + 1);
  let offset = 0;

  var max_iterations = 40 // Enough for 1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa

  while (max_iterations-- > 0) {
    if (domain === '') {
      // Encode the root domain and be done.
      return Buffer.concat([bodyBuf, Buffer.from([0])]);
    }

    else if (domains[domain] && option !== 'nocompress') {
      // Encode a pointer and be done.
      return Buffer.concat([
        offset === bodyBuf.length ? bodyBuf : bodyBuf.slice(0, offset),
        Buffer.from([0xc0, domains[domain]])
      ]);
    }

    else {
      // Encode the next part of the domain, saving its position in the lookup table for later.
      domains[domain] = offset;

      let idx = domain.indexOf('.'), car;
      if (idx === -1) {
        car = domain;
        domain = '';
      } else {
        car = domain.substring(0, idx);
        domain = domain.substring(idx + 1);
      }

      // Write the first part of the domain, with a length prefix.
      bodyBuf.writeUInt8(car.length, offset);
      offset++;
      bodyBuf.write(car, offset, car.length, 'ascii');
      offset += car.length;
    }
  }

  throw new Error('Too many iterations encoding domain: ' + full_domain)
}


suite
  .add('- Original', function() {
    encode1(domain)
  })
  .add('+ indexOf & substring', function() {
    encode2(domain);
  })
  .add('+ Buffer.from', function() {
    encode3(domain);
  })
  .add('+ Body Buffer', function() {
    encode4(domain);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({async: true});

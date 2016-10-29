# fwdns

A DNS Forwarder, with some interesting features.

## QuickStart

```
$ npm i fwdns -g
$ fwdns -h

  Usage: fwdns [options]

  Options:

    -h, --help                                       output usage information
    -V, --version                                    output the version number
    -p, --port [6666]                                Port to bind
    -l, --listen [127.0.0.1]                         Address to listen
    -z, --zone <8.8.8.8>                             Default zone
    -t, --timeout [5000]                             Timeout forwarding requests
    --renew-timeout [3600]                           Timeout of auto renewal
    -f, --forward-zone [/path/to/forward/zone.json]  Forward zone setting, {"hosts": ["8.8.8.8"], "names": ["google.com"]}
    -s, --local-zone [/path/to/local/zone.json]      Local zone setting, {"abc.com": "127.0.0.1"}
```

## Features

### Fast Zone Switching

It's a very rare edge case for using a DNS forwarder like dnsmasq and unbound
when there is over thousands of forward-zone settings. There is [a fork of dnsmasq](https://github.com/infinet/dnsmasq) solving the similar problems, both dnsmasq and unbound's CPU reach 100%
over 10K of zones.

With a pre-indexed map, we can archive less then 1ms for the query over 10K zones
search, the algorithm is the same as [this fork](https://github.com/infinet/dnsmasq)
although in JavaScript, the [implementation](https://github.com/yyfrankyy/fwdns/blob/master/zone.js)
is much more easier. (but slower)

### Cache and Auto Renewal

All records that get from backends, will be cache in the memory and expire
regards to the TTL, via [node-cache](https://github.com/ptarjan/node-cache).

Additionally, a auto renewal policy is added for better performance. When the
item is added to the cache, the timer start to renew the result in the right
time if possible, right time means 0.8 of TTL, and when the query is not being
seen for an hour, give up the next renewal.

### Race Query

Sometimes the backend zones can be busy or the network maybe unstable for a
while, we can waste some network and CPU resources to duplicate the request to
different servers, and take the first response, this can be easily archive by
async's [race](caolan.github.io/async/docs.html#race) function.

## Performance

Might be slightly slower then others at the first time or both hit cache due to
JavaScript's performance.

But I think with the auto renewal and race query, this maybe faster then others
in the most daily usages.

As for my own bench via namebench, the avg. response is 106.49ms, lower then my
dnsmasq(135ms) in the same machine (Raspberry Pi).

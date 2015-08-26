'use strict';

var shoovWebdrivercss = require('shoov-webdrivercss');

var projectName = 'haaretz-shoov';

// This can be executed by passing the environment argument like this:
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=chrome mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=ie11 mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=iphone5 mocha

var capsConfig = {
  'chrome': {
    project: projectName,
    'browser' : 'Chrome',
    'browser_version' : '42.0',
    'os' : 'OS X',
    'os_version' : 'Yosemite',
    'resolution' : '1024x768'
  },
  'ie11': {
    project: projectName,
    'browser' : 'IE',
    'browser_version' : '11.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1024x768'
  },
  'iphone5': {
    project: projectName,
    'browser' : 'Chrome',
    'browser_version' : '42.0',
    'os' : 'OS X',
    'os_version' : 'Yosemite',
    'chromeOptions': {
      'mobileEmulation': {
        'deviceName': 'Apple iPhone 5'
      }
    }
  }
};

var selectedCaps = process.env.SELECTED_CAPS || undefined;
var caps = selectedCaps ? capsConfig[selectedCaps] : undefined;

var providerPrefix = process.env.PROVIDER_PREFIX ? process.env.PROVIDER_PREFIX + '-' : '';
var testName = selectedCaps ? providerPrefix + selectedCaps : providerPrefix + 'default';

var baseUrl = process.env.BASE_URL ? process.env.BASE_URL : 'http://www.haaretz.co.il';

var resultsCallback = process.env.DEBUG ? console.log : shoovWebdrivercss.processResults;

describe('Visual monitor testing', function() {

  this.timeout(99999999);
  var client = {};

  before(function(done){
    client = shoovWebdrivercss.before(done, caps);
  });

  after(function(done) {
    shoovWebdrivercss.after(done);
  });

  it('should show the news page',function(done) {
    client
      .url(baseUrl + '/news')
      .refresh()
      .pause(3000)
      .webdrivercss(testName + '.news', {
        name: '1',
        exclude:
          [
            // Top banner.
            '#top_banners',
            // Articles image.
            'picture',
            // Ad
            '.ad',
            // Web spacing image.
            '.OUTBRAIN img',
            // Aside article image.
            'aside article img',
            // Topline image.
            '.h-wrapper--topline article img',
          ],
        hide:
          [
            // Ad
            '.ad--b img',
            '.js-dfp-ad',
            // Fluid header
            '.l-fluid masthead',
            // Top promo text.
            '.promo__text',
            // Top promo time
            '.bn__time',
            // Top news.
            '.media__content',
            // Articles header and content summery.
            'article header',
            'article h3',
            'article p',
            // Articles address.
            'article address',
            // Articles time.
            'article time',
            // Articles icon.
            'article span.c-brand',
            // List of related article.
            'article ul.c-brand li a',
            // Web spacing text.
            '.OUTBRAIN span',
            // Topline title.
            '.h-wrapper--topline article h3',
            // Aside promo title
            '.l-sidebar-wrapper h2',
          ],
        screenWidth: selectedCaps == 'chrome' ? [640, 960, 1200] : undefined
      }, resultsCallback)
      .call(done);
  });
});

/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "screenshot-wide.png",
    "revision": "73cb7b3bef8d8bd59118eb494e32f2f7"
  }, {
    "url": "screenshot-narrow.png",
    "revision": "655dcaa5f8d9980af57ce49841d0b24b"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "5ec84a6e38927c1bc43db99105ffb893"
  }, {
    "url": "pwa-512x512.png",
    "revision": "ca0dc47eddc2f6aadc917e18bcf14817"
  }, {
    "url": "pwa-192x192.png",
    "revision": "0e0b4d3c882d136a6eba9dddaf196684"
  }, {
    "url": "index.html",
    "revision": "276f43977b87f7895e3c352d620e82ea"
  }, {
    "url": "icon.svg",
    "revision": "a9382f5beabc7ba94c7e4fd544f585f9"
  }, {
    "url": "favicon.png",
    "revision": "2c92d8fda110d098a9b6ecea93676e63"
  }, {
    "url": "favicon.ico",
    "revision": "2c92d8fda110d098a9b6ecea93676e63"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "885e378e92e4a48619d42d47809287c5"
  }, {
    "url": "assets/web-Buzx63gs.js",
    "revision": null
  }, {
    "url": "assets/web-BRRP_BJP.js",
    "revision": null
  }, {
    "url": "assets/purify.es-Dn3VvdGh.js",
    "revision": null
  }, {
    "url": "assets/lamejs-DM3l10G3.js",
    "revision": null
  }, {
    "url": "assets/index.es-CI6kU96Y.js",
    "revision": null
  }, {
    "url": "assets/index-CyIXWzoG.css",
    "revision": null
  }, {
    "url": "assets/index-BIVSm9h9.js",
    "revision": null
  }, {
    "url": "assets/html2canvas-Dxs7mGWg.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "885e378e92e4a48619d42d47809287c5"
  }, {
    "url": "favicon.ico",
    "revision": "2c92d8fda110d098a9b6ecea93676e63"
  }, {
    "url": "favicon.png",
    "revision": "2c92d8fda110d098a9b6ecea93676e63"
  }, {
    "url": "icon.svg",
    "revision": "a9382f5beabc7ba94c7e4fd544f585f9"
  }, {
    "url": "pwa-192x192.png",
    "revision": "0e0b4d3c882d136a6eba9dddaf196684"
  }, {
    "url": "pwa-512x512.png",
    "revision": "ca0dc47eddc2f6aadc917e18bcf14817"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "5ec84a6e38927c1bc43db99105ffb893"
  }, {
    "url": "screenshot-narrow.png",
    "revision": "655dcaa5f8d9980af57ce49841d0b24b"
  }, {
    "url": "screenshot-wide.png",
    "revision": "73cb7b3bef8d8bd59118eb494e32f2f7"
  }, {
    "url": "manifest.webmanifest",
    "revision": "ba025667de8693a105ccf44b081883eb"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));

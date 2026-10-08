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
    "revision": "45b6fcf3bc4fbf04e37a293388d3ac74"
  }, {
    "url": "pwa-512x512.png",
    "revision": "f41032ee3599a75f690171c9d25290e1"
  }, {
    "url": "pwa-192x192.png",
    "revision": "2b5a83994e6984214ae12e64aae03bf6"
  }, {
    "url": "index.html",
    "revision": "20c84f05bfdf4c6a84c56651a35f6351"
  }, {
    "url": "icon.svg",
    "revision": "7b5e7197eb69ba0f6522f87cf85f3eba"
  }, {
    "url": "favicon.png",
    "revision": "392fe839e1241c848567d888081359f4"
  }, {
    "url": "favicon.ico",
    "revision": "392fe839e1241c848567d888081359f4"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "8e81f4a0ecead937d938b286c5142f93"
  }, {
    "url": "assets/web-D3CBxw64.js",
    "revision": null
  }, {
    "url": "assets/web-CeiBDquZ.js",
    "revision": null
  }, {
    "url": "assets/purify.es-Dn3VvdGh.js",
    "revision": null
  }, {
    "url": "assets/lamejs-DM3l10G3.js",
    "revision": null
  }, {
    "url": "assets/index.es-WAzeZ5pU.js",
    "revision": null
  }, {
    "url": "assets/index-cfZ1jnjB.js",
    "revision": null
  }, {
    "url": "assets/index-CRYcM3Ns.css",
    "revision": null
  }, {
    "url": "assets/html2canvas-Bo9vpc89.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "8e81f4a0ecead937d938b286c5142f93"
  }, {
    "url": "favicon.ico",
    "revision": "392fe839e1241c848567d888081359f4"
  }, {
    "url": "favicon.png",
    "revision": "392fe839e1241c848567d888081359f4"
  }, {
    "url": "icon.svg",
    "revision": "7b5e7197eb69ba0f6522f87cf85f3eba"
  }, {
    "url": "pwa-192x192.png",
    "revision": "2b5a83994e6984214ae12e64aae03bf6"
  }, {
    "url": "pwa-512x512.png",
    "revision": "f41032ee3599a75f690171c9d25290e1"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "45b6fcf3bc4fbf04e37a293388d3ac74"
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

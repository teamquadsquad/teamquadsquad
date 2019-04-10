// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/smoothscroll.js":[function(require,module,exports) {
// SmoothScroll v0.9.9
// Licensed under the terms of the MIT license.
// People involved
// - Balazs Galambosi: maintainer (CHANGELOG.txt)
// - Patrick Brunner (patrickb1991@gmail.com)
// - Michael Herf: ssc_pulse Algorithm
function ssc_init() {
  if (!document.body) return;
  var e = document.body;
  var t = document.documentElement;
  var n = window.innerHeight;
  var r = e.scrollHeight;
  ssc_root = document.compatMode.indexOf("CSS") >= 0 ? t : e;
  ssc_activeElement = e;
  ssc_initdone = true;

  if (top != self) {
    ssc_frame = true;
  } else if (r > n && (e.offsetHeight <= n || t.offsetHeight <= n)) {
    ssc_root.style.height = "auto";

    if (ssc_root.offsetHeight <= n) {
      var i = document.createElement("div");
      i.style.clear = "both";
      e.appendChild(i);
    }
  }

  if (!ssc_fixedback) {
    e.style.backgroundAttachment = "scroll";
    t.style.backgroundAttachment = "scroll";
  }

  if (ssc_keyboardsupport) {
    ssc_addEvent("keydown", ssc_keydown);
  }
}

function ssc_scrollArray(e, t, n, r) {
  r || (r = 1e3);
  ssc_directionCheck(t, n);
  ssc_que.push({
    x: t,
    y: n,
    lastX: t < 0 ? .99 : -.99,
    lastY: n < 0 ? .99 : -.99,
    start: +new Date()
  });

  if (ssc_pending) {
    return;
  }

  var i = function i() {
    var s = +new Date();
    var o = 0;
    var u = 0;

    for (var a = 0; a < ssc_que.length; a++) {
      var f = ssc_que[a];
      var l = s - f.start;
      var c = l >= ssc_animtime;
      var h = c ? 1 : l / ssc_animtime;

      if (ssc_pulseAlgorithm) {
        h = ssc_pulse(h);
      }

      var p = f.x * h - f.lastX >> 0;
      var d = f.y * h - f.lastY >> 0;
      o += p;
      u += d;
      f.lastX += p;
      f.lastY += d;

      if (c) {
        ssc_que.splice(a, 1);
        a--;
      }
    }

    if (t) {
      var v = e.scrollLeft;
      e.scrollLeft += o;

      if (o && e.scrollLeft === v) {
        t = 0;
      }
    }

    if (n) {
      var m = e.scrollTop;
      e.scrollTop += u;

      if (u && e.scrollTop === m) {
        n = 0;
      }
    }

    if (!t && !n) {
      ssc_que = [];
    }

    if (ssc_que.length) {
      setTimeout(i, r / ssc_framerate + 1);
    } else {
      ssc_pending = false;
    }
  };

  setTimeout(i, 0);
  ssc_pending = true;
}

function ssc_wheel(e) {
  if (!ssc_initdone) {
    ssc_init();
  }

  var t = e.target;
  var n = ssc_overflowingAncestor(t);

  if (!n || e.defaultPrevented || ssc_isNodeName(ssc_activeElement, "embed") || ssc_isNodeName(t, "embed") && /\.pdf/i.test(t.src)) {
    return true;
  }

  var r = e.wheelDeltaX || 0;
  var i = e.wheelDeltaY || 0;

  if (!r && !i) {
    i = e.wheelDelta || 0;
  }

  if (Math.abs(r) > 1.2) {
    r *= ssc_stepsize / 120;
  }

  if (Math.abs(i) > 1.2) {
    i *= ssc_stepsize / 120;
  }

  ssc_scrollArray(n, -r, -i);
  e.preventDefault();
}

function ssc_keydown(e) {
  var t = e.target;
  var n = e.ctrlKey || e.altKey || e.metaKey;

  if (/input|textarea|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n) {
    return true;
  }

  if (ssc_isNodeName(t, "button") && e.keyCode === ssc_key.spacebar) {
    return true;
  }

  var r,
      i = 0,
      s = 0;
  var o = ssc_overflowingAncestor(ssc_activeElement);
  var u = o.clientHeight;

  if (o == document.body) {
    u = window.innerHeight;
  }

  switch (e.keyCode) {
    case ssc_key.up:
      s = -ssc_arrowscroll;
      break;

    case ssc_key.down:
      s = ssc_arrowscroll;
      break;

    case ssc_key.spacebar:
      r = e.shiftKey ? 1 : -1;
      s = -r * u * .9;
      break;

    case ssc_key.pageup:
      s = -u * .9;
      break;

    case ssc_key.pagedown:
      s = u * .9;
      break;

    case ssc_key.home:
      s = -o.scrollTop;
      break;

    case ssc_key.end:
      var a = o.scrollHeight - o.scrollTop - u;
      s = a > 0 ? a + 10 : 0;
      break;

    case ssc_key.left:
      i = -ssc_arrowscroll;
      break;

    case ssc_key.right:
      i = ssc_arrowscroll;
      break;

    default:
      return true;
  }

  ssc_scrollArray(o, i, s);
  e.preventDefault();
}

function ssc_mousedown(e) {
  ssc_activeElement = e.target;
}

function ssc_setCache(e, t) {
  for (var n = e.length; n--;) {
    ssc_cache[ssc_uniqueID(e[n])] = t;
  }

  return t;
}

function ssc_overflowingAncestor(e) {
  var t = [];
  var n = ssc_root.scrollHeight;

  do {
    var r = ssc_cache[ssc_uniqueID(e)];

    if (r) {
      return ssc_setCache(t, r);
    }

    t.push(e);

    if (n === e.scrollHeight) {
      if (!ssc_frame || ssc_root.clientHeight + 10 < n) {
        return ssc_setCache(t, document.body);
      }
    } else if (e.clientHeight + 10 < e.scrollHeight) {
      overflow = getComputedStyle(e, "").getPropertyValue("overflow");

      if (overflow === "scroll" || overflow === "auto") {
        return ssc_setCache(t, e);
      }
    }
  } while (e = e.parentNode);
}

function ssc_addEvent(e, t, n) {
  window.addEventListener(e, t, n || false);
}

function ssc_removeEvent(e, t, n) {
  window.removeEventListener(e, t, n || false);
}

function ssc_isNodeName(e, t) {
  return e.nodeName.toLowerCase() === t.toLowerCase();
}

function ssc_directionCheck(e, t) {
  e = e > 0 ? 1 : -1;
  t = t > 0 ? 1 : -1;

  if (ssc_direction.x !== e || ssc_direction.y !== t) {
    ssc_direction.x = e;
    ssc_direction.y = t;
    ssc_que = [];
  }
}

function ssc_pulse_(e) {
  var t, n, r;
  e = e * ssc_pulseScale;

  if (e < 1) {
    t = e - (1 - Math.exp(-e));
  } else {
    n = Math.exp(-1);
    e -= 1;
    r = 1 - Math.exp(-e);
    t = n + r * (1 - n);
  }

  return t * ssc_pulseNormalize;
}

function ssc_pulse(e) {
  if (e >= 1) return 1;
  if (e <= 0) return 0;

  if (ssc_pulseNormalize == 1) {
    ssc_pulseNormalize /= ssc_pulse_(1);
  }

  return ssc_pulse_(e);
}

var ssc_framerate = 150;
var ssc_animtime = 500;
var ssc_stepsize = 150;
var ssc_pulseAlgorithm = true;
var ssc_pulseScale = 6;
var ssc_pulseNormalize = 1;
var ssc_keyboardsupport = true;
var ssc_arrowscroll = 50;
var ssc_frame = false;
var ssc_direction = {
  x: 0,
  y: 0
};
var ssc_initdone = false;
var ssc_fixedback = true;
var ssc_root = document.documentElement;
var ssc_activeElement;
var ssc_key = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  spacebar: 32,
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36
};
var ssc_que = [];
var ssc_pending = false;
var ssc_cache = {};
setInterval(function () {
  ssc_cache = {};
}, 10 * 1e3);

var ssc_uniqueID = function () {
  var e = 0;
  return function (t) {
    return t.ssc_uniqueID || (t.ssc_uniqueID = e++);
  };
}();

var ischrome = /chrome/.test(navigator.userAgent.toLowerCase());

if (ischrome) {
  ssc_addEvent("mousedown", ssc_mousedown);
  ssc_addEvent("mousewheel", ssc_wheel);
  ssc_addEvent("load", ssc_init);
}
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57539" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/smoothscroll.js"], null)
//# sourceMappingURL=/smoothscroll.1bb14e6c.js.map
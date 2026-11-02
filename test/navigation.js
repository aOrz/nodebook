const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
let hook;
const Router = function () {};
Router.prototype.map = Router.prototype.redirect = Router.prototype.start = function () {};
Router.prototype.beforeEach = function (callback) { hook = callback; };
let scrolls = 0;
vm.runInNewContext(fs.readFileSync(require.resolve('../src/index.js'), 'utf8'), {
  require: function (name) {
    if (name === 'vue') return { use: function () {} };
    if (name === 'vue-router') return Router;
    return {};
  },
  window: { scrollTo: function (x, y) { assert.strictEqual(x, 0); assert.strictEqual(y, 0); scrolls++; } },
  document: { createElement: function () { return {}; }, body: { childNodes: [], insertBefore: function () {} } }
});
let continued = 0;
hook({ next: function () { continued++; } });
hook({ next: function () { continued++; } });
assert.strictEqual(scrolls, 2);
assert.strictEqual(continued, 2);
console.log('navigation guard regression tests passed');

var postcss = require('postcss');
var extend = require('lodash/object/extend');

var DEFAULTS = {
  base: 16,
};

function nonForcedNumericRegex(number) {
  // finds pixel values not followed by `/* force */`
  return new RegExp(number + 'px(?!\\s*\\/\\*\\s*force\\s*\\*\\/)', 'g');
}

module.exports = postcss.plugin('postcss-px-to-em', function (opts) {
  opts = extend({}, DEFAULTS, opts);

  var regex = /([\d\.]+)px(\s*\/\*\s*force\s*\*\/)?/g;

  var convert = function(context) {
    var replaceable = context.match(regex);

    if (replaceable) {
      replaceable.forEach(function(value) {
        var matches = regex.exec(value);
        regex.lastIndex = 0;

        // if the value is not forced to be pixels, let's replace any matching
        if (!matches[2]) {
          context = context.replace(nonForcedNumericRegex(matches[1]), matches[1] / opts.base + 'em');
        }
      });
    }

    return context;
  };

  return function (css) {
     css.walkDecls(function(node) {
      node.value = convert(node.raws.value ? node.raws.value.raw : node.value);
    });
  };
});

var path = require('path');
var fs = require('fs');
var stylus = require('stylus');
var util = require('util');
var prequire = require('parent-require');

module.exports = function (options, done) {
    var infile = options.infile;
    var plugins = options.plugins || [];

    fs.readFile(infile, function (err, styl) {
        if (err) done(err);

        var compiler = stylus(styl.toString())
                        .set('filename', infile)
                        .set('path', [ path.dirname(infile) ])
                        .set('include css', true);


        if (util.isArray(plugins)) {
            plugins.forEach(function (plugin) {
                if(typeof plugin === 'string') {
                    var p = prequire(plugin);
                    compiler.use(p());
                } else {
                    compiler.use(plugin);
                }
            });
        } else {
            Object.keys(plugins).forEach(function (plugin) {
                if(typeof plugin === 'string') {
                    var p = prequire(plugin);
                    compiler.use(p(plugins[plugin]));
                } else {
                    compiler.use(plugin);
                }
            });
        }

        compiler.render(function (err, css) {
            if (err) return done(err);
            done(null, css);
        });
    });
};

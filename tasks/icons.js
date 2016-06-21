var vfs = require('vinyl-fs');
var easysvg = require('easy-svg');

module.exports = function (opts) {
    return vfs.src(opts.input)
        .pipe(easysvg.stream())
        .pipe(vfs.dest(opts.output));
};
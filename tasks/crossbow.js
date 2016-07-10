var vfs = require('vinyl-fs');
var crossbow = require('/Users/shakyshane/sites/oss/crossbow');

module.exports = function (opts) {
    return vfs.src(opts.input)
        .pipe(crossbow.stream({
            config: opts.config,
            data: opts.data
        }))
        .pipe(vfs.dest(opts.output));
};

var vfs = require('vinyl-fs');
var crossbow = require('crossbow');

module.exports = function (opts) {
    if (opts.production) {
        opts.data.env = 'production';
    }
    return vfs.src(opts.input)
        .pipe(crossbow.stream({
            config: opts.config,
            data: opts.data
        }))
        .pipe(vfs.dest(opts.output));
};

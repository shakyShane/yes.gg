var vfs = require('vinyl-fs');
var crossbow = require('crossbow-sites');

module.exports = function (opts) {
    if (opts.production) {
        opts.data.env = 'production';
    } else {
        opts.data.env = 'dev';
    }
    return vfs.src(opts.input)
        .pipe(crossbow.stream({
            config: opts.config,
            data: opts.data
        }))
        .pipe(vfs.dest(opts.output));
};

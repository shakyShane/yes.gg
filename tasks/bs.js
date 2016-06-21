const bs       = require('browser-sync').create();
const ansispan = require('ansispan');

module.exports = function (opts, ctx, done) {
    if (opts.init) {
        runBs(opts, ctx, done);
        return;
    }
    if (opts.reload) {
        bs.reload.apply(bs, [].concat(opts.reload));
        done();
    }
};

function runBs(opts, ctx, done) {
    ctx.tracker$
        .filter(x => x.type === 'end' && x.item.task.baseTaskName === 'crossbow-sass')
        .do(x => bs.sockets.emit('fullscreen:message:clear'))
        .subscribe();

    ctx.tracker$
        .filter(x => x.type === 'error')
        .pluck('stats', 'errors')
        .subscribe(function (errors) {

            const error = errors[0];

            const title = (function () {
                if (error.relativePath && error.line && error.column) {
                    return `SASS ERROR <span style="font-size: .8em"><strong>${error.relativePath}</strong>:${error.line}:${error.column}</span>`;
                }
                return 'Error';
            })();

            const body = error.message;

            bs.sockets.emit('fullscreen:message', {
                title,
                body: ansispan(body),
                timeout: 100000
            });
        });

    bs.init({
        logFileChanges: false,
        proxy: opts.proxy,
        plugins: ['bs-fullscreen-message', 'bs-console-info', 'bs-latency']
    }, function (err, bs) {
        if (err) {
            return done(err);
        }
        done();
    });
}
const bs       = require('browser-sync').create();
var webpack              = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
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


    /**
     * Require ./webpack.config.js and make a bundler from it
     */
    var webpackConfig = require('../webpack.config');
    var bundler = webpack(webpackConfig);

    /**
     * Reload all devices when bundle is complete
     * or send a fullscreen error message to the browser instead
     */
    bundler.plugin('done', function (stats) {
        if (stats.hasErrors() || stats.hasWarnings()) {
            return bs.sockets.emit('fullscreen:message', {
                title: 'Webpack Error:',
                body: ansispan(stats.toString()),
                timeout: 100000
            });
        }
        bs.reload();
    });

    ctx.tracker$
        .filter(x => x.type === 'end' && x.item.task.baseTaskName === 'crossbow-sass')
        .do(x => bs.sockets.emit('fullscreen:message:clear'))
        .do(x => {
            bs.sockets.emit('replace-plugin:replace', {
                regex: /core\.min\.(.+?)\.css/.source
            })
        })
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
        open: false,
        middleware: [
            webpackDevMiddleware(bundler, {
                publicPath: '/js',
                stats: {colors: true}
            })
        ],
        plugins: ['bs-fullscreen-message', 'bs-console-info', 'bs-latency', {
            module: {
                plugin: function () {
                	console.log('Running');
                },
                hooks: {
                    "client:js": require('fs').readFileSync('tasks/replace-plugin.js', 'utf8')
                }
            }
        }]
    }, function (err, bs) {
        if (err) {
            return done(err);
        }
        done();
    });
}

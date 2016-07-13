var ModuleFilenameHelpers = require("webpack/lib/ModuleFilenameHelpers");
var path = require("path");
var write = require('fs').writeFileSync;
var read = require('fs').readFileSync;

function Manifest(options) {
    this.options = options || {};
}

Manifest.prototype.apply = function(compiler) {
    const manifest = this;
    compiler.plugin('done', function (stats) {
        if (stats.hasErrors()) {
            console.log('Skipping manifest, errors happened');
            return;
        }
        const json = stats.toJson();
        const existing = JSON.parse(read(manifest.options.output, 'utf-8'));
        const output = Object.keys(json.assetsByChunkName).reduce(function (obj, key) {
            obj[key] = path.join(manifest.options.prefix, json.assetsByChunkName[key][0]);
            return obj;
        }, existing);
        write(manifest.options.output, JSON.stringify(output, null, 2));
    })
};

module.exports = Manifest;
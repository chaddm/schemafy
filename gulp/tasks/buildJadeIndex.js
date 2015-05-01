var gulp = require('gulp');
var fs = require('fs');
var glob = require('glob');
var _ = require('lodash');
var ignoredNames = ['index', 'pages', 'ulx'];

gulp.task('buildJadeIndex', function() {
    var outputFile;
    var jadeFileNames = glob.sync('./src/jade/*.jade');
    outputFile = _(jadeFileNames)
        .map(function(name) {
            return name.match(/.*\/(.*?).jade$/)[1];
        })
        .filter(function(name) {
            return ignoredNames.indexOf(name) === -1;
        })
        .reduce(
            function(outputFile, name) {
                return outputFile + "include " + name + "\n";
            },
            '// Build generated: Jade pages auto-included.\n'
        );
    fs.writeFileSync('./src/jade/pages.jade', outputFile);
});


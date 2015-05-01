var gulp = require('gulp');
var fs = require('fs');
var glob = require('glob');
var _ = require('lodash');

gulp.task('buildViewModelIndex', function() {
    var outputFile;
    var viewModelsNames = glob.sync('./src/javascript/viewModels/*.js');
    outputFile = _(viewModelsNames)
        .map(function(viewModelName) {
            return viewModelName.match(/.*\/(.*?).js$/)[1];
        })
        .reduce(
            function(outputFile, viewModelName) {
                return outputFile + "require('./viewModels/" + viewModelName + "');\n";
            },
            '/* Build Generated: ViewModels auto-included. */\n'
        );
    fs.writeFileSync('./src/javascript/viewModelIndex.js', outputFile);
});


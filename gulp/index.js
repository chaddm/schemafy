var fs          = require('fs');
var onlyScripts = require('./util/scriptFilter');
var tasks       = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

tasks.map(function(t) {
  require('./tasks/' + t);
});

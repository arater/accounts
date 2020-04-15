'use strict';function _interopDefault(e){return(e&&(typeof e==='object')&&'default'in e)?e['default']:e}var path=_interopDefault(require('path')),http=_interopDefault(require('http')),express=_interopDefault(require('express')),ReactBodyStream=_interopDefault(require('./app'));var pkg = {name:"accounts",version:"1.0.0",main:"dist/server.js",repository:"https://github.com/arater/accounts.git",author:"Arda Atacan Ersoy",license:"MIT",scripts:{start:"yarn run build && node dist/server",build:"cross-env BUILD=production node index",dev:"cross-env BUILD=development node index"},"private":false,files:["dist"],dependencies:{compression:"^1.7.4","core-js":"^3.6.4",express:"^4.17.1",lowdb:"^1.0.0",react:"^16.13.1","react-dom":"^16.13.1",reload:"^3.0.4","styled-components":"^5.1.0"},devDependencies:{"@babel/core":"^7.9.0","@babel/plugin-proposal-class-properties":"^7.8.3","@babel/plugin-syntax-decorators":"^7.8.3","@babel/plugin-syntax-import-meta":"^7.8.3","@babel/preset-env":"^7.9.5","@babel/preset-react":"^7.9.4","@rollup/plugin-commonjs":"^11.0.2","@rollup/plugin-json":"^4.0.2","@rollup/plugin-node-resolve":"^7.1.1","@rollup/plugin-replace":"^2.3.1","@rollup/plugin-run":"^2.0.1","@types/express":"^4.17.4","@types/react":"^16.9.31","@types/react-dom":"^16.9.6","@types/styled-components":"^5.0.1","@typescript-eslint/eslint-plugin":"^2.26.0","@typescript-eslint/parser":"^2.26.0","cross-env":"^7.0.2",eslint:"^6.8.0","eslint-config-prettier":"^6.10.1","eslint-plugin-prettier":"^3.1.2","eslint-plugin-react":"^7.19.0",nodemon:"^2.0.2",prettier:"^2.0.2",rimraf:"^3.0.2",rollup:"^2.3.2","rollup-plugin-babel":"^4.4.0","rollup-plugin-browsersync":"^1.1.0","rollup-plugin-filesize":"^6.2.1","rollup-plugin-peer-deps-external":"^2.2.2","rollup-plugin-progress":"^1.1.1","rollup-plugin-typescript2":"^0.27.0","rollup-plugin-uglify":"^6.0.4","rollup-plugin-visualizer":"^4.0.2",typescript:"^3.8.3","typescript-plugin-styled-components":"^1.4.4"}};
var app = express();
var port = process.env.PORT || 8081;
var GLOBAL_STATE = {
  text: 'Deneme'
};
var layout = {
  head: "\n<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>" + pkg.name + " Fragment</title>\n    <script>var GLOBAL_STATE = " + JSON.stringify(GLOBAL_STATE) + "</script>\n</head>\n\n<body>\n    <div id=\"root\">",
  foot: "</div>\n  <script src=\"" + pkg.name + ".js\"></script>\n</body>\n\n</html>\n"
};
app.use(express["static"](path.resolve(__dirname, 'public')));
app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.write(layout.head);
  ReactBodyStream.on('data', function (chunk) {
    return res.write(chunk);
  });
  ReactBodyStream.on('error', function (err) {
    console.error('react render error:', err);
  });
  ReactBodyStream.on('end', function () {
    res.write(layout.foot);
    res.end();
  });
});
var httpServer = http.createServer(app);
httpServer.listen(port, function () {
  console.info("Web server listening on port " + port);
});//# sourceMappingURL=server.js.map

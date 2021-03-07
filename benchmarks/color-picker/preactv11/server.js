const { html } = require("./html");
const renderToString = require("./renderToString");
const App = require("./components/App");

module.exports = function(colors) {
  return function benchFn() {
    var html = renderToString(
      html`
        <App colors="${colors}" />
      `
    );

    return html;
  };
};

const { html } = require("./html");
const { renderToString } = require("./renderToString");
const App = require("./components/App");

module.exports = function(getNextSearchResults) {
  return function benchFn() {
    var foo = renderToString(
      html`
        <${App} searchResultsData=${getNextSearchResults()} />
      `
    );

    return foo;
  };
};

function getNextSearchResults() {
  return {
    items: [
      { title: "1", id: "1", image: "", price: "123" },
      { title: "2", id: "2", image: "", price: "123" },
      { title: "3", id: "3", image: "", price: "123" },
      { title: "4", id: "4", image: "", price: "123" },
      { title: "5", id: "5", image: "", price: "123" },
    ],
  };
}

renderToString(
  html`
    <${App} getNextSearchResults="${getNextSearchResults()}" />
  `
);

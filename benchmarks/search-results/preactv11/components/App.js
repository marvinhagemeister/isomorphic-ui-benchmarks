const { html } = require("../html");
var { Component } = require("../framework");

var SearchResultsItem = require("./SearchResultsItem");
var Footer = require("./Footer");

module.exports = class App extends Component {
  componentDidMount() {
    window.onMount();
  }

  render() {
    var searchResultsData = this.props.searchResultsData;

    return html`
      <div class="search-results">
        <div>
          ${searchResultsData.items.map(function(item, i) {
            return html`
              <${SearchResultsItem} key=${i} item=${item} />
            `;
          })}
        </div>
        <${Footer} />
      </div>
    `;
  }
};

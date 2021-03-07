const { html } = require("../html");
const { Component } = require("../framework");

module.exports = class SearchResultsItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      purchased: false,
      // item: this.props.item,
    };

    this.handleBuyButtonClick = this.handleBuyButtonClick.bind(this);
  }

  componentWillReceiveProps(props) {
    this.state = {
      purchased: false,
    };
  }

  handleBuyButtonClick() {
    this.setState({ purchased: true });
  }

  render() {
    console.log("RESULT", this.props);
    const item = this.props.item;
    const style = { backgroundColor: this.state.purchased ? "#f1c40f" : "" };

    return html`
      <div className="search-results-item" style=${style}>
        <h2>${item.title}</h2>
        <div class="lvpic pic img left">
          <div class="lvpicinner full-width picW">
            <a href=${"/buy/" + item.id} class="img imgWr2">
              <img src=${item.image} alt=${item.title} />
            </a>
          </div>
        </div>

        <span class="price">${item.price}</span>

        ${this.state.purchased
          ? html`
              <div class="purchased">Purchased!</div>
            `
          : html`
              <button
                class="buy-now"
                type="button"
                onClick=${this.handleBuyButtonClick}
              >
                Buy now!
              </button>
            `}
      </div>
    `;
  }
};

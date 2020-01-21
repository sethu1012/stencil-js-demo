import { Component, h, State, Element } from "@stencil/core";

@Component({
    tag: "uc-stock-price",
    styleUrls: ["./stock-price.css"],
    shadow: true
})
export class StockPrice {
    @Element() el: HTMLElement;
    @State() price: number = 0;

    onFetchStockPrice = (event: Event) => {
        event.preventDefault();
        const symbol = (this.el.shadowRoot.querySelector(
            "#stock-symbol"
        ) as HTMLInputElement).value;
        fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.API_KEY}`
        )
            .then(data => data.json())
            .then(res => (this.price = +res["Global Quote"]["05. price"]))
            .catch(err => console.log(err));
    };

    render() {
        return [
            <form onSubmit={this.onFetchStockPrice}>
                <input id="stock-symbol" />
                <button type="submit">Fetch</button>
            </form>,
            <div>
                <p>Price: {this.price}</p>
            </div>
        ];
    }
}
// https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=300135.SZ&apikey=demo

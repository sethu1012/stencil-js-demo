import { Component, h, State, Event, EventEmitter } from "@stencil/core";

@Component({
    tag: "uc-stock-finder",
    styleUrls: ["./stock-finder.css"],
    shadow: true
})
export class StockFinder {
    stockNameInput: HTMLInputElement;

    @State() searchResults: { symbol: string; name: string }[];
    @State() loading: boolean = false;
    @Event({ bubbles: true, composed: true }) ucSymbolSelected: EventEmitter<
        string
    >;

    onFindStocks = (event: Event) => {
        event.preventDefault();
        this.loading = true;
        const stockName = this.stockNameInput.value;
        fetch(
            `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${process.env.API_KEY}`
        )
            .then(res => res.json())
            .then(data => {
                this.searchResults = data["bestMatches"].map(match => {
                    return {
                        name: match["2. name"],
                        symbol: match["1. symbol"]
                    };
                });
                this.loading = false;
            })
            .catch(err => {
                console.log(err);
                this.loading = false;
            });
    };

    onSelectSymbol = (symbol: string) => {
        console.log("In");
        this.ucSymbolSelected.emit(symbol);
    };

    render() {
        let content = (
            <ul>
                {this.searchResults &&
                    this.searchResults.map(result => {
                        return (
                            <li
                                onClick={() =>
                                    this.onSelectSymbol(result.symbol)
                                }
                            >
                                <strong>{result.symbol}</strong> - {result.name}
                            </li>
                        );
                    })}
            </ul>
        );
        if (this.loading) {
            content = <uc-spinner />;
        }
        return [
            <form onSubmit={this.onFindStocks}>
                <input
                    id="stock-symbol"
                    ref={el => (this.stockNameInput = el)}
                />
                <button type="submit">Fetch</button>
            </form>,
            content
        ];
    }
}
// https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=300135.SZ&apikey=demo

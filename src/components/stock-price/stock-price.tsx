import {
    Component,
    Element,
    h,
    Prop,
    State,
    Watch,
    Listen
} from "@stencil/core";

@Component({
    tag: "uc-stock-price",
    styleUrls: ["./stock-price.css"],
    shadow: true
})
export class StockPrice {
    stockInput: HTMLInputElement;
    @Element() el: HTMLElement;
    @State() price: number = 0;
    @State() stockUserInput: string;
    @State() stockInputValid: boolean = false;
    @State() error: string;
    @State() loading: boolean = false;

    @Prop({ reflectToAttr: true, mutable: true }) stockSymbol: string;

    componentWillLoad() {
        console.log("componentWillLoad");
        console.log(this.stockSymbol);
        if (this.stockSymbol) {
            this.stockUserInput = this.stockSymbol;
            this.stockInputValid = true;
        }
    }

    componentWillUpdate() {
        // Before re-rendering
        console.log("ComponentWillUpdate");
        // if (this.stockSymbol !== this.initialStockSymbol) {
        //     this.fetchStockPrice(this.stockSymbol);
        // }
    }

    componentDidLoad() {
        // Component added to the DOM
        console.log("ComponentDidLoad");
        if (this.stockSymbol) {
            this.fetchStockPrice(this.stockSymbol);
        }
    }

    componentDidUnload() {
        // Before removing
        console.log("componentDidUnload");
        console.log(this.stockSymbol);
    }

    @Watch("stockSymbol")
    stockSymbolChanged(newValue: string, oldValue: string) {
        if (newValue !== oldValue) {
            this.stockUserInput = newValue;
            this.stockInputValid = true;
            this.fetchStockPrice(newValue);
        }
    }

    @Listen("ucSymbolSelected", { target: "body" })
    onStockSymbolSelected(event: CustomEvent) {
        console.log("Working");
        if (event.detail && event.detail !== this.stockSymbol) {
            this.stockSymbol = event.detail;
        }
    }

    onUserInput = (event: Event) => {
        this.stockUserInput = (event.target as HTMLInputElement).value;
        if (this.stockUserInput.trim() != "") {
            this.stockInputValid = true;
        } else {
            this.stockInputValid = false;
        }
    };

    onFetchStockPrice = (event: Event) => {
        event.preventDefault();
        this.stockSymbol = this.stockInput.value;
        this.fetchStockPrice(this.stockSymbol);
    };

    fetchStockPrice(stockSymbol: string) {
        this.loading = true;
        fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${process.env.API_KEY}`
        )
            .then(data => {
                if (data.status !== 200) {
                    throw new Error("Invalid");
                }
                return data.json();
            })
            .then(res => {
                if (!res["Global Quote"]) {
                    throw new Error("Invalid symbol!");
                }
                this.price = +res["Global Quote"]["05. price"];
                this.loading = false;
            })
            .catch(err => {
                this.error = err.message;
                this.price = null;
                this.loading = false;
            });
    }

    hostData() {
        // Reserved method
        return {
            class: this.error ? "error" : ""
        };
    }

    render() {
        let dataContent = <p>Please enter a symbol!</p>;
        if (this.error) {
            dataContent = <p>{this.error}</p>;
        }
        if (this.price) {
            dataContent = <p>Price: ${this.price}</p>;
        }
        if (this.loading) {
            dataContent = <uc-spinner />;
        }
        return [
            <form onSubmit={this.onFetchStockPrice}>
                <input
                    id="stock-symbol"
                    ref={el => (this.stockInput = el)}
                    value={this.stockUserInput}
                    onInput={this.onUserInput}
                />
                <button
                    type="submit"
                    disabled={!this.stockInputValid || this.loading}
                >
                    Fetch
                </button>
            </form>,
            <div>{dataContent}</div>
        ];
    }
}
// https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=300135.SZ&apikey=demo

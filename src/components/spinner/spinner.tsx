import { Component, h } from "@stencil/core";

@Component({
    tag: "uc-spinner",
    styleUrls: ["./spinner.css"],
    shadow: true
})
export class Spinner {
    render() {
        return (
            <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    }
}

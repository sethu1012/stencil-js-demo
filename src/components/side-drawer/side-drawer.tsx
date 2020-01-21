import { Component, h, Prop, State, Method } from "@stencil/core";

@Component({
    tag: "uc-side-drawer",
    styleUrl: "./side-drawer.css",
    shadow: true
})
export class SideDrawer {
    @State() showContactInfo: boolean = false;

    @Prop({
        reflectToAttr: true
    })
    header: string;

    @Prop({
        reflectToAttr: true,
        mutable: true
    })
    show: boolean = false;

    onCloseDrawer = () => {
        this.show = false;
    };

    onContentChange = (content: string) => {
        this.showContactInfo = content === "contact";
    };

    @Method() async open() {
        this.show = true;
    }

    @Method() async close() {
        this.show = false;
    }

    render() {
        let mainContent = <slot />;
        if (this.showContactInfo) {
            mainContent = (
                <div>
                    <h2>Contact Information</h2>
                    <p>Reach us via phone</p>
                    <ul>
                        <li>Phone</li>
                    </ul>
                </div>
            );
        }
        return [
            <div class="backdrop" onClick={this.onCloseDrawer} />,
            <aside>
                <header>
                    <h1>{this.header}</h1>
                    <button onClick={this.onCloseDrawer}>X</button>
                </header>
                <section class="tabs">
                    <button
                        class={!this.showContactInfo ? "active" : ""}
                        onClick={() => this.onContentChange("nav")}
                    >
                        Navigation
                    </button>
                    <button
                        class={this.showContactInfo ? "active" : ""}
                        onClick={() => this.onContentChange("contact")}
                    >
                        Contact
                    </button>
                </section>
                <main>{mainContent}</main>
            </aside>
        ];
    }
}

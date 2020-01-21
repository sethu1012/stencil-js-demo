import { Config } from "@stencil/core";
import dotenv from "rollup-plugin-dotenv";

export const config: Config = {
    namespace: "web-components-stencil",
    outputTargets: [
        {
            type: "dist",
            esmLoaderPath: "../loader"
        },
        {
            type: "docs-readme"
        },
        {
            type: "www",
            serviceWorker: null // disable service workers
        }
    ],
    plugins: [dotenv()]
};

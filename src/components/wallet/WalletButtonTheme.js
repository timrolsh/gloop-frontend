import merge from "lodash.merge";
import {darkTheme} from "@rainbow-me/rainbowkit";

export const gloopTheme = merge(darkTheme(), {
  colors: {
    // Gloop green
    connectButtonBackground: "#19FB80",
    // black
    connectButtonText: "#000000"
  },
  fonts: {
    body: "system-ui, sans-serif"
  },
  radii: {
    connectButton: "4px"
  }
});

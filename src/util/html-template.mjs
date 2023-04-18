import { html } from "s2-engine";

import { IS_NODE_HEADLESS } from "@/util/dev.mjs";

// Opt-in to degen html
// parseMustache.selfClosing = true;

const tag = IS_NODE_HEADLESS ? () => null : html;

export default tag;

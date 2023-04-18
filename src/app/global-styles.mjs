import { createGlobalStyles } from "goober/global";

import { styles } from "clutch";

export const style = /* css */ `
${styles}

@property --active-player-deg {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

:root {
  --toolbar-width: calc(var(--sp-11) * 3);
  --scrollbar-width: var(--sp-2_5);
  --scrollbar-width-sm: var(--sp-2_5);
  --page-tabs-height: var(--sp-10);
}
::-webkit-scrollbar {
  width: var(--scrollbar-width);
}
::-webkit-scrollbar-thumb {
  background-color: var(--shade3-25);
  border-radius: 0;
  border: none;
}
::-webkit-scrollbar-thumb:hover {
  background-color: var(--shade3-50);
}

* { margin: 0; padding: 0; border: none; box-sizing: border-box; }

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
}
body {
  --app-bg: var(--shade9);
  color: var(--shade0);
  background: var(--app-bg);
}
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  height: 100%;
  width: 100%;
  cursor: default;
}
a {
  color: inherit;
  text-decoration: none;
}
textarea::-webkit-input-placeholder,
input::-webkit-input-placeholder {
  color: var(--shade3);
}
.disable-animations *,
.disable-animations *::before,
.disable-animations *::after {
  transition: none !important;
  animation: none !important;
}
[data-tooltip] * {
  pointer-events: none;
}

@keyframes invalid-link {
  from { color: var(--primary); }
  to { color: var(--blue); }
}
`;

export default createGlobalStyles`${style}`;

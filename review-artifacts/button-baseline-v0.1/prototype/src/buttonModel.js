export const BUTTON_VARIANTS = ["primary", "secondary", "tertiary"];
export const BUTTON_STATES = [
  "default",
  "hover",
  "focus-visible",
  "pressed",
  "loading",
  "disabled",
];
export const THEMES = ["charcoal", "metal", "moon"];

export function activationAllowed({ disabled, loading }) {
  return !disabled && !loading;
}

export function tertiaryAnatomy(state) {
  return state === "loading" ? ["progress", "label"] : ["label"];
}

const CONTEXT_STATES = {
  toolbar: ["default", "hover", "focus-visible", "pressed", "loading", "disabled"],
  form: ["field-default", "button-focus-visible"],
  dialog: ["default", "default", "default"],
};

export function contextStateForTheme(context) {
  return [...CONTEXT_STATES[context]];
}

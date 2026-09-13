import { useMemo, useState } from "react";
import { CircleNotch, Gear, MagnifyingGlass } from "@phosphor-icons/react";

import {
  BUTTON_STATES,
  BUTTON_VARIANTS,
  THEMES,
  activationAllowed,
} from "./buttonModel.js";
import { THEME_FIXTURES, themeStyle } from "./themeFixtures.js";

const COMPONENT_GROUPS = [
  ["ACTIONS", ["Button", "Icon Button", "Split Button", "Toolbar"]],
  ["INPUTS", ["Text Field", "Search Field", "Textarea / Composer", "Select / Combobox"]],
  ["SELECTION", ["Checkbox", "Radio", "Switch / Toggle", "Slider"]],
  ["NAVIGATION", ["Breadcrumb", "Tabs", "Sidebar Navigation", "Pagination"]],
  ["DATA DISPLAY", ["Table / Data Grid", "List", "Badge / Tag", "Card / Panel"]],
  ["STRUCTURE", ["Accordion", "Divider", "Tree View", "Form / Fieldset"]],
];

const STATE_LABELS = {
  default: "Default",
  hover: "Hover",
  "focus-visible": "Focus-visible",
  pressed: "Pressed",
  loading: "Loading",
  disabled: "Disabled",
};

function PdButton({ variant, state = "default", children = "Button", onActivate }) {
  const disabled = state === "disabled";
  const loading = state === "loading";

  function activate() {
    if (activationAllowed({ disabled, loading })) onActivate?.();
  }

  return (
    <button
      type="button"
      className={`pd-prototype-button pd-prototype-button--${variant}`}
      data-force-state={state}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={activate}
    >
      {loading && <CircleNotch className="loading-icon" aria-hidden="true" weight="bold" />}
      <span>{children}</span>
    </button>
  );
}

function Sidebar() {
  let index = 1;
  return (
    <aside className="sidebar" aria-label="Component navigation">
      <div className="sidebar-heading">Components <span>(30)</span></div>
      {COMPONENT_GROUPS.map(([group, items]) => (
        <section className="nav-group" key={group}>
          <h2>{group} <span>({items.length})</span></h2>
          {items.map((item) => {
            const number = String(index++).padStart(2, "0");
            return (
              <a
                key={item}
                href={item === "Button" ? "#button" : `#${item.toLowerCase().replaceAll(" ", "-")}`}
                className={item === "Button" ? "is-current" : undefined}
                aria-current={item === "Button" ? "page" : undefined}
              >
                <span>{number}</span>{item}
              </a>
            );
          })}
        </section>
      ))}
    </aside>
  );
}

function ThemeHeader({ theme }) {
  const fixture = THEME_FIXTURES[theme];
  return (
    <div className="theme-heading" style={themeStyle(theme)}>
      <strong>{fixture.label}</strong>
      <span>{fixture.description}</span>
      <div className="variant-labels" aria-hidden="true">
        <span>Primary</span><span>Secondary</span><span>Tertiary</span>
      </div>
    </div>
  );
}

function ThemeStateCell({ theme, state, onActivate }) {
  return (
    <div className="theme-cell" style={themeStyle(theme)} data-preview-theme={theme}>
      {BUTTON_VARIANTS.map((variant) => (
        <PdButton
          key={variant}
          variant={variant}
          state={state}
          onActivate={() => onActivate(`${THEME_FIXTURES[theme].label} · ${variant} · ${state}`)}
        />
      ))}
    </div>
  );
}

function StateMatrix({ onActivate }) {
  return (
    <div className="matrix" aria-label="Button variants, states and themes">
      <div className="matrix-corner">State</div>
      {THEMES.map((theme) => <ThemeHeader key={theme} theme={theme} />)}
      {BUTTON_STATES.flatMap((state) => [
        <div className="state-label" key={`${state}-label`}>{STATE_LABELS[state]}</div>,
        ...THEMES.map((theme) => (
          <ThemeStateCell key={`${theme}-${state}`} theme={theme} state={state} onActivate={onActivate} />
        )),
      ])}
    </div>
  );
}

function ContextTheme({ theme, context, scenario, onActivate }) {
  const fieldFocused = scenario === "field-focus";
  const buttonState = scenario === "field-focus" ? "default" : scenario;
  const common = { onActivate };

  return (
    <div className="context-theme" style={themeStyle(theme)} data-preview-theme={theme}>
      <h3>{THEME_FIXTURES[theme].label}</h3>
      {context === "toolbar" && (
        <div className="toolbar-actions" role="toolbar" aria-label={`${THEME_FIXTURES[theme].label} toolbar`}>
          <PdButton variant="secondary" state={buttonState} {...common}>New</PdButton>
          <PdButton variant="secondary" {...common}>Open</PdButton>
          <PdButton variant="secondary" state="disabled" {...common}>Share</PdButton>
          <PdButton variant="tertiary" state={buttonState} {...common}>More</PdButton>
        </div>
      )}
      {context === "form" && (
        <form className="form-actions" onSubmit={(event) => event.preventDefault()}>
          <label>
            <span>Email address</span>
            <input className={fieldFocused ? "force-focus" : undefined} type="email" placeholder="name@example.com" />
          </label>
          <div className="action-pair">
            <PdButton variant="primary" state={buttonState} {...common}>Save</PdButton>
            <PdButton variant="secondary" {...common}>Cancel</PdButton>
          </div>
        </form>
      )}
      {context === "dialog" && (
        <div className="dialog-actions" aria-label={`${THEME_FIXTURES[theme].label} dialog footer`}>
          <PdButton variant="primary" state={buttonState} {...common}>Confirm</PdButton>
          <PdButton variant="secondary" {...common}>Cancel</PdButton>
          <PdButton variant="tertiary" {...common}>Learn more</PdButton>
        </div>
      )}
    </div>
  );
}

function ContextCorridor({ scenario, onScenario, onActivate }) {
  const scenarios = ["default", "hover", "focus-visible", "pressed", "loading", "disabled", "field-focus"];
  return (
    <>
      <div className="scenario-bar" aria-label="Comparison scenario">
        <span>Comparison state</span>
        {scenarios.map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={scenario === item}
            onClick={() => onScenario(item)}
          >
            {item === "field-focus" ? "Field focus" : STATE_LABELS[item]}
          </button>
        ))}
      </div>
      {[
        ["toolbar", "Toolbar", "Multiple low-level actions and border density."],
        ["form", "Form action", "Input and action focus competition."],
        ["dialog", "Dialog footer", "Priority in a concentrated action group."],
      ].map(([context, title, description]) => (
        <section className="context-row" key={context}>
          <header><h2>{title}</h2><p>{description}</p></header>
          <div className="context-themes">
            {THEMES.map((theme) => (
              <ContextTheme
                key={theme}
                theme={theme}
                context={context}
                scenario={scenario}
                onActivate={() => onActivate(`${title} · ${THEME_FIXTURES[theme].label}`)}
              />
            ))}
          </div>
        </section>
      ))}
      <section className="coverage-row">
        <h2>State coverage across themes</h2>
        <p>Each theme uses the same scenario and interaction model.</p>
        <div className="coverage-themes">
          {THEMES.map((theme) => (
            <div className="coverage-theme" key={theme} style={themeStyle(theme)}>
              <strong>{THEME_FIXTURES[theme].label}</strong>
              <div>{BUTTON_STATES.map((state) => <span key={state}>{STATE_LABELS[state]}</span>)}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Inspector({ view, eventLog, onProbe }) {
  const pending = ["Native button semantics", "Tab focus", "Enter / Space activation", "Disabled activation", "Loading interaction", "Focus contrast", "Screen reader label", "Reduced motion"];
  return (
    <aside className="inspector" aria-label="Component Inspector">
      <h2>Component Inspector</h2>
      <section><h3>Anatomy</h3><p>Container · Label · Optional progress indicator</p><p>Disabled preserves the same anatomy.</p></section>
      <section><h3>State semantics</h3><dl><dt>Hover</dt><dd>Pointer feedback</dd><dt>Focus-visible</dt><dd>Keyboard focus, stronger than hover</dd><dt>Pressed</dt><dd>Momentary activation</dd><dt>Loading</dt><dd>Action remains identifiable</dd><dt>Selected</dt><dd>Not applicable</dd></dl></section>
      <section><h3>Keyboard behavior</h3><button type="button" className="probe-button" onClick={onProbe}>Run activation probe</button><p className="event-log" aria-live="polite">{eventLog || "No activation recorded"}</p></section>
      <section><h3>Accessibility status</h3><ul className="pending-list">{pending.map((item) => <li key={item}><span aria-hidden="true" />{item}<em>Pending validation</em></li>)}</ul></section>
      <section><h3>Theme equivalence</h3><p><b>Baseline:</b> same structure and interaction model.</p><p><b>Visual hypothesis:</b> equivalent hierarchy across themes.</p></section>
      <section><h3>Surface / Border density risks</h3><ul><li>Frame-within-frame</li><li>Excessive dividers</li><li>Focus border noise</li><li>Surface fragmentation</li></ul></section>
      <section><h3>Evidence status</h3><dl><dt>Baseline</dt><dd>Frozen structure</dd><dt>Visual hypothesis</dt><dd>Current treatment</dd><dt>Validate in implementation</dt><dd>Pending</dd><dt>Candidate rule</dt><dd>Pending review</dd></dl><p className="candidate">Focus-visible may improve recognition without changing variant identity.</p><p className="candidate">State may change presentation without adding unsupported anatomy.</p></section>
      <footer>{view === "matrix" ? "Variant × State × Theme" : "Context × Theme × State"}</footer>
    </aside>
  );
}

export function App() {
  const [view, setView] = useState("matrix");
  const [scenario, setScenario] = useState("default");
  const [eventLog, setEventLog] = useState("");
  const title = view === "matrix" ? "Button State Matrix" : "Button Context Corridor";
  const description = view === "matrix"
    ? "Compare variant, state and theme without changing the component model."
    : "Test the same state grammar in toolbar, form and dialog contexts.";
  const timestamp = useMemo(() => new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), []);

  function record(message) {
    setEventLog(`${message} activated at ${timestamp.format(new Date())}`);
  }

  return (
    <main className="observatory" data-density="compact">
      <header className="topbar">
        <a className="product-name" href="#button">State Observatory <span>Design System</span></a>
        <nav aria-label="Artifact views">
          <button type="button" aria-current={view === "matrix" ? "page" : undefined} onClick={() => setView("matrix")}>State Matrix</button>
          <button type="button" aria-current={view === "corridor" ? "page" : undefined} onClick={() => setView("corridor")}>Context Corridor</button>
        </nav>
        <div className="top-actions" aria-label="Utilities"><MagnifyingGlass aria-label="Search" /><Gear aria-label="Settings" /></div>
      </header>
      <Sidebar />
      <section className="content" id="button">
        <header className="content-heading">
          <div><p>01 · Actions · Button</p><h1>{title}</h1><span>{description}</span></div>
          <div className="theme-key" aria-label="Compared themes">{THEMES.map((theme) => <span key={theme}>{THEME_FIXTURES[theme].label}</span>)}</div>
        </header>
        {view === "matrix"
          ? <StateMatrix onActivate={record} />
          : <ContextCorridor scenario={scenario} onScenario={setScenario} onActivate={record} />}
      </section>
      <Inspector view={view} eventLog={eventLog} onProbe={() => record("Inspector probe")} />
    </main>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import AdjustmentsHorizontalIcon from "@heroicons/react/24/outline/AdjustmentsHorizontalIcon";
import ArrowUpIcon from "@heroicons/react/24/outline/ArrowUpIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import ChartPieIcon from "@heroicons/react/24/outline/ChartPieIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { palladioTokens } from "../../../../../palladio/dist/ts/tokens";
import { applySuggestion, getSuggestion, suggestionData } from "./editorModel";

function typographyStyle(token) {
  return {
    fontFamily: token.fontFamily.join(", "),
    fontSize: `${token.fontSize.value}${token.fontSize.unit}`,
    fontWeight: token.fontWeight,
    lineHeight: token.lineHeight,
    letterSpacing: `${token.letterSpacing.value}${token.letterSpacing.unit}`,
  };
}

const displayTypography = typographyStyle(palladioTokens.text.display);
const bodyLargeTypography = typographyStyle(palladioTokens.text["body-lg"]);

const chapterData = [
  { number: "01", title: "The Arrival", scenes: ["Rain on the Glass", "A Stranger's Key", "First Impressions"], progress: 0 },
  { number: "02", title: "Fractures", scenes: ["Uneasy Calm", "Old Wounds", "The Argument", "Aftershocks"], progress: 0.62 },
  { number: "03", title: "The Threshold", scenes: ["At the Door", "The Choice", "Crossing Over"], progress: 0.34 },
  { number: "04", title: "The Reckoning", scenes: ["Consequences", "Truths Revealed", "No Turning Back"], progress: 0 },
  { number: "05", title: "The Quiet", scenes: ["Loose Ends", "Letting Go", "What Remains"], progress: 0 },
];

const chapterDrafts = {
  "01": {
    eyebrow: "Chapter 01",
    title: "The Arrival",
    paragraphs: [
      "By the time Mara reached the station, the rain had turned the platform into a long mirror.",
      "A train waited without announcing itself. Its windows held the last pale shapes of evening, each one slipping away before she could decide what it meant.",
      "She checked the address again. The paper was soft at the folds, worn from being opened and closed on the walk here.",
    ],
  },
  "02": {
    eyebrow: "Chapter 02",
    title: "Fractures",
    paragraphs: [
      "The house looked the same from the road, though the fence leaned further into the grass than she remembered.",
      "Mara stood beneath the porch light and listened to the quiet inside. It had the shape of a question that had waited too long.",
      "She could still leave. The thought arrived cleanly, then broke into smaller pieces in her hands.",
    ],
  },
  "03": {
    eyebrow: "Chapter 03",
    title: "The Threshold",
    paragraphs: [
      "The house stood at the edge of town, where the streetlights thinned and the pavement gave way to gravel. Ivy crawled up the porch rail and around the columns, softening the angles time had sharpened.",
      "Mara hesitated at the bottom step. The door was painted the color of storm clouds, a deep, settled gray that seemed to absorb the last of the evening light. She could hear the faint hum of something inside—an old refrigerator, a ticking clock, or the house itself breathing.",
      "She had come too far to turn back. Not tonight.",
      "Her hand hovered near the brass knob, cool even through her gloves. She thought of the letter in her pocket, the one with no return address and three short sentences that had changed everything.",
      "If you’re reading this, it means I wasn’t ready to tell you.",
      "The hinges creaked before she turned the knob, as if the house wanted to be heard before it was opened. Mara exhaled, steadying herself, and pushed the door inward. The darkness inside did not move, but it made room.",
    ],
  },
  "04": {
    eyebrow: "Chapter 04",
    title: "The Reckoning",
    paragraphs: [
      "Morning arrived without an apology. Light found the dust in the hallway and gave every piece of it a name.",
      "Mara placed the letter on the table. The room had kept its silence, but she no longer mistook silence for an answer.",
      "There were truths that asked to be carried, and truths that asked to be set down.",
    ],
  },
  "05": {
    eyebrow: "Chapter 05",
    title: "The Quiet",
    paragraphs: [
      "The last room was smaller than she remembered. It held the window, the chair, and enough space for one person to change their mind.",
      "Outside, the street began again. Mara listened until the sound became ordinary.",
      "What remained was not an ending. It was the part that could finally begin.",
    ],
  },
};

function isNarrowViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches;
}

function countWords(paragraphs) {
  return paragraphs.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function ChapterItem({ chapter, active, onSelect }) {
  return (
    <button
      className={`chapter-item${active ? " is-active" : ""}`}
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={() => onSelect(chapter.number)}
    >
      <span className="chapter-item__copy">
        <span className="chapter-item__number">{chapter.number}</span>
        <span className="chapter-item__title">{chapter.title}</span>
      </span>
      <span className="chapter-item__progress" aria-label={`${Math.round(chapter.progress * 100)} percent complete`}>
        <ChartPieIcon className="chapter-progress-icon" style={{ opacity: chapter.progress ? 1 : 0.6 }} />
      </span>
    </button>
  );
}

function App() {
  const [activeChapter, setActiveChapter] = useState("03");
  const [drafts, setDrafts] = useState(chapterDrafts);
  const [showSidebar, setShowSidebar] = useState(() => !isNarrowViewport());
  const [showAi, setShowAi] = useState(() => !isNarrowViewport());
  const [showPrompt, setShowPrompt] = useState(false);
  const [applied, setApplied] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiMessage, setAiMessage] = useState(suggestionData["03"].message);
  const sidebarToggleRef = useRef(null);
  const sidebarFocusRef = useRef(null);
  const aiToggleRef = useRef(null);
  const aiCloseRef = useRef(null);
  const promptInputRef = useRef(null);
  const initialSidebarFocusRef = useRef(true);
  const initialAiFocusRef = useRef(true);
  const draft = useMemo(() => drafts[activeChapter], [activeChapter, drafts]);
  const suggestion = useMemo(() => getSuggestion(activeChapter, drafts), [activeChapter, drafts]);
  const wordCount = useMemo(() => countWords(draft.paragraphs), [draft]);
  const appShellClassName = [
    "app-shell",
    !showSidebar ? "app-shell--sidebar-hidden" : "",
    !showAi ? "app-shell--ai-hidden" : "",
  ].filter(Boolean).join(" ");

  useEffect(() => {
    if (initialSidebarFocusRef.current) {
      initialSidebarFocusRef.current = false;
      return;
    }

    if (showSidebar) {
      sidebarFocusRef.current?.focus();
    } else {
      sidebarToggleRef.current?.focus();
    }
  }, [showSidebar]);

  useEffect(() => {
    if (initialAiFocusRef.current) {
      initialAiFocusRef.current = false;
      return;
    }

    if (showAi) {
      if (showPrompt) {
        promptInputRef.current?.focus();
      } else {
        aiCloseRef.current?.focus();
      }
    } else {
      aiToggleRef.current?.focus();
    }
  }, [showAi, showPrompt]);

  function selectChapter(number) {
    setActiveChapter(number);
    setApplied(false);
    setAiMessage(suggestionData[number].message);
  }

  function submitPrompt(event) {
    event.preventDefault();
    if (!prompt.trim()) return;
    setAiMessage(`Reviewing: ${prompt.trim()}`);
    setPrompt("");
    setApplied(false);
  }

  function handleApply() {
    setDrafts((currentDrafts) => applySuggestion(currentDrafts, activeChapter));
    setApplied(true);
  }

  function closeMobilePanels() {
    setShowSidebar(false);
    setShowAi(false);
    setShowPrompt(false);
  }

  return (
    <div className={appShellClassName} data-theme="dark">
      <header className="topbar">
        <div className="topbar__leading">
          <div className="brand-block">
            <span className="brand-block__title">The Quiet Between</span>
            <button className="draft-selector" type="button" disabled title="Not implemented in prototype">
              Draft <ChevronDownIcon />
            </button>
          </div>
          <button className="icon-button" type="button" aria-label="Toggle chapters" aria-expanded={showSidebar} aria-controls="chapter-navigation" ref={sidebarToggleRef} onClick={() => setShowSidebar((value) => !value)}>
            <Bars3Icon />
          </button>
        </div>
        <div className="topbar__status" aria-label="Document status">
          <span className="status-dot" />
          <span>Saved</span>
        </div>
        <div className="topbar__actions">
          <button className="topbar-action" type="button" aria-label={showAi ? "Hide AI editor" : "Show AI editor"} aria-expanded={showAi} aria-controls="ai-editor-panel" ref={aiToggleRef} onClick={() => setShowAi((value) => !value)}>
            <SparklesIcon />
            <span>{showAi ? "Hide AI" : "Show AI"}</span>
          </button>
          <button className="icon-button" type="button" aria-label="More document actions" disabled title="Not implemented in prototype">
            <EllipsisVerticalIcon />
          </button>
        </div>
      </header>

      <div className={`workspace${showSidebar ? "" : " workspace--sidebar-hidden"}${showAi ? "" : " workspace--ai-hidden"}`}>
        {(showSidebar || showAi) && (
          <button className="mobile-scrim" type="button" aria-label="Close open panel" onClick={closeMobilePanels} />
        )}
        <aside id="chapter-navigation" className="sidebar" data-density="compact" aria-label="Chapter navigation" aria-hidden={!showSidebar} inert={!showSidebar ? true : undefined}>
          <div className="sidebar__header">
            <span className="eyebrow">Chapters</span>
            <button className="icon-button icon-button--small" type="button" aria-label="Add chapter" ref={sidebarFocusRef} disabled title="Not implemented in prototype">
              <PlusIcon />
            </button>
          </div>
          <nav className="chapter-list">
            {chapterData.map((chapter) => (
              <div className="chapter-group" key={chapter.number}>
                <ChapterItem chapter={chapter} active={activeChapter === chapter.number} onSelect={selectChapter} />
                <div className="chapter-scenes" aria-label={`${chapter.title} scenes`}>
                  {chapter.scenes.map((scene, index) => (
                    <div className={`scene-item${activeChapter === chapter.number && index === 0 ? " is-active" : ""}`} role="listitem" key={scene} aria-label={`${chapter.title}, ${scene} (not implemented)`}>
                      <span className="scene-marker" aria-hidden="true" />
                      <span>{chapter.number}.{String(index + 1).padStart(2, "0")}</span>
                      <span className="scene-title">{scene}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="sidebar__footer">
            <div className="progress-label">
              <span>Manuscript progress</span>
              <span>41%</span>
            </div>
            <div className="progress-track" aria-label="Manuscript progress 41 percent">
              <span />
            </div>
            <div className="sidebar__footer-actions">
              <button className="icon-button icon-button--small" type="button" aria-label="Open writing settings" disabled title="Not implemented in prototype">
                <Cog6ToothIcon />
              </button>
              <button className="icon-button icon-button--small" type="button" aria-label="Open chapter filters" disabled title="Not implemented in prototype">
                <AdjustmentsHorizontalIcon />
              </button>
            </div>
          </div>
        </aside>

        <main className="manuscript" data-density="default" aria-label="Long-form manuscript">
          <div className="manuscript__inner">
            <div className="manuscript__eyebrow">{draft.eyebrow}</div>
            <div className="manuscript__heading-row">
              <h1 style={displayTypography}>{draft.title}</h1>
              <button className="icon-button icon-button--small manuscript-menu" type="button" aria-label="Chapter actions" disabled title="Not implemented in prototype">
                <EllipsisVerticalIcon />
              </button>
            </div>
            <div className="manuscript__rule" />
            <article className="manuscript__body" style={bodyLargeTypography}>
              {draft.paragraphs.map((paragraph, index) => (
                <p className={index === 4 ? "manuscript__line manuscript__line--note" : ""} key={`${activeChapter}-${index}`}>
                  {paragraph}
                </p>
              ))}
            </article>
            <div className="manuscript__footer">
              <span>{wordCount.toLocaleString("en-US")} words</span>
              <span className="footer-separator">•</span>
              <span>Saved just now</span>
              <button className="ask-button" type="button" onClick={() => { setShowAi(true); setShowPrompt(true); }}>
                <ChatBubbleLeftRightIcon />
                Ask AI
              </button>
            </div>
          </div>
        </main>

        <aside id="ai-editor-panel" className="ai-panel" data-density="default" aria-label="AI editor" aria-hidden={!showAi} inert={!showAi ? true : undefined}>
          <div className="ai-panel__header">
            <div className="ai-panel__title">
              <SparklesIcon />
              <span>AI Editor</span>
            </div>
            <button className="icon-button icon-button--small" type="button" aria-label="Close AI editor" ref={aiCloseRef} onClick={() => { setShowAi(false); setShowPrompt(false); }}>
              <XMarkIcon />
            </button>
          </div>

          <div className="ai-panel__content">
            <div className="ai-panel__section-label">Suggestion</div>
            <div className={`suggestion-card${applied ? " suggestion-card--applied" : ""}`}>
              <div className="suggestion-card__heading">
                <span className="suggestion-icon"><SparklesIcon /></span>
                <span>{applied ? "Suggestion applied" : aiMessage}</span>
              </div>
              <p>
                {applied
                  ? suggestion.appliedMessage
                  : "This paragraph includes sensory details that set mood, but the current sentence can give Mara’s decision more room to land."}
              </p>
              {!applied && (
                <blockquote>{suggestion.quote}</blockquote>
              )}
              <button className="primary-action" type="button" onClick={handleApply} disabled={applied}>
                {applied ? <CheckIcon /> : <ArrowUpIcon />}
                {applied ? "Applied" : "Apply"}
              </button>
            </div>
            <p className="ai-panel__disclaimer">AI suggestions can be inaccurate. Review before applying.</p>
          </div>

          {showPrompt && (
            <form className="ai-prompt" onSubmit={submitPrompt}>
              <label className="sr-only" htmlFor="ai-prompt-input">Ask AI</label>
              <input id="ai-prompt-input" ref={promptInputRef} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask AI" />
              <button className="prompt-submit" type="submit" aria-label="Send prompt">
                <ArrowUpIcon />
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}

export { App };

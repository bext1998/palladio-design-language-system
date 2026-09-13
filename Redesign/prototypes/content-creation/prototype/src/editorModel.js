export const suggestionData = {
  "01": {
    targetIndex: 1,
    message: "Find the emotional hinge in this scene",
    replacement: "A train waited without a sound. Its windows held the last pale shapes of evening, each one slipping away before she could decide what they meant.",
    appliedMessage: "The arrival now carries a quieter pause before Mara decides what the train means.",
  },
  "02": {
    targetIndex: 1,
    message: "Find the emotional hinge in this scene",
    replacement: "Mara stood beneath the porch light and listened to the quiet inside. It had waited too long to become a question.",
    appliedMessage: "The silence now gives Mara a clearer moment before she considers leaving.",
  },
  "03": {
    targetIndex: 1,
    message: "Consider tightening this paragraph",
    replacement: "She heard the faint hum of something inside and kept her eyes on the door.",
    appliedMessage: "The scene now lands with a little more space around Mara’s hesitation.",
  },
  "04": {
    targetIndex: 1,
    message: "Find the emotional hinge in this scene",
    replacement: "Mara placed the letter on the table. The room kept its silence; she no longer mistook it for an answer.",
    appliedMessage: "The room’s silence now reads as a decision rather than an unanswered question.",
  },
  "05": {
    targetIndex: 1,
    message: "Find the emotional hinge in this scene",
    replacement: "Outside, the street began again. Mara listened until the sound became ordinary, then let the room go quiet.",
    appliedMessage: "The ending now gives Mara a quieter release before the story moves on.",
  },
};

export function getSuggestion(chapterKey, drafts) {
  const suggestion = suggestionData[chapterKey] ?? suggestionData["03"];
  const chapter = drafts[chapterKey];

  if (!chapter) {
    throw new Error(`Unknown chapter ${chapterKey}`);
  }

  return {
    ...suggestion,
    quote: chapter.paragraphs[suggestion.targetIndex],
  };
}

export function applySuggestion(drafts, chapterKey) {
  const suggestion = getSuggestion(chapterKey, drafts);
  const chapter = drafts[chapterKey];

  return {
    ...drafts,
    [chapterKey]: {
      ...chapter,
      paragraphs: chapter.paragraphs.map((paragraph, index) => (
        index === suggestion.targetIndex ? suggestion.replacement : paragraph
      )),
    },
  };
}

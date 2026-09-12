const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

export const componentRequirements = {
  navigation: {
    rootTag: 'nav',
    rootClass: 'pd-nav',
    listClass: 'pd-nav__list',
    linkClass: 'pd-nav__link',
    activeClass: 'pd-nav__link--active'
  },
  button: {
    rootTag: 'button',
    rootClass: 'pd-button'
  },
  input: {
    rootTag: 'input',
    rootClass: 'pd-input'
  },
  divider: {
    rootTag: 'hr',
    rootClass: 'pd-divider',
    verticalClass: 'pd-divider--vertical'
  },
  badge: {
    rootClass: 'pd-badge',
    interactiveClass: 'pd-badge--interactive',
    allowedTags: ['span', 'button', 'a'],
    interactiveTags: ['button', 'a']
  },
  card: {
    rootClass: 'pd-card',
    interactiveClass: 'pd-card--interactive',
    allowedTags: ['div', 'article', 'section', 'a', 'button'],
    interactiveTags: ['button', 'a']
  }
};

function parseAttributes(source) {
  const attributes = new Map();
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;

  while ((match = attributePattern.exec(source))) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? true;
    attributes.set(name, value);
  }

  return attributes;
}

function parseHtml(html) {
  const nodes = [];
  const stack = [];
  const tagPattern = /<\/?([a-zA-Z][\w:-]*)(?:\s[^<>]*?)?\/?\s*>/g;
  let match;

  while ((match = tagPattern.exec(html))) {
    const fullTag = match[0];
    const tag = match[1].toLowerCase();

    if (fullTag.startsWith('</')) {
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        if (nodes[stack[index]].tag === tag) {
          stack.length = index;
          break;
        }
      }
      continue;
    }

    const attributesSource = fullTag
      .replace(/^<[a-zA-Z][\w:-]*/, '')
      .replace(/\/?\s*>$/, '');
    const attributes = parseAttributes(attributesSource);
    const classValue = attributes.get('class');
    const classes = new Set(typeof classValue === 'string' ? classValue.split(/\s+/).filter(Boolean) : []);
    const node = { tag, attributes, classes, parent: stack.at(-1) ?? null };
    nodes.push(node);

    if (!VOID_ELEMENTS.has(tag) && !fullTag.endsWith('/>')) {
      stack.push(nodes.length - 1);
    }
  }

  return nodes;
}

function isDescendantOf(nodes, nodeIndex, ancestorIndex) {
  let parent = nodes[nodeIndex].parent;
  while (parent !== null) {
    if (parent === ancestorIndex) return true;
    parent = nodes[parent].parent;
  }
  return false;
}

function describe(node) {
  return `<${node.tag}>`;
}

function validateNavigation(nodes, errors) {
  const requirement = componentRequirements.navigation;
  const roots = nodes
    .map((node, index) => ({ node, index }))
    .filter(({ node }) => node.tag === requirement.rootTag);

  if (roots.length === 0) {
    errors.push('navigation: expected a <nav> root.');
    return;
  }

  for (const { node: root, index: rootIndex } of roots) {
    if (!root.classes.has(requirement.rootClass)) {
      errors.push(`navigation: ${describe(root)} must include .${requirement.rootClass}.`);
    }

    const lists = nodes.filter((node, index) =>
      node.tag === 'ul' && isDescendantOf(nodes, index, rootIndex)
    );
    if (!lists.some((node) => node.classes.has(requirement.listClass))) {
      errors.push(`navigation: ${describe(root)} must contain <ul class="${requirement.listClass}">.`);
    }

    for (const node of nodes.filter((candidate, index) =>
      candidate.tag === 'a' && isDescendantOf(nodes, index, rootIndex)
    )) {
      if (!node.classes.has(requirement.linkClass)) {
        errors.push(`navigation: ${describe(node)} must include .${requirement.linkClass}.`);
      }
      if (node.attributes.get('aria-current') === 'page' && !node.classes.has(requirement.activeClass)) {
        errors.push(`navigation: ${describe(node)} with aria-current="page" must include .${requirement.activeClass}.`);
      }
      if (node.classes.has(requirement.activeClass) && node.attributes.get('aria-current') !== 'page') {
        errors.push(`navigation: active ${describe(node)} must set aria-current="page".`);
      }
    }
  }
}

function validateNativeRoot(nodes, errors, component) {
  const requirement = componentRequirements[component];
  const roots = nodes.filter((node) => node.tag === requirement.rootTag);
  if (roots.length === 0) {
    errors.push(`${component}: expected a <${requirement.rootTag}> root.`);
    return;
  }

  for (const node of roots) {
    if (!node.classes.has(requirement.rootClass)) {
      errors.push(`${component}: ${describe(node)} must include .${requirement.rootClass}.`);
    }
  }
}

function validateDivider(nodes, errors) {
  validateNativeRoot(nodes, errors, 'divider');
  for (const node of nodes.filter((candidate) => candidate.classes.has(componentRequirements.divider.verticalClass))) {
    if (node.tag !== 'hr') {
      errors.push(`divider: .pd-divider--vertical must be on <hr>, found ${describe(node)}.`);
    }
    if (node.attributes.get('aria-orientation') !== 'vertical') {
      errors.push('divider: .pd-divider--vertical must set aria-orientation="vertical".');
    }
  }
}

function validateFlexibleRoot(nodes, errors, component) {
  const requirement = componentRequirements[component];
  const roots = nodes.filter((node) => node.classes.has(requirement.rootClass));
  if (roots.length === 0) {
    errors.push(`${component}: expected an element with .${requirement.rootClass}.`);
  }

  for (const node of roots) {
    if (!requirement.allowedTags.includes(node.tag)) {
      errors.push(`${component}: .${requirement.rootClass} must be on ${requirement.allowedTags.map((tag) => `<${tag}>`).join(', ')}, found ${describe(node)}.`);
    }
  }

  for (const node of nodes.filter((candidate) => candidate.classes.has(requirement.interactiveClass))) {
    if (!requirement.interactiveTags.includes(node.tag)) {
      errors.push(`${component}: .${requirement.interactiveClass} must be on ${requirement.interactiveTags.map((tag) => `<${tag}>`).join(' or ')}, found ${describe(node)}.`);
    }
  }
}

function validateInput(nodes, errors) {
  validateNativeRoot(nodes, errors, 'input');
  for (const node of nodes.filter((candidate) => candidate.classes.has('pd-input--error'))) {
    if (node.attributes.get('aria-invalid') !== 'true') {
      errors.push('input: .pd-input--error must set aria-invalid="true".');
    }
  }
}

export function createComponentContractValidator(knownComponentClasses) {
  const knownClasses = new Set(knownComponentClasses);

  return function validateComponentHtml(html, { components = [] } = {}) {
    const nodes = parseHtml(html);
    const errors = [];

    for (const node of nodes) {
      for (const className of node.classes) {
        if (className.startsWith('pd-') && !knownClasses.has(className)) {
          errors.push(`${describe(node)} uses unknown Palladio class .${className}.`);
        }
      }
    }

    for (const component of components) {
      if (!Object.hasOwn(componentRequirements, component)) {
        errors.push(`Unknown Palladio component "${component}".`);
        continue;
      }

      if (component === 'navigation') validateNavigation(nodes, errors);
      if (component === 'button') validateNativeRoot(nodes, errors, component);
      if (component === 'input') validateInput(nodes, errors);
      if (component === 'divider') validateDivider(nodes, errors);
      if (component === 'badge' || component === 'card') validateFlexibleRoot(nodes, errors, component);
    }

    return errors;
  };
}

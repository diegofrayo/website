---
name: react-guidelines
description: Enforces React coding conventions for diegofrayo's project. Use this skill whenever writing, editing, or reviewing any React component (.tsx/.jsx files). Triggers on requests like "create a component", "add a React component", "write a new component", "update this component", "refactor this React code", or any task involving React/TSX/JSX files. Apply these guidelines proactively — don't wait to be asked.
---

## Guidelines

A React component should follow this structure and conventions:

```tsx
import { useState, useRef, useEffect } from "react";
import cn from "@diegofrayo-pkg/cn";
import {
  Box,
  Button,
  Icon,
  IconCatalog,
  Image,
  InlineText,
  Link,
  Text,
  Title,
} from "~/components/primitive";

// Use `type`, not `interface`
type MyComponentProps = {
  // Required props — alphabetical order
  lang: Lang;
  viewMode: ViewMode;

  // Optional props — alphabetical order
  optionalProp?: string;

  // Event handlers — at the end
  onLangChange: (lang: Lang) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
};

function MyComponent({ viewMode, lang, onViewModeChange, onLangChange }: MyComponentProps) {
  // --- HOOKS ---
  const [myVar] = useCustomHook();

  // --- STATES & REFS ---
  const [myState, setMyState] = useState("");
  const myRef = useRef<HTMLDivElement>(null);

  // --- COMPUTED STATES ---
  const currentData = myState + " 2 ";

  // --- STYLES ---
  const classes = {
    radioGroup: cn("flex gap-5 py-1"),
    radioItem: cn("flex cursor-pointer items-center gap-1"),
  };

  // --- HANDLERS ---
  function handleDownloadClick() {
    // ...
  }

  // --- UTILS ---
  function downloadAll() {
    // ...
  }

  // --- EFFECTS ---
  useEffect(function namedEffect() {
    // ...
  }, []);

  return (
    <Box className="flex justify-center">
      my content
    </Box>
  );
}
```

- Include section comments like `// --- EFFECTS ---` and follow their order strictly
- Omit sections that have no content — never leave an empty section
- Use `cn` from `@diegofrayo-pkg/cn` for class name composition
- Use primitive components from `~/components/primitive` instead of raw HTML elements. If a needed primitive is missing, flag it but use the raw element as fallback.
- Use `type` instead of `interface` for props definitions
- Handlers must start with `handle` and end with the event type: `handleDownloadClick`, `handleNameChange`
- Always name the `useEffect` callback function: `useEffect(function myEffectName() { ... }, [])`
- Detect repeated class strings across the component and extract them into the `classes` object under `// --- STYLES ---`
- Never use `cn(...)` directly inside a `className` prop — always define the value in `classes` and reference it: `className={classes.foo}`
- Never pass inline functions as props (e.g. `onClick={() => doSomething()}`); always define them as named functions in `// --- HANDLERS ---` or `// --- UTILS ---` and reference them by name
- If the JSX contains a ternary that renders two different elements (e.g. `flag ? <A /> : <B />`), extract it into its own component. Short-circuit expressions (`flag && <A />`) do not need extraction
- Utility functions rule — if a helper function doesn't close over component state or refs, define it as a pure function outside the component (like the buildWhatsAppUrl style utils at the bottom of the file). If it does need component-scoped data, place it inside under // --- UTILS ---.
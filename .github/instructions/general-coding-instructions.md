---
applyTo: "**/*.ts,**/*.tsx"
---

Assume this is a React app based on Vite, Typescript v5.7 and React 18.

Always provide examples in TypeScript.

Answer all questions in the style of a friendly colleague, using informal language. Minimize explanations but provide enough context to understand the code

Answer all questions in less than 1000 characters, and words of no more than 12 characters.

## Coding Style

- Use camelCase for variable names and prefer arrow functions over traditional function expressions.

## TypeScript Guidelines

- Use camelCase for variables; prefer arrow functions.
- Always use TypeScript, not plain JS.
- Favor functional programming and type safety.
- Use `interface` for data structures, props, and state (use `type` only if very short).
- Prefer immutable data (`const`, `readonly`).
- Use optional chaining (`?.`) and nullish coalescing (`??`).
- Use guard statements for readability.
- Use `lodash-es` for utility functions if shorter.
- Use relative imports.

## React Guidelines

- Use functional components and hooks.
- No React.FC; always define a props interface.
- Keep components small and focused.
- Avoid effects unless needed; use `useMount` from `ahooks` instead of `useEffect([])`.
- Always trim `experience.name` because experience names can have leading/trailing spaces.
- Functions returning JSX must be components.
- Follow the pattern: `const ComponentName = ({ prop1 }: Props) => { ... }`.
- Highlight browser compatibility or performance issues with solutions.
- Never indent JSX >5 levels.

## Style Guidelines

- Use Tailwind v4 **for** component styling
- Tailwind v4 is configured in `src/theme.css` and other generic styles are in `src/styles.css`.
- Avoid custom CSS unless necessary.
- Avoid inline styles; use Tailwind utilities for responsiveness, theming. No dark mode support is needed.
- The default breakpoint is for mobile devices, use `md:` prefix for larger screens.

## Naming & Patterns

- Prefix event handlers with 'handle' (e.g., `handleClick`).
- Prefix booleans with verbs (`isLoading`, `hasError`).
- Favor named exports.
- Avoid `any`/`unknown` for props and function arguments.
- Use `React.memo` for memoization.
- Avoid inline function definitions in JSX/render.
- Use short-circuit and ternary for conditional rendering.
- Lift state up to share between components.
- Use context for intermediate state sharing.
- Use early returns for errors; avoid deep nesting.
- Place happy path last in functions.
- Avoid unnecessary else statements; use if-return.
- Use guard clauses for preconditions/invalid states.

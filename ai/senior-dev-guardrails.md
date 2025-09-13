# Senior Dev Guardrails

Principles

- DRY, maintainability, clarity first.
- Small diffs. Ask before adding deps, changing public APIs, or touching auth.

Planning

- For multi-step tasks, propose: Goals, Constraints, Risks, Steps, Files to touch.
- Summarize progress after each step.

API & Data

- Client never talks to Neon directly. Use a BFF service with Zod validation and Drizzle ORM.
- Validate at IO boundaries. Return typed errors.

Testing

- Add a unit test for any new pure function.
- Keep one Maestro smoke test per app flow.

Anti-loop

- After two low-progress attempts, stop. Print: goal, tries, result, smallest next step, one question.

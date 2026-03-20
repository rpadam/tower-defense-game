# How To Hand This To Codex Agents

## Basic Workflow

1. Give each agent exactly one task from [`AGENT_TASKS.md`](AGENT_TASKS.md).
2. Tell the agent to read:
   - [`REWRITE_PLAN.md`](REWRITE_PLAN.md)
   - [`AGENT_TASKS.md`](AGENT_TASKS.md)
   - [`progress.md`](progress.md)
3. Tell the agent not to work outside its task boundary.
4. Require the agent to run `npm run build`.
5. Require the agent to append a short note to [`progress.md`](progress.md) before finishing.

## Good Prompt Template

Use this template when starting a Codex agent:

```text
Work only in /Users/raphaeladam/development/tower-defense-game.

Read these files first:
- /Users/raphaeladam/development/tower-defense-game/REWRITE_PLAN.md
- /Users/raphaeladam/development/tower-defense-game/AGENT_TASKS.md
- /Users/raphaeladam/development/tower-defense-game/progress.md

Do only this task:
[PASTE TASK BLOCK HERE]

Constraints:
- Stay within the task scope
- Do not rewrite unrelated files
- Run npm run build before finishing
- Update /Users/raphaeladam/development/tower-defense-game/progress.md with what you changed, blockers, and next steps
- In your final response, summarize changed files, verification, and any blockers
```

## How To Sequence Agents

Use this order:

1. `UI-01`
2. `DATA-01`
3. `MAP-01`
4. `COMBAT-01`
5. `COMBAT-02`
6. `UI-02`
7. `QA-01`
8. `POLISH-01`

Reason:

- UI shell and data boundaries need to exist early
- Map and enemy systems should land before tower combat
- Upgrade UI depends on stable towers and state
- QA hooks should be revalidated after major systems land
- Polish should happen after the game loop works

## How To Avoid Agent Collisions

- Do not assign two agents overlapping files at the same time
- Prefer one finished task at a time unless file boundaries are fully separate
- If two tasks must run in parallel, only pair tasks whose file lists do not overlap
- Default mode is sequential. Do not run in parallel unless user consent is explicit.

Safe parallel pair examples:

- `UI-01` with `DATA-01`
- `MAP-01` with partial art/CSS polish only if file boundaries are explicit

Bad parallel pair examples:

- `COMBAT-01` with `COMBAT-02`
- `UI-02` with any task editing `reducers.js`

## Parallel Consent Snippet

Use this exact line before starting any parallel run:

```text
I can run `UI-01` and `DATA-01` in parallel because their file scopes are separated. Do you explicitly want parallel execution, or should I stay sequential (default)?
```

If the user does not explicitly approve parallel, stay sequential.

## What To Review In Agent Output

Check these first:

- Did the agent stay inside task scope?
- Did it update `progress.md`?
- Did it run `npm run build`?
- Did it mention blockers honestly?
- Did it record completion metadata (`model used`, token usage if available)?

Reject and rerun if:

- The agent rewrote unrelated systems
- The agent skipped verification
- The agent left the project in a non-building state
- The agent ignored the file boundaries
- The completion metadata is missing or ambiguous

## Optional Branch Workflow

Safer option:

- Put each agent on its own branch
- Review branch diff before merging

Example:

```bash
cd /Users/raphaeladam/development/tower-defense-game
git checkout -b task/ui-01-shell
```

Then hand that branch to the agent.

## Recommended First Prompt

Start with `UI-01`.

It gives the project an immediate visual upgrade and creates the shell the other tasks can plug into.

# How I built this with AI agents

_Edit this file in your own words before submitting. Keep it honest: judgment matters more than volume._

## Workflow

1. Studied the role and Parentune's product thesis, and picked a project that mirrors it (triage in minutes).
2. Wrote a spec first: stack, layers, safety rules.
3. Had the agent scaffold the backend with clean architecture, then reviewed each layer myself.
4. Built the UI mobile-first, tested every flow in the browser, and fed real error output back to the agent.
5. Added tests, rate limiting, privacy fixes and docs last.

## Key prompts

- _Paste your first spec / scaffold prompt here._
- _Paste the triage system prompt design discussion here._
- _Paste a debugging prompt that worked well here._

## Where the agent got it wrong (and what I did)

| Problem | What happened | My fix |
|---|---|---|
| Retired model name | The suggested Gemini model returned a 404 | Listed the models my key can actually use via the API and switched to a current one. Model name is now an env variable. |
| Dev server restarts mid-request | `node --watch` watched `node_modules`, restarted during a request and dropped the connection | Narrowed the watcher to `src` only. |
| Privacy hole | The scaffold shipped a public `/history` endpoint that would expose every parent's concern | Removed it. Analytics return aggregates only. |
| Confusing client errors | Browser showed a raw JSON parse error when the server failed | Client now reads the response safely and shows a clear message. |
| Free-tier limits | Rate limits are low and unpublished | Added server rate limiting and a friendly 429 message. |

## What I decided myself

- Emergency keywords bypass the LLM entirely.
- LLM output is never trusted: parse defensively, then validate with a schema.
- Parent text is treated as untrusted input to the prompt.
- Analytics never expose raw concerns.

## What I'd do next

- Evaluation set reviewed by a pediatrician, run on every prompt change.
- Feedback buttons to measure real helpfulness.
- Retrieval over verified Parentune content.

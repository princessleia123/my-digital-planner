# My Digital Planner notes

## OpenAI models available from the project key

The models list returned two names containing “luna”:

- `gpt-5.6-luna`
- `gpt-6-luna`

## Version 1

- Selected model: `gpt-6-luna`.
- Saves on this computer only for now (browser localStorage; no real student data).
- Start the project with: `python3 server.py`
- Done: saved the project brief in `BRIEF.md`; Version 1 includes adding assignments, recording available study times, marking a task missed, and asking the AI for a short rescheduled plan.
- Done: the local AI server reads the key from `.env`, sends `BRIEF.md` as the AI instructions, and keeps the key off the page.
- Done: tested the main flow with made-up assignments; a missed math task was rescheduled and a history task was planned.
- Done: added a simple upcoming schedule that shows the next study time, task, and due date.
- Preview: `http://127.0.0.1:8000`
- After each save point, push it to GitHub.
- The AI connects through `getKey()`.

## Maybe Later

- Import assignments from Google Classroom or another school system.
- Add parent/teacher sharing only with clear permission.
- Add sign-in and a real database after privacy and school approval.
- Add calendar export, notifications, and a mobile-friendly installable version.

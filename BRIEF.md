# Project brief: My Digital Planner

## The competition

- I’m entering the Presidential SI Challenge (Standard Track), a national K–12 competition. My age group: Middle school (grades 6–8)
- Judges score only a written entry (a PDF of up to 10 pages) and a video of up to 4 minutes. They reward a clear understanding of the problem and a sensible use of AI.
- My deadlines: To remind your teacher to enter you on December 18, and submitting your project by December 23

## The problem

- People in my school sometimes do not have enough time to do homework or projects or studying for tests.
- Impact area: School and learning
- Why it matters (impact): students can catch up with work and not miss any assignments.
- Evidence it’s real: Many students do not plan ahead for assignments.

In an MIT study, only about one-third of students said they looked at assignments early to estimate how much time they would need. Fewer than half said they broke difficult assignments into smaller steps. https://tll.mit.edu/mit-learning-strategies-assessment/

- What people told me: Person A: I usually don't study for my tests because I forget I have the tests.
- Person B: I get a 0 on my homework because I do not do my homework because I forget.

## My solution

- My AI’s job: My AI helps by reminding and logging students assignments, which works better than "keeping it in your brain" because usually students will forget what they have.
- Tools that already exist, and how mine is different: My study life. It tracks classes, homework, exams, calendars, and reminders. Basic planner is free forever. A paid MSL+ version adds more features. The free version allows up to 5 homework or revision tasks at a time. Students usually still have to enter assignments themselves. Mine is special because you can enter in your schedule and when you do that homework and if you miss it the ai will reschedule it to another avalible time

## Safety plan

Physical safety: The AI creates an unhealthy schedule. It might tell someone to work all night, skip meals, or skip needed sleep. Add rules that protect sleep, breaks, meals, and personal responsibilities. Never tell students to stay up all night. Add: “If your workload feels unsafe or overwhelming, talk to a trusted adult.”

Physical safety: Someone asks for harmful advice. A user might ask about self-harm, violence, drugs, or another dangerous topic. The AI should refuse dangerous instructions and guide the user to a trusted adult or emergency help. In the U.S., display 988 Lifeline for a mental-health crisis and 911 for immediate danger.

Emotional safety: The AI sounds mean or helps bullying. A student might ask it to insult, embarrass, or expose another student. Make the AI use kind language. It should not create insults, rumors, or embarrassing messages. It should say, “I can help you solve the school problem, but I cannot help bully someone.”

Wrong answer: The AI gives the wrong due date or bad plan. A student could miss an assignment because they trusted the AI. The AI should never silently guess. It should say, “I am not sure—please confirm the date,” show where the information came from, and let the student edit or delete it.

Data security: Private student information could be seen by the wrong person. Students may type names, classes, schedules, assignments, messages, or personal worries. Collect only what is needed. Keep student data private, do not sell it or use it for advertising, and allow only the student—and an approved adult if needed—to see it. Start with fake data during testing.

Children’s privacy: Some users may be under 13. Their names, voices, photos, or other information may be protected by children’s privacy rules. Ask for adult or school approval before collecting personal information from children. Provide a clear privacy notice, allow parents to review or delete data, and delete information when it is no longer needed.

## My AI’s instructions

- When it answers: The user asks a question or comment and it will answer
- Its job: To help students plan their assignments in school
- Who it talks to and how to sound: Students who want to plan their day for assignments in school. It should sound friendly and helpful
- Facts it must use: What the student tells them (what their schedule is and their assignments)
- Rules it must follow: Do not guess if the student says something vague
- How to answer: They should ask all the details about the assignment and it should not be too long.

## Version 1 boundary

Build the smallest version that lets one student use the AI part once, from start to finish. Make the difference from existing tools easy to see, follow the safety plan from the start, and make sure the main job can be shown clearly in a short video. Leave everything else out for now, and write extra ideas under “Maybe Later” in NOTES.md.

Use browser localStorage for now, with made-up sample items and no real people. Keep all saving in one small file so we can switch to a real database later.

Connect the real AI from the start using the OpenAI API. The key is in .env, and the model to use is written in NOTES.md. Add a small server part that runs on the computer and passes messages to the AI, so the key stays on the server and is never sent to the page. Read the key only from .env, never print it, never ask for it in chat, and keep .env in .gitignore.

Ask the AI only at the moment described in “When it answers,” and send these instructions from BRIEF.md with every message as the AI’s system instructions. Keep the part that asks the AI in one small, clearly named file. While it’s waiting, show “Thinking…” and turn off the button so it can’t be pressed twice. If the AI can’t answer (an expired key or no internet), show a friendly message that says to check the key.

Write in NOTES.md the one command that starts the project, then tell the student that command.

const planner = PlannerStorage.load();
const assignmentList = document.querySelector("#assignment-list");
const assignmentForm = document.querySelector("#assignment-form");
const availabilityInput = document.querySelector("#availability");
const questionInput = document.querySelector("#question");
const planButton = document.querySelector("#plan-button");
const aiStatus = document.querySelector("#ai-status");
const aiOutput = document.querySelector("#ai-output");

availabilityInput.value = planner.availability;
document.querySelector("#due-date").value = new Date().toISOString().slice(0, 10);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dateLabel(value) {
  if (!value) return "No date yet";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value + "T12:00:00"));
}

function save() {
  planner.availability = availabilityInput.value;
  PlannerStorage.save(planner);
}

function renderAssignments() {
  if (!planner.assignments.length) {
    assignmentList.innerHTML = '<div class="empty-state">No assignments yet. Add one below.</div>';
    return;
  }

  assignmentList.innerHTML = planner.assignments.map((assignment) => {
    const missed = assignment.status === "missed";
    const done = assignment.status === "done";
    return `
      <article class="assignment ${missed ? "missed" : ""} ${done ? "done" : ""}">
        <div class="assignment-main">
          <div class="subject-dot">${escapeHtml((assignment.subject || "?").slice(0, 1).toUpperCase())}</div>
          <div>
            <h3>${escapeHtml(assignment.title)}</h3>
            <p>${escapeHtml(assignment.subject)} · due ${escapeHtml(dateLabel(assignment.dueDate))} · ${escapeHtml(assignment.minutes)} min</p>
            ${missed ? '<span class="missed-note">Missed — AI will move it to another time.</span>' : ""}
          </div>
        </div>
        <button class="small-button" data-action="toggle" data-id="${escapeHtml(assignment.id)}" type="button">${missed ? "Unmark missed" : done ? "Mark open" : "Mark missed"}</button>
      </article>`;
  }).join("");
}

assignmentList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const assignment = planner.assignments.find((item) => item.id === button.dataset.id);
  if (!assignment) return;
  if (assignment.status === "missed") assignment.status = "open";
  else if (assignment.status === "open") assignment.status = "missed";
  else assignment.status = "open";
  save();
  renderAssignments();
});

assignmentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#title").value.trim();
  const subject = document.querySelector("#subject").value.trim();
  const dueDate = document.querySelector("#due-date").value;
  const minutes = Number(document.querySelector("#minutes").value);
  if (!title || !subject || !dueDate || !minutes) return;

  planner.assignments.unshift({
    id: "assignment-" + Date.now(),
    title,
    subject,
    dueDate,
    minutes,
    status: "open"
  });
  save();
  renderAssignments();
  assignmentForm.reset();
  document.querySelector("#due-date").value = new Date().toISOString().slice(0, 10);
  document.querySelector("#minutes").value = 30;
});

availabilityInput.addEventListener("input", save);

planButton.addEventListener("click", async () => {
  save();
  planButton.disabled = true;
  planButton.innerHTML = "Thinking… <span>⏳</span>";
  aiStatus.textContent = "The planner is checking your assignments and available times.";
  aiOutput.classList.add("waiting");
  aiOutput.textContent = "Thinking…";

  try {
    const response = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: questionInput.value,
        assignments: planner.assignments,
        availability: planner.availability
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Planner unavailable");
    aiOutput.classList.remove("waiting");
    aiOutput.textContent = result.answer;
    aiStatus.textContent = "Plan ready.";
  } catch (error) {
    aiOutput.classList.remove("waiting");
    aiOutput.textContent = "I couldn't reach the AI. Please check the key and internet connection, then try again.";
    aiStatus.textContent = "The plan was not created.";
  } finally {
    planButton.disabled = false;
    planButton.innerHTML = "Plan my next steps <span>→</span>";
  }
});

renderAssignments();

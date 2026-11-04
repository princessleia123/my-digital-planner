(function () {
  const STORAGE_KEY = "my-digital-planner-v1";

  function dateOffset(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function starterData() {
    return {
      assignments: [
        {
          id: "sample-history",
          title: "History project outline",
          subject: "History",
          dueDate: dateOffset(3),
          minutes: 45,
          status: "open"
        },
        {
          id: "sample-math",
          title: "Math practice problems",
          subject: "Math",
          dueDate: dateOffset(1),
          minutes: 30,
          status: "missed"
        },
        {
          id: "sample-science",
          title: "Review science test notes",
          subject: "Science",
          dueDate: dateOffset(4),
          minutes: 25,
          status: "open"
        }
      ],
      availability: "Today: 4:00–4:45 PM\nTomorrow: 6:00–7:00 PM\nThursday: 4:00–5:00 PM"
    };
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.assignments)) {
        return {
          assignments: saved.assignments,
          availability: saved.availability || ""
        };
      }
    } catch (error) {
      // Start with the sample plan if browser storage is unavailable or damaged.
    }
    return starterData();
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      assignments: data.assignments,
      availability: data.availability
    }));
  }

  window.PlannerStorage = { load, save };
})();

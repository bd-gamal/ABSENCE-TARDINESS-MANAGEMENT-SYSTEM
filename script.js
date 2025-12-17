document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") html.classList.add("dark");

  themeBtn.addEventListener("click", () => {
    html.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      html.classList.contains("dark") ? "dark" : "light"
    );
  });

  const rows = document.querySelectorAll(".student-row");

  const updateRowUI = (row, isLate) => {
    const timeInput = row.querySelector(".time-input");
    const motifInput = row.querySelector(".motif-input");

    if (isLate) {
      timeInput.disabled = false;
      motifInput.disabled = false;
      timeInput.classList.remove(
        "input-disabled",
        "bg-gray-100",
        "dark:bg-gray-700"
      );
      timeInput.classList.add("input-enabled", "bg-white", "dark:bg-gray-800");
      motifInput.classList.remove(
        "input-disabled",
        "bg-gray-100",
        "dark:bg-gray-700"
      );
      motifInput.classList.add("input-enabled", "bg-white", "dark:bg-gray-800");
    } else {
      timeInput.disabled = true;
      motifInput.disabled = true;
      timeInput.classList.add(
        "input-disabled",
        "bg-gray-100",
        "dark:bg-gray-700"
      );
      timeInput.classList.remove(
        "input-enabled",
        "bg-white",
        "dark:bg-gray-800"
      );
      motifInput.classList.add(
        "input-disabled",
        "bg-gray-100",
        "dark:bg-gray-700"
      );
      motifInput.classList.remove(
        "input-enabled",
        "bg-white",
        "dark:bg-gray-800"
      );
    }
  };

  rows.forEach((row) => {
    const radios = row.querySelectorAll(".status-radio");
    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        const isLate = radio.value === "late";
        if (!isLate) {
          row.querySelector(".time-input").value = "";
          row.querySelector(".motif-input").value = "";
        }
        updateRowUI(row, isLate);
      });
    });
  });
});

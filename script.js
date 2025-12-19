document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("mobileMenuBtn");
  const overlay = document.getElementById("sidebarOverlay");
  const html = document.documentElement;
  const themeBtn = document.getElementById("darkModeBtn");
  const dateInput = document.getElementById("dateInput");
  const rows = document.querySelectorAll(".student-row");

  function toggleMenu() {
    if (sidebar && overlay) {
      sidebar.classList.toggle("-translate-x-full");
      overlay.classList.toggle("hidden");
    }
  }

  if (menuBtn) menuBtn.addEventListener("click", toggleMenu);
  if (overlay) overlay.addEventListener("click", toggleMenu);

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    html.classList.add("dark");
    updateButtonText(true);
  }

  function updateButtonText(isDark) {
    if (themeBtn) {
      const icon = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
      const text = isDark ? "Light Mode" : "Dark Mode";
      themeBtn.innerHTML = `${icon} ${text}`;
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      html.classList.toggle("dark");
      const isDark = html.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      updateButtonText(isDark);
    });
  }

  const updateRowUI = (row, status) => {
    const timeInput = row.querySelector(".time-input");
    const motifInput = row.querySelector(".motif-input");

    if (status === "late") {
      timeInput.disabled = false;
      motifInput.disabled = false;
      timeInput.classList.remove("input-disabled");
      timeInput.classList.add("input-enabled");
      motifInput.classList.remove("input-disabled");
      motifInput.classList.add("input-enabled");
    } else {
      timeInput.disabled = true;
      motifInput.disabled = true;
      timeInput.classList.remove("input-enabled");
      timeInput.classList.add("input-disabled");
      motifInput.classList.remove("input-enabled");
      motifInput.classList.add("input-disabled");
    }
  };

  function saveData() {
    if (dateInput) {
      localStorage.setItem("attendanceDate", dateInput.value);
    }

    const data = [];
    rows.forEach((row) => {
      const id = row.getAttribute("data-id");
      const checkedRadio = row.querySelector('input[type="radio"]:checked');
      const status = checkedRadio ? checkedRadio.value : null;
      const time = row.querySelector(".time-input").value;
      const motif = row.querySelector(".motif-input").value;

      data.push({ id, status, time, motif });
    });

    localStorage.setItem("attendanceData", JSON.stringify(data));
  }

  function loadData() {
    // Charger la date
    const savedDate = localStorage.getItem("attendanceDate");
    if (savedDate && dateInput) {
      dateInput.value = savedDate;
    }

    // Charger les présences
    const savedData = localStorage.getItem("attendanceData");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (!Array.isArray(data)) return;

        rows.forEach((row) => {
          const id = row.getAttribute("data-id");
          const item = data.find((d) => d.id === id);

          if (item) {
            if (item.status) {
              const radio = row.querySelector(`input[value="${item.status}"]`);
              if (radio) {
                radio.checked = true;
                updateRowUI(row, item.status);
              }
            }
            row.querySelector(".time-input").value = item.time || "";
            row.querySelector(".motif-input").value = item.motif || "";
          }
        });
      } catch (e) {
        console.error("Erreur LocalStorage:", e);
      }
    }
  }

  loadData();

  if (dateInput) {
    dateInput.addEventListener("change", saveData);
  }

  rows.forEach((row) => {
    const radios = row.querySelectorAll('input[type="radio"]');
    const inputs = row.querySelectorAll(
      'input[type="text"], input[type="time"]'
    );

    radios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        updateRowUI(row, e.target.value);
        saveData();
      });
    });

    inputs.forEach((input) => {
      input.addEventListener("input", saveData);
    });
  });
});

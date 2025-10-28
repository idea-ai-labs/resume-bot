// ------------------------------
// Resume Main Logic
// ------------------------------

// Auto-save interval (ms)
const AUTO_SAVE_INTERVAL = 2000;
let autoSaveTimer = null;

// ------------------ DOMContentLoaded ------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("NextGen Resume Lab loaded");

  // ------------------ Load resume data ------------------
  let resumeData = defaultResumeData; // fallback
  const savedData = localStorage.getItem("hexResumeData");
  if (savedData) {
    try {
      resumeData = JSON.parse(savedData);
      console.log("Loaded resume from localStorage");
    } catch (e) {
      console.error("Failed to parse saved resume data:", e);
    }
  } else {
    console.log("No saved data found, using defaultResumeData");
  }

  renderResume(resumeData);

  // ------------------ Section collapse ------------------
  document.querySelectorAll(".section-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".section");
      const content = section.querySelector(".cards, .add-btn");
      if (!content) return;
      const isCollapsed = content.style.display === "none";
      content.style.display = isCollapsed ? "block" : "none";
      btn.textContent = isCollapsed ? "-" : "+";
    });
  });

  // ------------------ Hook up Add Buttons ------------------
  document.getElementById("add-education-btn")?.addEventListener("click", () => addEducationCard());
  document.getElementById("add-experience-btn")?.addEventListener("click", () => addExperienceCard());
  document.getElementById("add-project-btn")?.addEventListener("click", () => addProjectCard());
  document.getElementById("add-skill-btn")?.addEventListener("click", () => addSkillCard());

  // ------------------ Auto-save on input changes ------------------
  ["name", "email", "phone", "website"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => saveToLocalStorage());
  });

  // Start auto-save for card edits
  startAutoSave();

  // ------------------ Generate PDF ------------------
  document.getElementById("generate-btn")?.addEventListener("click", async () => {
    const resumeData = collectResumeData();

    // Show spinner overlay
    const spinner = document.createElement("div");
    spinner.id = "spinner-overlay";
    spinner.innerHTML = `
      <div class="spinner-container">
        <div class="spinner"></div>
        <p>Generating PDF...</p>
      </div>`;
    document.body.appendChild(spinner);

    try {
      const API_URL = "https://idea-ai-resumelatex.hf.space/api/generate";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData)
      });

      if (!response.ok) {
        const errText = await response.text();
        alert("❌ Error generating PDF:\n" + errText);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("⚠️ Failed to connect to backend.\n" + error.message);
    } finally {
      document.getElementById("spinner-overlay")?.remove();
    }
  });
});

// ------------------ Auto-save Logic ------------------
function saveToLocalStorage() {
  const data = collectResumeData();
  localStorage.setItem("hexResumeData", JSON.stringify(data));
  console.log("Auto-saved resume data");
}

function startAutoSave() {
  if (autoSaveTimer) clearInterval(autoSaveTimer);
  autoSaveTimer = setInterval(saveToLocalStorage, AUTO_SAVE_INTERVAL);
}

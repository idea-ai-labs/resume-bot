// resume-main.js
// Entry point – initializes resume builder and event wiring with debug logs

window.addEventListener("DOMContentLoaded", () => {
  debugLog("✅ NextGen Resume Lab loaded");

  // --- Diagnostic: check what’s available ---
  debugLog("defaultResumeData exists?", typeof defaultResumeData !== "undefined");
  debugLog("renderResume exists?", typeof renderResume !== "undefined");
  debugLog("collectResumeData exists?", typeof collectResumeData !== "undefined");
  debugLog("saveToLocalStorage exists?", typeof saveToLocalStorage !== "undefined");
  debugLog("loadFromLocalStorage exists?", typeof loadFromLocalStorage !== "undefined");

  debugLog("localStorage keys:", Object.keys(localStorage));
  debugLog("resumeData raw (from localStorage):", localStorage.getItem("resumeData"));

  // ------------------ Load from localStorage ------------------
  let resumeData = loadFromLocalStorage();
  if (!resumeData) {
    debugLog("⚠️ No saved data found, using defaultResumeData");
    resumeData = defaultResumeData;
  } else {
    debugLog("✅ Loaded data from localStorage successfully");
  }

  // ------------------ Render Resume ------------------
  try {
    renderResume(resumeData);
    debugLog("✅ renderResume executed");
  } catch (err) {
    debugLog("❌ renderResume failed:", err);
  }

  // ------------------ Hook up Add Buttons ------------------
  const addEduBtn = document.getElementById("add-education-btn");
  const addExpBtn = document.getElementById("add-experience-btn");
  const addProjBtn = document.getElementById("add-project-btn");
  const addSkillBtn = document.getElementById("add-skill-btn");

  if (addEduBtn) {
    addEduBtn.onclick = () => {
      debugLog("➕ Adding Education Card");
      addEducationCard({});
      saveToLocalStorage();
    };
  }
  if (addExpBtn) {
    addExpBtn.onclick = () => {
      debugLog("➕ Adding Experience Card");
      addExperienceCard({});
      saveToLocalStorage();
    };
  }
  if (addProjBtn) {
    addProjBtn.onclick = () => {
      debugLog("➕ Adding Project Card");
      addProjectCard({});
      saveToLocalStorage();
    };
  }
  if (addSkillBtn) {
    addSkillBtn.onclick = () => {
      debugLog("➕ Adding Skill Card");
      addSkillCard({});
      saveToLocalStorage();
    };
  }

  // ------------------ Generate PDF ------------------
  const generateBtn = document.getElementById("generate-btn");
  if (generateBtn) {
    generateBtn.onclick = async () => {
      const resumeData = collectResumeData();
      debugLog("🧾 Generating PDF with data:", resumeData);

      const API_URL = "https://idea-ai-resumelatex.hf.space/api/generate";

      const spinner = document.createElement("div");
      spinner.id = "spinner-overlay";
      spinner.innerHTML = `
        <div class="spinner-container">
          <div class="spinner"></div>
          <p>Generating PDF...</p>
        </div>`;
      document.body.appendChild(spinner);

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resumeData)
        });

        if (!response.ok) {
          const errText = await response.text();
          alert("❌ Error generating PDF:\n" + errText);
          debugLog("❌ PDF generation failed:", errText);
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
        debugLog("✅ PDF generated successfully");
      } catch (error) {
        debugLog("⚠️ Failed to connect to backend:", error);
        alert("⚠️ Failed to connect to backend.\n" + error.message);
      } finally {
        document.getElementById("spinner-overlay")?.remove();
      }
    };
  }

  // ------------------ Auto-save on input changes ------------------
  ["name", "email", "phone", "website"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => {
        saveToLocalStorage();
        debugLog(`💾 Auto-saved change in ${id}`);
      });
    }
  });

  debugLog("✅ Initialization complete");
});

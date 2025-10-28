 // resume-main.js
window.addEventListener("DOMContentLoaded", () => {
  console.log("NextGen Resume Lab loaded");

  // ------------------ Load from localStorage ------------------
  let resumeData = loadFromLocalStorage();
  if (!resumeData) {
    console.log("No saved data found, using defaultResumeData");
    resumeData = defaultResumeData;
  }

  // ------------------ Render resume ------------------
  renderResume(resumeData);

  // ------------------ Initialize collapsible sections ------------------
  initSectionCollapsibles();

  // ------------------ Hook up Add Buttons ------------------
  const addEduBtn = document.getElementById("add-education-btn");
  const addExpBtn = document.getElementById("add-experience-btn");
  const addProjBtn = document.getElementById("add-project-btn");
  const addSkillBtn = document.getElementById("add-skill-btn");

  if (addEduBtn) addEduBtn.onclick = () => { addEducationCard({}); saveToLocalStorage(); initSectionCollapsibles(); };
  if (addExpBtn) addExpBtn.onclick = () => { addExperienceCard({}); saveToLocalStorage(); initSectionCollapsibles(); };
  if (addProjBtn) addProjBtn.onclick = () => { addProjectCard({}); saveToLocalStorage(); initSectionCollapsibles(); };
  if (addSkillBtn) addSkillBtn.onclick = () => { addSkillCard({}); saveToLocalStorage(); initSectionCollapsibles(); };

  // ------------------ Generate PDF ------------------
  const generateBtn = document.getElementById("generate-btn");
  if (generateBtn) {
    generateBtn.onclick = async () => {
      const resumeData = collectResumeData();
      console.log("Generating PDF with data:", resumeData);

      const API_URL = "https://idea-ai-resumelatex.hf.space/api/generate";

      // Show spinner
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
        console.error("Failed to connect:", error);
        alert("⚠️ Failed to connect to backend.\n" + error.message);
      } finally {
        document.getElementById("spinner-overlay")?.remove();
      }
    };
  }

  // ------------------ Auto-save on input changes ------------------
  ["name", "email", "phone", "website"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => saveToLocalStorage());
  });

  // ------------------ Auto-save on card changes ------------------
  document.body.addEventListener("input", () => saveToLocalStorage());
});

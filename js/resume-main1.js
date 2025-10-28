// resume-main.js
// Entry point – initializes resume builder and event wiring

window.addEventListener("DOMContentLoaded", () => {
  console.log("NextGen Resume Lab loaded");

  // ------------------ Load from localStorage ------------------
  let resumeData = loadFromLocalStorage();
  if (!resumeData) {
    console.log("No saved data found, using defaultResumeData");
    resumeData = defaultResumeData;
  }

  renderResume(resumeData);
  initSectionToggles();

  // ------------------ Hook up Add Buttons ------------------
  const addEduBtn = document.getElementById("add-education-btn");
  const addExpBtn = document.getElementById("add-experience-btn");
  const addProjBtn = document.getElementById("add-project-btn");
  const addSkillBtn = document.getElementById("add-skill-btn");

  if (addEduBtn) addEduBtn.onclick = () => { addEducationCard({}); saveToLocalStorage(); };
  if (addExpBtn) addExpBtn.onclick = () => { addExperienceCard({}); saveToLocalStorage(); };
  if (addProjBtn) addProjBtn.onclick = () => { addProjectCard({}); saveToLocalStorage(); };
  if (addSkillBtn) addSkillBtn.onclick = () => { addSkillCard({}); saveToLocalStorage(); };

  // ------------------ Generate PDF ------------------
  const generateBtn = document.getElementById("generate-btn");
  if (generateBtn) {
    generateBtn.onclick = async () => {
      const resumeData = collectResumeData();
      console.log("Generating PDF with data:", resumeData);

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
  // (For name/email/phone/website inputs)
  ["name", "email", "phone", "website"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => saveToLocalStorage());
  });
});

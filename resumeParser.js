//-----------------------------------------------------
// 🧩 Resume Parsing and Populating Script (Unified)
//-----------------------------------------------------

async function parseResumeText(pdfFile) {
  try {
    logDebug("🚀 Sending PDF to backend /api/generate for parsing... v1");

    if (!pdfFile) {
      logDebug("⚠️ No file provided.");
      return;
    }

    // ✅ Always include file name — this fixes 422 issues with UploadFile
    const formData = new FormData();
    formData.append("file", pdfFile, pdfFile.name || "resume.pdf");

    const API_URL = "https://idea-ai-parseresume.hf.space/api/generate";

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const parsed = await response.json();
    logDebug("✅ Received parsed JSON:", parsed);

    // --- Safety guard ---
    if (!parsed || Object.keys(parsed).length === 0) {
      logDebug("⚠️ Empty response from server.");
      return;
    }

    // --- Populate UI fields ---
    if (parsed.name) document.getElementById("name").value = parsed.name;
    if (parsed.contact?.email) document.getElementById("email").value = parsed.contact.email;
    if (parsed.contact?.phone) document.getElementById("phone").value = parsed.contact.phone;
    if (parsed.contact?.website) document.getElementById("website").value = parsed.contact.website;

    // clear existing cards before populating new ones
    ["education", "experience", "projects", "skills"].forEach(id => {
      document.getElementById(`${id}-cards`).innerHTML = "";
    });

    if (parsed.education?.length) parsed.education.forEach(addEducationCard);
    if (parsed.experience?.length) parsed.experience.forEach(addExperienceCard);
    if (parsed.projects?.length) parsed.projects.forEach(addProjectCard);
    if (parsed.skills?.length) parsed.skills.forEach(addSkillCard);

    saveToLocalStorage();
    logDebug("🎯 Resume parsed and populated successfully via API.");

  } catch (err) {
    logDebug("❌ Error during resume parsing: " + err.message);
  }
}

window.resumeParser = {
  splitResumeSections,
  extractBasicInfo,
  extractEducation,
  extractExperience,
  extractProjects,
  extractSkills,
  parseResumeText  // exposed here
};

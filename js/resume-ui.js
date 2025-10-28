// resume-ui.js
// UI utilities: create inputs/textareas, add/remove cards, collect data
// Includes working expand/collapse toggle for all cards
// NOTE: relies on saveToLocalStorage() being available from resume-storage.js

// ------------------ Helpers ------------------
function createInput(placeholder, value = "") {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "resume-input";
  input.placeholder = placeholder;
  input.value = value || "";
  input.addEventListener("input", () => {
    saveToLocalStorage && saveToLocalStorage();
  });
  return input;
}

function createTextArea(placeholder, value = "", rows = 4) {
  const ta = document.createElement("textarea");
  ta.className = "resume-textarea";
  ta.placeholder = placeholder;
  ta.value = value || "";
  ta.rows = rows;
  ta.addEventListener("input", () => {
    saveToLocalStorage && saveToLocalStorage();
  });
  return ta;
}

function createRemoveButton(card) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "remove-btn";
  btn.textContent = "Remove";
  btn.addEventListener("click", () => {
    card.style.transition = "all 0.12s ease";
    card.style.opacity = "0";
    card.style.transform = "scale(0.98)";
    setTimeout(() => {
      card.remove();
      saveToLocalStorage && saveToLocalStorage();
    }, 120);
  });
  return btn;
}

function addToggleButton(card) {
  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "toggle-btn";
  toggleBtn.textContent = "-"; // initially expanded
  toggleBtn.addEventListener("click", () => {
    const contentElements = Array.from(card.children).filter(
      c => !c.classList.contains("toggle-btn") && !c.classList.contains("remove-btn")
    );
    const isCollapsed = contentElements[0].style.display === "none";
    contentElements.forEach(c => c.style.display = isCollapsed ? "block" : "none");
    toggleBtn.textContent = isCollapsed ? "-" : "+";
  });
  card.insertBefore(toggleBtn, card.firstChild);
}

// ------------------ Add Card Functions ------------------
function addEducationCard(data = {}) {
  const container = document.getElementById("education-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  const schoolInput = createInput("School Name", data.school || "");
  const locationInput = createInput("Location", data.location || "");
  const degreeInput = createInput("Degree", data.degree || "");
  const datesInput = createInput("Dates", data.dates || "");

  card.appendChild(schoolInput);
  card.appendChild(locationInput);
  card.appendChild(degreeInput);
  card.appendChild(datesInput);
  card.appendChild(createRemoveButton(card));
  addToggleButton(card);

  container.appendChild(card);
  saveToLocalStorage && saveToLocalStorage();
  return card;
}

function addExperienceCard(data = {}) {
  const container = document.getElementById("experience-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  const titleInput = createInput("Job Title", data.title || "");
  const companyInput = createInput("Company", data.company || "");
  const locationInput = createInput("Location", data.location || "");
  const datesInput = createInput("Dates", data.dates || "");
  const detailsTa = createTextArea("Details (one per line)", (data.details || []).join("\n"), 6);

  card.appendChild(titleInput);
  card.appendChild(companyInput);
  card.appendChild(locationInput);
  card.appendChild(datesInput);
  card.appendChild(detailsTa);
  card.appendChild(createRemoveButton(card));
  addToggleButton(card);

  container.appendChild(card);
  saveToLocalStorage && saveToLocalStorage();
  return card;
}

function addProjectCard(data = {}) {
  const container = document.getElementById("projects-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  const titleInput = createInput("Project Title", data.title || "");
  const descTa = createTextArea("Description", data.description || "", 5);

  card.appendChild(titleInput);
  card.appendChild(descTa);
  card.appendChild(createRemoveButton(card));
  addToggleButton(card);

  container.appendChild(card);
  saveToLocalStorage && saveToLocalStorage();
  return card;
}

function addSkillCard(data = {}) {
  const container = document.getElementById("skills-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  const categoryInput = createInput("Category", data.category || "");
  const itemsInput = createInput("Comma-separated skills", (data.items || []).join(", "));

  card.appendChild(categoryInput);
  card.appendChild(itemsInput);
  card.appendChild(createRemoveButton(card));
  addToggleButton(card);

  container.appendChild(card);
  saveToLocalStorage && saveToLocalStorage();
  return card;
}

// ------------------ Collect Data ------------------
function collectResumeData() {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const phoneEl = document.getElementById("phone");
  const websiteEl = document.getElementById("website");

  const name = nameEl ? nameEl.value : "";
  const contact = {
    email: emailEl ? emailEl.value : "",
    phone: phoneEl ? phoneEl.value : "",
    website: websiteEl ? websiteEl.value : ""
  };

  const educationContainer = document.getElementById("education-cards");
  const experienceContainer = document.getElementById("experience-cards");
  const projectsContainer = document.getElementById("projects-cards");
  const skillsContainer = document.getElementById("skills-cards");

  const education = educationContainer ? Array.from(educationContainer.children).map(card => ({
    school: card.children[1]?.value || "",
    location: card.children[2]?.value || "",
    degree: card.children[3]?.value || "",
    dates: card.children[4]?.value || ""
  })) : [];

  const experience = experienceContainer ? Array.from(experienceContainer.children).map(card => ({
    title: card.children[1]?.value || "",
    company: card.children[2]?.value || "",
    location: card.children[3]?.value || "",
    dates: card.children[4]?.value || "",
    details: (card.children[5] && card.children[5].value) ? card.children[5].value.split("\n").map(s => s.trim()).filter(Boolean) : []
  })) : [];

  const projects = projectsContainer ? Array.from(projectsContainer.children).map(card => ({
    title: card.children[1]?.value || "",
    description: card.children[2] ? card.children[2].value : ""
  })) : [];

  const skills = skillsContainer ? Array.from(skillsContainer.children).map(card => ({
    category: card.children[1]?.value || "",
    items: (card.children[2] && card.children[2].value) ? card.children[2].value.split(",").map(s => s.trim()).filter(Boolean) : []
  })) : [];

  return { name, contact, education, experience, projects, skills };
}

// ------------------ Render helpers ------------------
function renderResume(data) {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const phoneEl = document.getElementById("phone");
  const websiteEl = document.getElementById("website");
  if (nameEl) nameEl.value = data.name || "";
  if (emailEl) emailEl.value = data.contact?.email || "";
  if (phoneEl) phoneEl.value = data.contact?.phone || "";
  if (websiteEl) websiteEl.value = data.contact?.website || "";

  const clearAndPopulate = (containerId, addFunc, items) => {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
    (items || []).forEach(item => addFunc(item));
  };

  clearAndPopulate("education-cards", addEducationCard, data.education);
  clearAndPopulate("experience-cards", addExperienceCard, data.experience);
  clearAndPopulate("projects-cards", addProjectCard, data.projects);
  clearAndPopulate("skills-cards", addSkillCard, data.skills);
}

// ------------------ Export to global scope ------------------
window.addEducationCard = addEducationCard;
window.addExperienceCard = addExperienceCard;
window.addProjectCard = addProjectCard;
window.addSkillCard = addSkillCard;
window.collectResumeData = collectResumeData;
window.renderResume = renderResume;

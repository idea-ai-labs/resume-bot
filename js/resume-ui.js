// resume-ui.js
// UI utilities: create inputs/textareas, add/remove cards, collect data
// Card-level collapse removed; section-level collapse remains via HTML + resume-main.js

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

// ------------------ Add Card Functions ------------------
function addEducationCard(data = {}) {
  const container = document.getElementById("education-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  card.appendChild(createInput("School Name", data.school || ""));
  card.appendChild(createInput("Location", data.location || ""));
  card.appendChild(createInput("Degree", data.degree || ""));
  card.appendChild(createInput("Dates", data.dates || ""));
  card.appendChild(createRemoveButton(card));

  container.appendChild(card);
  saveToLocalStorage && saveToLocalStorage();
  return card;
}

function addExperienceCard(data = {}) {
  const container = document.getElementById("experience-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  card.appendChild(createInput("Job Title", data.title || ""));
  card.appendChild(createInput("Company", data.company || ""));
  card.appendChild(createInput("Location", data.location || ""));
  card.appendChild(createInput("Dates", data.dates || ""));
  card.appendChild(createTextArea("Details (one per line)", (data.details || []).join("\n"), 6));
  card.appendChild(createRemoveButton(card));

  container.appendChild(card);
  saveToLocalStorage && saveToLocalStorage();
  return card;
}

function addProjectCard(data = {}) {
  const container = document.getElementById("projects-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  card.appendChild(createInput("Project Title", data.title || ""));
  card.appendChild(createTextArea("Description", data.description || "", 5));
  card.appendChild(createRemoveButton(card));

  container.appendChild(card);
  saveToLocalStorage && saveToLocalStorage();
  return card;
}

function addSkillCard(data = {}) {
  const container = document.getElementById("skills-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  card.appendChild(createInput("Category", data.category || ""));
  card.appendChild(createInput("Comma-separated skills", (data.items || []).join(", ")));
  card.appendChild(createRemoveButton(card));

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

  const getCardsData = (containerId, mapFn) => {
    const container = document.getElementById(containerId);
    return container ? Array.from(container.children).map(mapFn) : [];
  };

  const education = getCardsData("education-cards", card => ({
    school: card.children[0].value,
    location: card.children[1].value,
    degree: card.children[2].value,
    dates: card.children[3].value
  }));

  const experience = getCardsData("experience-cards", card => ({
    title: card.children[0].value,
    company: card.children[1].value,
    location: card.children[2].value,
    dates: card.children[3].value,
    details: card.children[4].value.split("\n").map(s => s.trim()).filter(Boolean)
  }));

  const projects = getCardsData("projects-cards", card => ({
    title: card.children[0].value,
    description: card.children[1].value
  }));

  const skills = getCardsData("skills-cards", card => ({
    category: card.children[0].value,
    items: card.children[1].value.split(",").map(s => s.trim()).filter(Boolean)
  }));

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

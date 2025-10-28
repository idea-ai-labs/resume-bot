// ------------------ Default Resume Data ------------------
const defaultResumeData = {
  name: "John Smith",
  contact: { email: "john.smith@example.com", phone: "555-123-4567", website: "https://linkedin.com/in/johnsmith" },
  education: [
    { school: "Greenfield University", location: "Seattle, WA", degree: "B.Sc. in Computer Engineering", dates: "2015 -- 2019" },
    { school: "Downtown Community College", location: "Seattle, WA", degree: "Associate in Information Technology", dates: "2013 -- 2015" }
  ],
  experience: [
    { title: "Software Engineer", company: "TechWave Inc.", location: "Seattle, WA", dates: "2019 -- Present", details: ["Developed internal tools using React & Node.js", "Managed CI/CD pipelines for web apps"] },
    { title: "IT Support Specialist", company: "Downtown Community College", location: "Seattle, WA", dates: "2015 -- 2019", details: ["Maintained campus IT infrastructure", "Resolved hardware/software issues"] }
  ],
  projects: [
    { title: "TaskManager Pro", description: "Full-stack project management app using React, Node.js & MongoDB" },
    { title: "IoT Home Monitor", description: "Raspberry Pi based home monitoring system with mobile alerts" }
  ],
  skills: [
    { category: "Languages", items: ["JavaScript", "Python", "C++", "SQL"] },
    { category: "Frameworks", items: ["React", "Node.js", "Express", "Flask"] }
  ]
};

// ------------------ Debug Log ------------------
function logDebug(message) {
  const logBox = document.getElementById("log-box");
  if (!logBox) return;
  logBox.value += message + "\n";
  logBox.scrollTop = logBox.scrollHeight;
}

// ------------------ Card Utilities ------------------
function createInput(value, placeholder, onChange) {
  const input = document.createElement("input");
  input.value = value || "";
  input.placeholder = placeholder;
  input.oninput = e => onChange(e.target.value);
  return input;
}

function createRemoveButton(card) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Remove";
  btn.className = "remove-btn";
  btn.onclick = () => card.remove();
  return btn;
}

// ------------------ Education ------------------
function addEducationCard(data) {
  const container = document.getElementById("education-cards");
  const card = document.createElement("div");
  card.className = "card";

  const schoolInput = createInput(data?.school, "School Name", val => card.dataset.school = val);
  const locationInput = createInput(data?.location, "Location", val => card.dataset.location = val);
  const degreeInput = createInput(data?.degree, "Degree", val => card.dataset.degree = val);
  const datesInput = createInput(data?.dates, "Dates", val => card.dataset.dates = val);

  card.append(schoolInput, locationInput, degreeInput, datesInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
}

// ------------------ Experience ------------------
function addExperienceCard(data) {
  const container = document.getElementById("experience-cards");
  const card = document.createElement("div");
  card.className = "card";

  const titleInput = createInput(data?.title, "Job Title", val => card.dataset.title = val);
  const companyInput = createInput(data?.company, "Company", val => card.dataset.company = val);
  const locationInput = createInput(data?.location, "Location", val => card.dataset.location = val);
  const datesInput = createInput(data?.dates, "Dates", val => card.dataset.dates = val);

  const detailsInput = document.createElement("textarea");
  detailsInput.placeholder = "Details (one per line)";
  detailsInput.value = (data?.details || []).join("\n");
  detailsInput.oninput = e => card.dataset.details = e.target.value.split("\n");

  card.append(titleInput, companyInput, locationInput, datesInput, detailsInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
}

// ------------------ Projects ------------------
function addProjectCard(data) {
  const container = document.getElementById("projects-cards");
  const card = document.createElement("div");
  card.className = "card";

  const titleInput = createInput(data?.title, "Project Title", val => card.dataset.title = val);
  const descInput = createInput(data?.description, "Description", val => card.dataset.description = val);

  card.append(titleInput, descInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
}

// ------------------ Skills ------------------
function addSkillCard(data) {
  const container = document.getElementById("skills-cards");
  const card = document.createElement("div");
  card.className = "card";

  const categoryInput = createInput(data?.category, "Category", val => card.dataset.category = val);
  const itemsInput = createInput((data?.items || []).join(", "), "Comma-separated skills", val => card.dataset.items = val.split(",").map(s => s.trim()));

  card.append(categoryInput, itemsInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
}

// ------------------ Collect Data from UI ------------------
function collectResumeData() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const website = document.getElementById("website").value;

  const education = Array.from(document.getElementById("education-cards").children).map(card => ({
    school: card.children[0].value,
    location: card.children[1].value,
    degree: card.children[2].value,
    dates: card.children[3].value
  }));

  const experience = Array.from(document.getElementById("experience-cards").children).map(card => ({
    title: card.children[0].value,
    company: card.children[1].value,
    location: card.children[2].value,
    dates: card.children[3].value,
    details: card.children[4].value.split("\n")
  }));

  const projects = Array.from(document.getElementById("projects-cards").children).map(card => ({
    title: card.children[0].value,
    description: card.children[1].value
  }));

  const skills = Array.from(document.getElementById("skills-cards").children).map(card => ({
    category: card.children[0].value,
    items: card.children[1].value.split(",").map(s => s.trim())
  }));

  return { name, contact: { email, phone, website }, education, experience, projects, skills };
}

// ------------------ Collapsible Sections ------------------
function setupCollapsible(section) {
  const headerDiv = section.querySelector(".section-header");
  const content = section.querySelector(".section-content");
  const icon = headerDiv.querySelector(".toggle-icon"); 
  if (!headerDiv || !content || !icon) return;

  if (!content.classList.contains("collapsed")) {
    content.style.maxHeight = content.scrollHeight + "px";
    icon.textContent = "−";
  } else {
    content.style.maxHeight = "0";
    icon.textContent = "+";
  }

  headerDiv.addEventListener("click", () => {
    const isCollapsed = content.classList.toggle("collapsed");
    content.style.maxHeight = isCollapsed ? "0" : content.scrollHeight + "px";
    icon.textContent = isCollapsed ? "+" : "−";
  });
}

function initSectionCollapsibles() {
  document.querySelectorAll(".section").forEach(section => setupCollapsible(section));
}

// ------------------ Render Resume ------------------
function renderResume(data) {
  document.getElementById("name").value = data.name;
  document.getElementById("email").value = data.contact.email;
  document.getElementById("phone").value = data.contact.phone;
  document.getElementById("website").value = data.contact.website;

  data.education.forEach(addEducationCard);
  data.experience.forEach(addExperienceCard);
  data.projects.forEach(addProjectCard);
  data.skills.forEach(addSkillCard);
}

// ------------------ Export to global scope ------------------
window.addEducationCard = addEducationCard;
window.addExperienceCard = addExperienceCard;
window.addProjectCard = addProjectCard;
window.addSkillCard = addSkillCard;
window.collectResumeData = collectResumeData;
window.renderResume = renderResume;
window.initSectionCollapsibles = initSectionCollapsibles;

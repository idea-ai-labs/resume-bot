// ------------------ Default Resume Data ------------------
const defaultResumeData = {
  name: "John Smith",
  contact: {
    email: "john.smith@example.com",
    phone: "555-123-4567",
    website: "https://linkedin.com/in/johnsmith"
  },
  education: [
    { school: "University of Modern Tech", location: "San Francisco, CA", degree: "B.Sc. in Information Systems", dates: "Sep. 2015 -- May 2019" },
    { school: "City College", location: "San Francisco, CA", degree: "Associate's in Computer Science", dates: "Sep. 2013 -- May 2015" }
  ],
  experience: [
    { title: "Software Engineer", company: "Innovatech Solutions", location: "San Francisco, CA", dates: "June 2019 -- Present",
      details: [
        "Developed scalable web applications using React and Node.js",
        "Implemented REST APIs and integrated third-party services",
        "Mentored junior developers and conducted code reviews"
      ]
    },
    { title: "IT Support Specialist", company: "City College", location: "San Francisco, CA", dates: "Jan. 2014 -- May 2015",
      details: [
        "Provided tech support to students and faculty",
        "Maintained computer labs and network systems",
        "Trained users on software tools and best practices"
      ]
    }
  ],
  projects: [
    { title: "TaskMaster Pro", description: "Productivity web app built with React and Node.js for task management" },
    { title: "DataViz Dashboard", description: "Visualization tool for business analytics using D3.js" }
  ],
  skills: [
    { category: "Languages", items: ["Python", "JavaScript", "SQL", "HTML/CSS"] },
    { category: "Frameworks", items: ["React", "Node.js", "Express", "D3.js"] }
  ]
};

// ------------------ Debug Log ------------------
function logDebug(message) {
  const logBox = document.getElementById("log-box");
  if (logBox) {
    logBox.value += message + "\n";
    logBox.scrollTop = logBox.scrollHeight;
  } else {
    console.log(message);
  }
}

// ------------------ LocalStorage Persistence ------------------
const STORAGE_KEY = "nextgen_resume_data";

function saveToLocalStorage() {
  try {
    const data = collectResumeData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    logDebug("✅ Auto-saved resume data.");
  } catch (e) {
    logDebug("⚠️ Failed to save to localStorage: " + e);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    logDebug("⚠️ Failed to load from localStorage: " + e);
  }
  return null;
}

// ------------------ Utility Functions ------------------
function createInput(value, placeholder, onChange) {
  const input = document.createElement("input");
  input.value = value || "";
  input.placeholder = placeholder;
  input.oninput = (e) => { onChange(e.target.value); saveToLocalStorage(); };
  return input;
}

function createTextArea(value, placeholder, onChange) {
  const ta = document.createElement("textarea");
  ta.value = value || "";
  ta.placeholder = placeholder;
  ta.oninput = (e) => { onChange(e.target.value); saveToLocalStorage(); };
  return ta;
}

function createRemoveButton(card) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Remove";
  btn.className = "remove-btn";
  btn.onclick = () => { card.remove(); saveToLocalStorage(); };
  return btn;
}

// ------------------ Card Functions ------------------
function addEducationCard(data) {
  const container = document.getElementById("education-cards");
  const card = document.createElement("div");
  card.className = "card";

  card.append(
    createInput(data?.school, "School Name", val => card.dataset.school = val),
    createInput(data?.location, "Location", val => card.dataset.location = val),
    createInput(data?.degree, "Degree", val => card.dataset.degree = val),
    createInput(data?.dates, "Dates", val => card.dataset.dates = val),
    createRemoveButton(card)
  );

  container.appendChild(card);
}

function addExperienceCard(data) {
  const container = document.getElementById("experience-cards");
  const card = document.createElement("div");
  card.className = "card";

  card.append(
    createInput(data?.title, "Job Title", val => card.dataset.title = val),
    createInput(data?.company, "Company", val => card.dataset.company = val),
    createInput(data?.location, "Location", val => card.dataset.location = val),
    createInput(data?.dates, "Dates", val => card.dataset.dates = val),
    createTextArea((data?.details || []).join("\n"), "Details (one per line)", val => card.dataset.details = val.split("\n")),
    createRemoveButton(card)
  );

  container.appendChild(card);
}

function addProjectCard(data) {
  const container = document.getElementById("projects-cards");
  const card = document.createElement("div");
  card.className = "card";

  card.append(
    createInput(data?.title, "Project Title", val => card.dataset.title = val),
    createTextArea(data?.description, "Description", val => card.dataset.description = val),
    createRemoveButton(card)
  );

  container.appendChild(card);
}

function addSkillCard(data) {
  const container = document.getElementById("skills-cards");
  const card = document.createElement("div");
  card.className = "card";

  card.append(
    createInput(data?.category, "Category", val => card.dataset.category = val),
    createInput((data?.items || []).join(", "), "Comma-separated skills", val => card.dataset.items = val.split(",").map(s => s.trim())),
    createRemoveButton(card)
  );

  container.appendChild(card);
}

// ------------------ Collect Data ------------------
function collectResumeData() {
  const name = document.getElementById("name")?.value || "";
  const email = document.getElementById("email")?.value || "";
  const phone = document.getElementById("phone")?.value || "";
  const website = document.getElementById("website")?.value || "";

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

  content.style.maxHeight = content.classList.contains("collapsed") ? "0" : content.scrollHeight + "px";
  icon.textContent = content.classList.contains("collapsed") ? "+" : "−";

  headerDiv.addEventListener("click", () => {
    const isCollapsed = content.classList.toggle("collapsed");
    content.style.maxHeight = isCollapsed ? "0" : content.scrollHeight + "px";
    icon.textContent = isCollapsed ? "+" : "−";
  });
}

function initSectionCollapsibles() {
  document.querySelectorAll(".section").forEach(section => setupCollapsible(section));
}

// ------------------ Initialize UI ------------------
window.onload = () => {
  const savedData = loadFromLocalStorage() || defaultResumeData;

  // Basic info
  document.getElementById("name").value = savedData.name;
  document.getElementById("email").value = savedData.contact.email;
  document.getElementById("phone").value = savedData.contact.phone;
  document.getElementById("website").value = savedData.contact.website;

  // Cards
  savedData.education.forEach(addEducationCard);
  savedData.experience.forEach(addExperienceCard);
  savedData.projects.forEach(addProjectCard);
  savedData.skills.forEach(addSkillCard);

  // Collapsibles
  initSectionCollapsibles();

  // Add buttons
  document.getElementById("add-education-btn").onclick = () => addEducationCard({});
  document.getElementById("add-experience-btn").onclick = () => addExperienceCard({});
  document.getElementById("add-project-btn").onclick = () => addProjectCard({});
  document.getElementById("add-skill-btn").onclick = () => addSkillCard({});

  // Basic info auto-save
  ["name", "email", "phone", "website"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", saveToLocalStorage);
  });

  // Generate PDF
  document.getElementById("generate-btn").onclick = generatePDF;
};

// ------------------ Export functions globally ------------------
window.addEducationCard = addEducationCard;
window.addExperienceCard = addExperienceCard;
window.addProjectCard = addProjectCard;
window.addSkillCard = addSkillCard;
window.collectResumeData = collectResumeData;
window.renderResume = (data) => {
  // Clear existing cards
  ["education-cards", "experience-cards", "projects-cards", "skills-cards"].forEach(id => {
    const container = document.getElementById(id);
    if (container) container.innerHTML = "";
  });

  // Basic info
  if (data.name) document.getElementById("name").value = data.name;
  if (data.contact?.email) document.getElementById("email").value = data.contact.email;
  if (data.contact?.phone) document.getElementById("phone").value = data.contact.phone;
  if (data.contact?.website) document.getElementById("website").value = data.contact.website;

  // Cards
  data.education?.forEach(addEducationCard);
  data.experience?.forEach(addExperienceCard);
  data.projects?.forEach(addProjectCard);
  data.skills?.forEach(addSkillCard);

  // Re-initialize collapsibles
  initSectionCollapsibles();
};

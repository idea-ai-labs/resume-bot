// ------------------ Default Resume Data ------------------

const defaultResumeData = {
  "name": "John Smith",
  "contact": {
    "email": "john.smith@example.com",
    "phone": "555-123-4567",
    "website": "https://linkedin.com/in/johnsmith"
  },
  "education": [
    {
      "school": "University of Modern Tech",
      "location": "San Francisco, CA",
      "degree": "B.Sc. in Information Systems",
      "dates": "Sep 2015 – May 2019"
    },
    {
      "school": "City College",
      "location": "San Francisco, CA",
      "degree": "Associate’s in Computer Science",
      "dates": "Sep 2013 – May 2015"
    }
  ],
  "experience": [
    {
      "title": "Senior Software Engineer",
      "company": "Innovatech Solutions",
      "location": "San Francisco, CA",
      "dates": "June 2021 – Present",
      "details": [
        "Architected 8+ scalable web apps with React and Node.js serving 50,000+ users.",
        "Designed RESTful APIs handling 2M+ daily requests, improving performance by 40%.",
        "Migrated monolith to microservices with Docker and Kubernetes, cutting deployment time by 90%.",
        "Mentored 5 junior developers, contributing to 3 promotions in 18 months."
      ]
    },
    {
      "title": "Software Engineer",
      "company": "TechBridge Inc.",
      "location": "San Jose, CA",
      "dates": "March 2020 – May 2021",
      "details": [
        "Developed key e-commerce features using React and Django, increasing engagement by 35%.",
        "Implemented automated tests with Jest and Pytest achieving 80% code coverage.",
        "Collaborated cross-functionally to deliver 6 major feature releases on time."
      ]
    }
  ],
  "projects": [
    {
      "title": "TaskMaster Pro",
      "description": [
        "Built team productivity web app with real-time collaboration for up to 50 users.",
        "Implemented role-based access with JWT authentication.",
        "Created drag-and-drop Kanban board using React Beautiful DnD and WebSockets."
      ],
      "technologies": "React, Node.js, Express, MongoDB, Redux, JWT, AWS S3",
      "dates": "Jan 2023 – Apr 2023"
    },
    {
      "title": "DataViz Dashboard",
      "description": [
        "Developed data visualization platform with 10+ interactive chart types.",
        "Built Flask REST API backend with optimized PostgreSQL queries.",
        "Created dynamic D3.js visualizations with zoom, pan, and filters."
      ],
      "technologies": "D3.js, Flask, Python, PostgreSQL, Pandas, Chart.js",
      "dates": "Sep 2022 – Dec 2022"
    },
    {
      "title": "E-Commerce Platform",
      "description": [
        "Developed full-stack e-commerce site with secure Stripe-based checkout.",
        "Implemented Elasticsearch product search with fuzzy matching.",
        "Built admin dashboard for inventory and order analytics."
      ],
      "technologies": "React, Redux, Node.js, Express, MongoDB, Stripe API",
      "dates": "May 2022 – Aug 2022"
    }
  ],
  "skills": [
    {
      "category": "Languages",
      "items": ["Python", "JavaScript", "TypeScript", "SQL", "HTML5", "CSS3", "Java", "C++"]
    },
    {
      "category": "Frameworks & Libraries",
      "items": ["React", "Node.js", "Express", "Redux", "Vue.js", "D3.js", "Flask", "Django", "React Native", "Bootstrap", "Tailwind CSS"]
    },
    {
      "category": "Databases & Tools",
      "items": ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Git", "Docker", "Kubernetes", "AWS (EC2, S3, Lambda)", "Jenkins", "Postman"]
    },
    {
      "category": "Development Practices",
      "items": ["Agile/Scrum", "CI/CD", "Test-Driven Development (TDD)", "RESTful API Design", "Microservices Architecture", "Code Review"]
    }
  ]
};

// ------------------ Debug Log ------------------
function logDebug(msg) {
  const box = document.getElementById("log-box");
  if (!box) return;
  box.value += msg + "\n";
  box.scrollTop = box.scrollHeight;
  console.log(msg);
}

// Capture all uncaught errors
window.onerror = function(msg, url, line, col, error) {
    logDebug(`❌ Error: ${msg} at ${url}:${line}:${col}`);
    if (error && error.stack) logDebug(error.stack);
};

// Capture unhandled promise rejections
window.addEventListener("unhandledrejection", function(e) {
    logDebug(`❌ Unhandled Promise Rejection: ${e.reason}`);
});

// ------------------ Storage ------------------
function saveToLocalStorage() {
  localStorage.setItem("resumeData", JSON.stringify(collectResumeData()));
  logDebug("💾 Saved to localStorage");
}
function loadFromLocalStorage() {
  try {
    const d = localStorage.getItem("resumeData");
    if (d) {
      logDebug("📥 Loaded from localStorage");
      return JSON.parse(d);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

// ------------------ UI Helpers ------------------
function createInput(value, placeholder, onChange) {
  const input = document.createElement("input");
  input.value = value || "";
  input.placeholder = placeholder;
  input.oninput = e => { onChange(e.target.value); saveToLocalStorage(); };
  return input;
}
function createTextarea(value, placeholder, onChange) {
  const t = document.createElement("textarea");
  t.value = value || "";
  t.placeholder = placeholder;
  t.oninput = e => { onChange(e.target.value); saveToLocalStorage(); };
  return t;
}
function createRemoveButton(card) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "remove-btn";
  b.textContent = "Remove";
  b.onclick = () => { card.remove(); saveToLocalStorage(); };
  return b;
}

// ------------------ Helper Buttons ------------------
function createMoveButtons(card) {
  const container = document.createElement("div");
  container.className = "move-btns";

  const upBtn = document.createElement("button");
  upBtn.type = "button";
  upBtn.className = "move-up";
  upBtn.textContent = "↑";
  upBtn.onclick = () => moveCardUp(card);

  const downBtn = document.createElement("button");
  downBtn.type = "button";
  downBtn.className = "move-down";
  downBtn.textContent = "↓";
  downBtn.onclick = () => moveCardDown(card);

  container.append(upBtn, downBtn, createRemoveButton(card));
  return container;
}

function moveCardUp(card) {
  const prev = card.previousElementSibling;
  if (prev && prev.classList.contains("card")) {
    card.parentNode.insertBefore(card, prev);
    updateMoveButtons(card.parentNode);
    saveToLocalStorage();
  }
}

function moveCardDown(card) {
  const next = card.nextElementSibling;
  if (next && next.classList.contains("card")) {
    card.parentNode.insertBefore(next, card);
    updateMoveButtons(card.parentNode);
    saveToLocalStorage();
  }
}

function updateMoveButtons(container) {
  const cards = Array.from(container.querySelectorAll(".card"));
  cards.forEach((card, index) => {
    const upBtn = card.querySelector(".move-up");
    const downBtn = card.querySelector(".move-down");
    if (upBtn && downBtn) {
      upBtn.disabled = index === 0;
      downBtn.disabled = index === cards.length - 1;
    }
  });
}

function adjustSectionHeight(section) {
  if (!section) return;
  const content = section.querySelector(".section-content");
  if (content && !content.classList.contains("collapsed")) {
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

// ------------------ Updated Add Card Functions ------------------
function addEducationCard(d) {
  const container = document.getElementById("education-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";
  card.append(
    createInput(d?.school, "School Name", v => card.dataset.school = v),
    createInput(d?.location, "Location", v => card.dataset.location = v),
    createInput(d?.degree, "Degree", v => card.dataset.degree = v),
    createInput(d?.dates, "Dates", v => card.dataset.dates = v),
    createMoveButtons(card)
  );

  container.appendChild(card);
  updateMoveButtons(container);
  adjustSectionHeight(container.closest(".section"));
}

function addExperienceCard(d) {
  const container = document.getElementById("experience-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";
  card.append(
    createInput(d?.title, "Job Title", v => card.dataset.title = v),
    createInput(d?.company, "Company", v => card.dataset.company = v),
    createInput(d?.location, "Location", v => card.dataset.location = v),
    createInput(d?.dates, "Dates", v => card.dataset.dates = v),
    createTextarea((d?.details || []).join("\n"), "Details (one per line)", v => card.dataset.details = v.split("\n")),
    createMoveButtons(card)
  );

  container.appendChild(card);
  updateMoveButtons(container);
  adjustSectionHeight(container.closest(".section"));
}

function addProjectCard(d) {
  const container = document.getElementById("projects-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";
  card.append(
    createInput(d?.title, "Project Title", v => card.dataset.title = v),
    createInput(d?.technologies, "Technologies Used", v => card.dataset.technologies = v),
    createInput(d?.dates, "Dates", v => card.dataset.dates = v),
    //createTextarea(d?.description, "Description", v => card.dataset.description = v),
    createTextarea((d?.description || []).join("\n"), "Description (one per line)", v => card.dataset.description = v.split("\n")),
    createMoveButtons(card)
  );

  container.appendChild(card);
  updateMoveButtons(container);
  adjustSectionHeight(container.closest(".section"));
}

function addSkillCard(d) {
  const container = document.getElementById("skills-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";
  card.append(
    createInput(d?.category, "Category", v => card.dataset.category = v),
    createInput((d?.items || []).join(", "), "Comma-separated skills", v => card.dataset.items = v.split(",").map(s => s.trim())),
    createMoveButtons(card)
  );

  container.appendChild(card);
  updateMoveButtons(container);
  adjustSectionHeight(container.closest(".section"));
}

// ------------------ Collect Data ------------------
function collectResumeData() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const website = document.getElementById("website").value;

  const mapCards = (id, fields) =>
    Array.from(document.getElementById(id).children).map(c =>
      fields.reduce((o, f, i) => { o[f] = c.children[i].value; return o; }, {})
    );

  const education = mapCards("education-cards", ["school", "location", "degree", "dates"]);
  const experience = Array.from(document.getElementById("experience-cards").children).map(c => ({
    title: c.children[0].value,
    company: c.children[1].value,
    location: c.children[2].value,
    dates: c.children[3].value,
    details: c.children[4].value.split("\n")
  }));
 // const projects = mapCards("projects-cards", ["title", "technologies", "dates", "description"]);
  const projects = Array.from(document.getElementById("projects-cards").children).map(c => ({
  title: c.children[0].value,
  technologies: c.children[1].value,
  dates: c.children[2].value,
  description: c.children[3].value.split("\n")
  }));
  const skills = Array.from(document.getElementById("skills-cards").children).map(c => ({
    category: c.children[0].value,
    items: c.children[1].value.split(",").map(s => s.trim())
  }));

  return { name, contact: { email, phone, website }, education, experience, projects, skills };
}

// ------------------ Collapsible ------------------
function setupCollapsible(section) {
  const header = section.querySelector(".section-header");
  const content = section.querySelector(".section-content");
  const icon = header.querySelector(".toggle-icon");

  header.addEventListener("click", () => {
    const isCollapsed = content.classList.toggle("collapsed");
    content.style.maxHeight = isCollapsed ? "0" : content.scrollHeight + "px";
    icon.textContent = isCollapsed ? "+" : "−";
  });
}
function collapseAllSectionsOnLoad() {
  document.querySelectorAll(".section-content").forEach(sec => {
    sec.classList.add("collapsed");
    sec.style.maxHeight = "0";
  });
  document.querySelectorAll(".toggle-icon").forEach(i => i.textContent = "+");
  document.getElementById("toggle-all-btn").textContent = "Expand All";
}

function expandAllSections() {
  document.querySelectorAll(".section-content").forEach(content => {
    content.classList.remove("collapsed");
    content.style.maxHeight = content.scrollHeight + "px";
  });
  document.querySelectorAll(".toggle-icon").forEach(icon => icon.textContent = "−");
  const btn = document.getElementById("toggle-all-btn");
  if (btn) btn.textContent = "Collapse All";
}

function toggleAllSections() {
  const btn = document.getElementById("toggle-all-btn");
  const expand = btn.textContent === "Expand All";
  document.querySelectorAll(".section-content").forEach(c => {
    c.classList.toggle("collapsed", !expand);
    c.style.maxHeight = expand ? c.scrollHeight + "px" : "0";
  });
  document.querySelectorAll(".toggle-icon").forEach(i => i.textContent = expand ? "−" : "+");
  btn.textContent = expand ? "Collapse All" : "Expand All";
}

// ------------------ PDF Generation ------------------
async function generatePDF() {
  const spinner = document.createElement("div");
  spinner.id = "spinner-overlay";
  spinner.innerHTML = `<div class="spinner-container"><div class="spinner"></div><p>Generating PDF...</p></div>`;
  document.body.appendChild(spinner);

  try {
    const res = await fetch("https://idea-ai-resumelatex.hf.space/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectResumeData())
    });
    if (!res.ok) throw new Error(await res.text());
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resume.pdf";
    link.click();
    logDebug("✅ PDF generated");
  } catch (e) {
    alert("Error: " + e.message);
  } finally {
    document.getElementById("spinner-overlay")?.remove();
  }
}

// ------------------ File Upload ------------------
function handleResumeUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById("file-name").textContent = `Uploaded: ${file.name}`;
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "pdf") parsePDF(file);
  else if (ext === "docx" || ext === "doc") parseDOCX(file);
  else alert("Unsupported file type. Please upload PDF or DOCX.");
}

// ------------------ Parse Helpers ------------------
async function parsePDFText(file) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(it => it.str).join(" ") + "\n";
  }
  resumeParser.parseResumeText(text);
  expandAllSections();
}
async function parsePDF(file) {
  // Send file directly to REST API
  await resumeParser.parseResumeText(file); // your parseResumeText function expects a File/Blob
}
async function parseDOCX(file) {
  const buf = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer: buf });
  resumeParser.parseResumeText(result.value);
  expandAllSections();
}

// ------------------ Render / Reset ------------------
function renderResume(data) {
  if (!data) return;
  ["education-cards","experience-cards","projects-cards","skills-cards"].forEach(id => document.getElementById(id).innerHTML = "");
  document.getElementById("name").value = data.name || "";
  document.getElementById("email").value = data.contact?.email || "";
  document.getElementById("phone").value = data.contact?.phone || "";
  document.getElementById("website").value = data.contact?.website || "";
  (data.education || []).forEach(addEducationCard);
  (data.experience || []).forEach(addExperienceCard);
  (data.projects || []).forEach(addProjectCard);
  (data.skills || []).forEach(addSkillCard);
  document.querySelectorAll(".section").forEach(setupCollapsible);
}
function resetToDefault() {
  if (!confirm("Reset resume to default?")) return;
  localStorage.removeItem("resumeData");
  renderResume(defaultResumeData);
  saveToLocalStorage();
  expandAllSections();
}

// ------------------ Theme Toggle ------------------
function setupThemeToggle() {
  const btn = document.createElement("button");
  btn.id = "dark-mode-btn";
  btn.textContent = "🌙 Dark Mode";
  btn.className = "theme-btn";
  document.querySelector("header").appendChild(btn);

  // Apply saved theme from localStorage
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    btn.textContent = "☀️ Light Mode";
  }

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    btn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// ------------------ Init ------------------
window.onload = () => {
  setupThemeToggle();

  const uploadInput = document.getElementById("upload-resume");
  uploadInput.addEventListener("change", handleResumeUpload);

  const resumeData = loadFromLocalStorage() || defaultResumeData;
  renderResume(resumeData);
  collapseAllSectionsOnLoad();

  document.getElementById("add-education-btn").addEventListener("click", () => addEducationCard({}));
  document.getElementById("add-experience-btn").addEventListener("click", () => addExperienceCard({}));
  document.getElementById("add-project-btn").addEventListener("click", () => addProjectCard({}));
  document.getElementById("add-skill-btn").addEventListener("click", () => addSkillCard({}));
  document.getElementById("toggle-all-btn").addEventListener("click", toggleAllSections);
  document.getElementById("generate-btn").addEventListener("click", generatePDF);
  document.getElementById("reset-btn").addEventListener("click", resetToDefault);

  ["name","email","phone","website"].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("input", saveToLocalStorage);
  });

  logDebug("✅ App initialized");
};

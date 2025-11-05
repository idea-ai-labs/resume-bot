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
    {
      title: "Software Engineer",
      company: "Innovatech Solutions",
      location: "San Francisco, CA",
      dates: "June 2019 -- Present",
      details: [
        "Developed scalable web applications using React and Node.js",
        "Implemented REST APIs and integrated third-party services",
        "Mentored junior developers and conducted code reviews"
      ]
    }
  ],
  projects: [
    { title: "TaskMaster Pro", description: "Productivity app built with React and Node.js", technologies: "React, Node.js, MongoDB", dates: "Jan 2023 – Apr 2023" },
    { title: "DataViz Dashboard", description: "Visualization tool using D3.js", technologies: "D3.js, Flask", dates: "Sep 2022 – Dec 2022" }
  ],
  skills: [
    { category: "Languages", items: ["Python", "JavaScript", "SQL", "HTML/CSS"] },
    { category: "Frameworks", items: ["React", "Node.js", "Express", "D3.js"] }
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

// ------------------ Card Builders ------------------
function addEducationCard(d) {
  const c = document.createElement("div");
  c.className = "card";
  c.append(
    createInput(d?.school, "School Name", v => c.dataset.school = v),
    createInput(d?.location, "Location", v => c.dataset.location = v),
    createInput(d?.degree, "Degree", v => c.dataset.degree = v),
    createInput(d?.dates, "Dates", v => c.dataset.dates = v),
    createRemoveButton(c)
  );
  document.getElementById("education-cards").appendChild(c);
}
function addExperienceCard(d) {
  const c = document.createElement("div");
  c.className = "card";
  c.append(
    createInput(d?.title, "Job Title", v => c.dataset.title = v),
    createInput(d?.company, "Company", v => c.dataset.company = v),
    createInput(d?.location, "Location", v => c.dataset.location = v),
    createInput(d?.dates, "Dates", v => c.dataset.dates = v),
    createTextarea((d?.details || []).join("\n"), "Details (one per line)", v => c.dataset.details = v.split("\n")),
    createRemoveButton(c)
  );
  document.getElementById("experience-cards").appendChild(c);
}
function addProjectCard(d) {
  const c = document.createElement("div");
  c.className = "card";
  c.append(
    createInput(d?.title, "Project Title", v => c.dataset.title = v),
    createInput(d?.technologies, "Technologies Used", v => c.dataset.technologies = v),
    createInput(d?.dates, "Dates", v => c.dataset.dates = v),
    createTextarea(d?.description, "Description", v => c.dataset.description = v),
    createRemoveButton(c)
  );
  document.getElementById("projects-cards").appendChild(c);
}
function addSkillCard(d) {
  const c = document.createElement("div");
  c.className = "card";
  c.append(
    createInput(d?.category, "Category", v => c.dataset.category = v),
    createInput((d?.items || []).join(", "), "Comma-separated skills", v => c.dataset.items = v.split(",").map(s => s.trim())),
    createRemoveButton(c)
  );
  document.getElementById("skills-cards").appendChild(c);
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
  const projects = mapCards("projects-cards", ["title", "technologies", "dates", "description"]);
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
async function parsePDF(file) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(it => it.str).join(" ") + "\n";
  }
  resumeParser.parseResumeText(text);
}
async function parseDOCX(file) {
  const buf = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer: buf });
  resumeParser.parseResumeText(result.value);
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
}

// ------------------ Theme Toggle ------------------
function setupThemeToggle() {
  const btn = document.createElement("button");
  btn.id = "theme-toggle";
  btn.textContent = "🌙 Dark Mode";
  btn.className = "theme-btn";
  document.querySelector("header").appendChild(btn);
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    btn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    btn.textContent = "☀️ Light Mode";
  }
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

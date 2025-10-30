// ------------------ Default Resume Data ------------------
const defaultResumeData = {
  name: "John Smith",
  contact: {
    email: "john.smith@example.com",
    phone: "555-123-4567",
    website: "https://linkedin.com/in/johnsmith"
  },
  education: [
    {
      school: "University of Modern Tech",
      location: "San Francisco, CA",
      degree: "B.Sc. in Information Systems",
      dates: "Sep. 2015 -- May 2019"
    },
    {
      school: "City College",
      location: "San Francisco, CA",
      degree: "Associate's in Computer Science",
      dates: "Sep. 2013 -- May 2015"
    }
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
    },
    {
      title: "IT Support Specialist",
      company: "City College",
      location: "San Francisco, CA",
      dates: "Jan. 2014 -- May 2015",
      details: [
        "Provided tech support to students and faculty",
        "Maintained computer labs and network systems",
        "Trained users on software tools and best practices"
      ]
    }
  ],
  projects: [
    {
      title: "TaskMaster Pro",
      description: "Productivity web app built with React and Node.js for task management"
    },
    {
      title: "DataViz Dashboard",
      description: "Visualization tool for business analytics using D3.js"
    }
  ],
  skills: [
    {
      category: "Languages",
      items: ["Python", "JavaScript", "SQL", "HTML/CSS"]
    },
    {
      category: "Frameworks",
      items: ["React", "Node.js", "Express", "D3.js"]
    }
  ]
};

// ------------------ Debug Log ------------------
function logDebug(message) {
  const logBox = document.getElementById("log-box");
  if (!logBox) return;
  logBox.style.color = "limegreen";
  logBox.value += message + "\n";
  logBox.scrollTop = logBox.scrollHeight;
}

// ------------------ Storage ------------------
function saveToLocalStorage() {
  const data = collectResumeData();
  localStorage.setItem("resumeData", JSON.stringify(data));
  logDebug("✅ Resume saved to localStorage");
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("resumeData");
  if (!data) return null;
  try {
    logDebug("📥 Resume loaded from localStorage");
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse resume data:", e);
    return null;
  }
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
  const textarea = document.createElement("textarea");
  textarea.value = value || "";
  textarea.placeholder = placeholder;
  textarea.oninput = e => { onChange(e.target.value); saveToLocalStorage(); };
  return textarea;
}

function createRemoveButton(card) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Remove";
  btn.className = "remove-btn";
  btn.onclick = () => {
    card.remove();
    saveToLocalStorage();
    adjustSectionHeight(card.closest(".section"));
  };
  return btn;
}

function adjustSectionHeight(section) {
  const content = section.querySelector(".section-content");
  if (!content || content.classList.contains("collapsed")) return;
  content.style.maxHeight = content.scrollHeight + "px";
}

// ------------------ Add Cards ------------------
function addEducationCard(data) {
  const container = document.getElementById("education-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  const schoolInput = createInput(data?.school, "School Name", val => card.dataset.school = val);
  const locationInput = createInput(data?.location, "Location", val => card.dataset.location = val);
  const degreeInput = createInput(data?.degree, "Degree", val => card.dataset.degree = val);
  const datesInput = createInput(data?.dates, "Dates", val => card.dataset.dates = val);

  card.append(schoolInput, locationInput, degreeInput, datesInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
  adjustSectionHeight(container.closest(".section"));
}

function addExperienceCard(data) {
  const container = document.getElementById("experience-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  const titleInput = createInput(data?.title, "Job Title", val => card.dataset.title = val);
  const companyInput = createInput(data?.company, "Company", val => card.dataset.company = val);
  const locationInput = createInput(data?.location, "Location", val => card.dataset.location = val);
  const datesInput = createInput(data?.dates, "Dates", val => card.dataset.dates = val);
  const detailsInput = createTextarea((data?.details || []).join("\n"), "Details (one per line)", val => card.dataset.details = val.split("\n"));

  card.append(titleInput, companyInput, locationInput, datesInput, detailsInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
  adjustSectionHeight(container.closest(".section"));
}

function addProjectCard(data) {
  const container = document.getElementById("projects-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  const titleInput = createInput(data?.title, "Project Title", val => card.dataset.title = val);
  const descInput = createInput(data?.description, "Description", val => card.dataset.description = val);

  card.append(titleInput, descInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
  adjustSectionHeight(container.closest(".section"));
}

function addSkillCard(data) {
  const container = document.getElementById("skills-cards");
  if (!container) return;

  const categoryInput = createInput(data?.category, "Category", val => card.dataset.category = val);
  const itemsInput = createInput((data?.items || []).join(", "), "Comma-separated skills", val => card.dataset.items = val.split(",").map(s => s.trim()));

  const card = document.createElement("div");
  card.className = "card";
  card.append(categoryInput, itemsInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
  adjustSectionHeight(container.closest(".section"));
}

// ------------------ Collect Data ------------------
function collectResumeData() {
  const name = document.getElementById("name")?.value || "";
  const email = document.getElementById("email")?.value || "";
  const phone = document.getElementById("phone")?.value || "";
  const website = document.getElementById("website")?.value || "";

  const education = Array.from(document.getElementById("education-cards")?.children || []).map(card => ({
    school: card.children[0].value,
    location: card.children[1].value,
    degree: card.children[2].value,
    dates: card.children[3].value
  }));

  const experience = Array.from(document.getElementById("experience-cards")?.children || []).map(card => ({
    title: card.children[0].value,
    company: card.children[1].value,
    location: card.children[2].value,
    dates: card.children[3].value,
    details: card.children[4].value.split("\n")
  }));

  const projects = Array.from(document.getElementById("projects-cards")?.children || []).map(card => ({
    title: card.children[0].value,
    description: card.children[1].value
  }));

  const skills = Array.from(document.getElementById("skills-cards")?.children || []).map(card => ({
    category: card.children[0].value,
    items: card.children[1].value.split(",").map(s => s.trim())
  }));

  return { name, contact: { email, phone, website }, education, experience, projects, skills };
}

// ------------------ Collapsible Sections ------------------
function setupCollapsible(section) {
  const headerDiv = section.querySelector(".section-header");
  const content = section.querySelector(".section-content");
  const icon = headerDiv?.querySelector(".toggle-icon");
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

// ------------------ PDF Generation ------------------
async function generatePDF() {
  const resumeData = collectResumeData();
  logDebug("Sending data to backend...");

  const API_URL = "https://idea-ai-resumelatex.hf.space/api/generate";
  const spinner = document.createElement("div");
  spinner.id = "spinner-overlay";
  spinner.innerHTML = `<div class="spinner-container"><div class="spinner"></div><p>Generating PDF...</p></div>`;
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
    logDebug("✅ PDF downloaded successfully.");
  } catch (error) {
    console.error(error);
    logDebug(`Failed to connect: ${error}`);
    alert("⚠️ Failed to connect to backend.\n" + error.message);
  } finally {
    document.getElementById("spinner-overlay")?.remove();
  }
}

// ------------------ Resume Upload & Parse ------------------
function handleResumeUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const ext = file.name.split(".").pop().toLowerCase();
  logDebug(`📂 Uploading file: ${file.name}`);

  if (ext === "pdf") parsePDF(file);
  else if (ext === "docx" || ext === "doc") parseDOCX(file);
  else alert("Unsupported file type. Please upload a PDF or DOCX file.");
}

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }

  logDebug("✅ PDF text extracted. Parsing resume...");
  parseResumeText(text);
}

async function parseDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  logDebug("✅ DOCX text extracted. Parsing resume...");
  parseResumeText(result.value);
}

// ------------------ Robust Parsing -----------------


function splitResumeSections(text) {
  //const lines = text.split(/\r?\n/);
  // 👇 Pre-normalize to collapse spaced-out all-caps words like "W ORK EXPERI ENC E"
  text = text.replace(/\b([A-Z])\s+(?=[A-Z]\b)/g, "$1");

  const lines = text.split(/\r?\n/);
  const sections = {
    header: [],
    education: [],
    experience: [],
    projects: [],
    skills: []
  };

  let currentSection = "header";

  // ✅ Full set of section markers
  const sectionMarkers = {
    education: [
      "education",
      "academic background",
      "studies",
      "qualifications",
      "certifications",
      "certification",
      "training",
      "academics"
    ],
    experience: [
      "experience",
      "employment",
      "work history",
      "professional experience",
      "career",
      "work experience",
      "positions",
      "roles",
      "employment history"
    ],
    projects: [
      "projects",
      "portfolio",
      "case studies",
      "accomplishments",
      "notable work",
      "personal projects",
      "research",
      "initiatives"
    ],
    skills: [
      "skills",
      "technical skills",
      "technologies",
      "competencies",
      "abilities",
      "tools",
      "languages",
      "proficiencies",
      "expertise"
    ]
  };

  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    // --- Normalize line ---
    let normalized = line
      .toLowerCase()
      .replace(/[^a-z&\s]/g, " ")   // keep letters and &
      .replace(/\s+/g, " ")         // collapse multiple spaces
      .trim();

    // --- Collapse broken OCR headings like "EDU CATION" → "education" ---
    normalized = normalized.replace(
      /\b(e d u c a t i o n|w o r k e x p e r i e n c e|p r o j e c t s|t e c h n i c a l s k i l l s)\b/g,
      m => m.replace(/\s+/g, "")
    );

    // --- Detect section markers ---
  
    let matchedSection = Object.keys(sectionMarkers).find(key =>
        sectionMarkers[key].some(marker =>
            normalized.replace(/\s+/g, "").includes(marker.replace(/\s+/g, ""))
        )
    );

    if (matchedSection) {
      currentSection = matchedSection;
      continue;
    }

    sections[currentSection].push(line);
  }

  logDebug("DEBUG: split sections = " + JSON.stringify(sections, null, 2));
  return sections;
}

async function parseResumeText(text) {
  try {
    logDebug("🧠 Parsing resume text...");


    // --- Fix missing newlines in flat PDFs ---
   let cleaned = text
       .replace(/\s{2,}/g, " ") // collapse extra spaces
       // Force newlines around section markers (even if glued to previous text)
       .replace(
       /(Education|Experience|Projects|Technical Skills|Certifications|Awards|Activities|Research|Training)/gi,
        "\n$1\n"
       )
       .replace(/\n{2,}/g, "\n"); // collapse multiple newlines
    logDebug("DEBUG: text length = " + cleaned.length);

    const sections = splitResumeSections(cleaned);

    const education = sections.education || [];
    const experience = sections.experience || [];
    const projects = sections.projects || [];
    const skills = sections.skills || [];

    logDebug("DEBUG education: " + JSON.stringify(education, null, 2));
    logDebug("DEBUG experience: " + JSON.stringify(experience, null, 2));
    logDebug("DEBUG projects: " + JSON.stringify(projects, null, 2));
    logDebug("DEBUG skills: " + JSON.stringify(skills, null, 2));

    // --- Safety guard: don't wipe UI if nothing parsed ---
    if (
      !education.length &&
      !experience.length &&
      !projects.length &&
      !skills.length
    ) {
      logDebug("⚠️ No resume sections found — skipping UI update");
      return;
    }

    // 🔧 Your existing UI population logic goes here
    // updateUISections(education, experience, projects, skills);

  } catch (err) {
    logDebug("❌ Error parsing resume text: " + err.message);
  }
}

function extractBasicInfo(headerLines) {
  const joined = headerLines.join(" ");
  const name = headerLines[0] || "Unknown";
  const email = joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = joined.match(/(\+?\d[\d .-]{8,}\d)/)?.[0] || "";
  const website = joined.match(/(https?:\/\/[^\s]+|linkedin\.com\/[^\s]+|github\.com\/[^\s]+)/i)?.[0] || "";

  return { name, contact: { email, phone, website } };
}

function extractEducation(lines) {
  const results = [];
  let current = {};

  for (const line of lines) {
    if (line.match(/\b(Bachelor|Master|Associate|Ph\.?D|Degree|Diploma)\b/i)) current.degree = line;
    else if (line.match(/\b(Aug\.?|Sep\.?|Jan\.?|May)\b/i) && line.match(/\d{4}/)) {
      current.dates = line;
      results.push({ ...current });
      current = {};
    } else if (!current.school) current.school = line;
    else if (!current.location) current.location = line;
  }

  return results;
}

function extractExperience(lines) {
  const results = [];
  let current = {};
  const flush = () => { if (Object.keys(current).length) { results.push({ ...current }); current = {}; } };

  for (const line of lines) {
    if (line.match(/\b(Present|[A-Z][a-z]+ \d{4})\b/)) current.dates = line;
    else if (line.startsWith("•")) {
      current.details = current.details || [];
      current.details.push(line.replace(/^•\s*/, ""));
    } else if (!current.title) current.title = line;
    else if (!current.company) current.company = line;
    else if (!current.location) current.location = line;
    else flush();
  }
  flush();
  return results;
}

function extractProjects(lines) {
  const results = [];
  let current = {};

  for (const line of lines) {
    if (line.startsWith("•")) current.description = (current.description || "") + " " + line.replace(/^•\s*/, "");
    else if (line.match(/\|/)) {
      if (Object.keys(current).length) results.push({ ...current });
      const [title, ...rest] = line.split("|");
      current = { title: title.trim(), description: rest.join("|").trim() };
    }
  }
  if (Object.keys(current).length) results.push(current);
  return results;
}

function extractSkills(lines) {
  const results = [];
  for (const line of lines) {
    const [category, rest] = line.split(":");
    if (rest) results.push({ category: category.trim(), items: rest.split(",").map(s => s.trim()).filter(Boolean) });
  }
  return results;
}

function parseResumeText(text) {

    logDebug("🧠 Parsing resume text...");

    // --- Fix missing newlines in flat PDFs ---
    let cleaned = text
      .replace(/\s{2,}/g, " ") // collapse excessive spaces
      .replace(
        /\s+(Education|Experience|Projects|Technical Skills|Certifications|Awards|Activities|Research|Training)\b/gi,
        "\n$1"
      )
      .replace(
        /\b(Education|Experience|Projects|Technical Skills|Certifications|Awards|Activities|Research|Training)\s+/gi,
        "$1\n"
      );

    logDebug("DEBUG: text length = " + cleaned.length);

    const sections = splitResumeSections(cleaned);

    const education = sections.education || [];
    const experience = sections.experience || [];
    const projects = sections.projects || [];
    const skills = sections.skills || [];

    logDebug("DEBUG education: " + JSON.stringify(education, null, 2));
    logDebug("DEBUG experience: " + JSON.stringify(experience, null, 2));
    logDebug("DEBUG projects: " + JSON.stringify(projects, null, 2));
    logDebug("DEBUG skills: " + JSON.stringify(skills, null, 2));

    // --- Safety guard: don't wipe UI if nothing parsed ---
    if (
      !education.length &&
      !experience.length &&
      !projects.length &&
      !skills.length
    ) {
      logDebug("⚠️ No resume sections found — skipping UI update");
      return;
    }

  
  const parsed = {
    name: basic.name,
    contact: basic.contact,
    education,
    experience,
    projects,
    skills
  };

  // Only update fields if values exist (avoid wiping UI)
  if (parsed.name) document.getElementById("name").value = parsed.name;
  if (parsed.contact?.email)
    document.getElementById("email").value = parsed.contact.email;
  if (parsed.contact?.phone)
    document.getElementById("phone").value = parsed.contact.phone;
  if (parsed.contact?.website)
    document.getElementById("website").value = parsed.contact.website;

  ["education", "experience", "projects", "skills"].forEach(id => {
    document.getElementById(`${id}-cards`).innerHTML = "";
  });

  if (education.length) education.forEach(addEducationCard);
  if (experience.length) experience.forEach(addExperienceCard);
  if (projects.length) projects.forEach(addProjectCard);
  if (skills.length) skills.forEach(addSkillCard);

  saveToLocalStorage();
  logDebug("🎯 Resume parsed and populated successfully.");
}

// ------------------ UI Render / Reset ------------------
function renderResume(data) {
  if (!data) return;
  clearAllCards();

  document.getElementById("name").value = data.name || "";
  document.getElementById("email").value = data.contact?.email || "";
  document.getElementById("phone").value = data.contact?.phone || "";
  document.getElementById("website").value = data.contact?.website || "";

  (data.education || []).forEach(addEducationCard);
  (data.experience || []).forEach(addExperienceCard);
  (data.projects || []).forEach(addProjectCard);
  (data.skills || []).forEach(addSkillCard);

  document.querySelectorAll(".section").forEach(section => setupCollapsible(section));
  document.querySelectorAll(".section").forEach(section => adjustSectionHeight(section));

  logDebug("Rendered resume to UI.");
}

function clearAllCards() {
  ["education-cards","experience-cards","projects-cards","skills-cards"].forEach(id => {
    const c = document.getElementById(id);
    if(c) c.innerHTML = "";
  });
}

function resetToDefault() {
  try { localStorage.removeItem("resumeData"); } catch(e){ console.warn(e); }
  renderResume(defaultResumeData);
  try { localStorage.setItem("resumeData", JSON.stringify(defaultResumeData)); logDebug("✅ Default saved to localStorage."); } 
  catch(e){ logDebug("⚠️ Failed to save default: "+e); }
}

// ------------------ Init ------------------
window.onload = () => {
  const resumeData = loadFromLocalStorage() || defaultResumeData;
  renderResume(resumeData);

  document.getElementById("add-education-btn")?.addEventListener("click", () => addEducationCard({}));
  document.getElementById("add-experience-btn")?.addEventListener("click", () => addExperienceCard({}));
  document.getElementById("add-project-btn")?.addEventListener("click", () => addProjectCard({}));
  document.getElementById("add-skill-btn")?.addEventListener("click", () => addSkillCard({}));

  document.getElementById("generate-btn")?.addEventListener("click", generatePDF);
  document.getElementById("reset-btn")?.addEventListener("click", () => { if(confirm("Reset resume to default?")) resetToDefault(); });
  document.getElementById("upload-resume")?.addEventListener("change", handleResumeUpload);

  ["name","email","phone","website"].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener("input", saveToLocalStorage);
  });

  logDebug("✅ Resume Builder initialized.");
};

// Expose functions
window.addEducationCard = addEducationCard;
window.addExperienceCard = addExperienceCard;
window.addProjectCard = addProjectCard;
window.addSkillCard = addSkillCard;
window.collectResumeData = collectResumeData;
window.generatePDF = generatePDF;
window.parseResumeText = parseResumeText;

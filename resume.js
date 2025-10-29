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

// ------------------ Utility functions ------------------
function createInput(value, placeholder, onChange) {
  const input = document.createElement("input");
  input.value = value || "";
  input.placeholder = placeholder;
  input.oninput = (e) => { onChange(e.target.value); saveToLocalStorage(); };
  return input;
}

function createTextarea(value, placeholder, onChange) {
  const textarea = document.createElement("textarea");
  textarea.value = value || "";
  textarea.placeholder = placeholder;
  textarea.oninput = (e) => { onChange(e.target.value); saveToLocalStorage(); };
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
  if (!content.classList.contains("collapsed")) {
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

// ------------------ Add Cards ------------------
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
  adjustSectionHeight(container.closest(".section"));
}

function addExperienceCard(data) {
  const container = document.getElementById("experience-cards");
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
  const card = document.createElement("div");
  card.className = "card";

  const categoryInput = createInput(data?.category, "Category", val => card.dataset.category = val);
  const itemsInput = createInput((data?.items || []).join(", "), "Comma-separated skills", val => card.dataset.items = val.split(",").map(s => s.trim()));

  card.append(categoryInput, itemsInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
  adjustSectionHeight(container.closest(".section"));
}

// ------------------ Collect Data ------------------
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

// ------------------ Generate PDF ------------------
async function generatePDF() {
  const resumeData = collectResumeData();
  logDebug("Sending data to backend...");

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

  if (ext === "pdf") {
    parsePDF(file);
  } else if (ext === "docx" || ext === "doc") {
    parseDOCX(file);
  } else {
    alert("Unsupported file type. Please upload a PDF or DOCX file.");
  }
}

// ---- PDF Parse using PDF.js ----
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

// ---- DOCX Parse using Mammoth ----
async function parseDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  const text = result.value;
  logDebug("✅ DOCX text extracted. Parsing resume...");
  parseResumeText(text);
}

// ---- Parse text into structured resume fields ----

function parseResumeText1(text) {
  logDebug("🧠 Attempting to extract fields and sections...");

  // Normalize text
  text = text.replace(/\r/g, "").trim();

  // --- Basic info ---
  const nameMatch = text.match(/^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+/);
  const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{8,}\d)/);
  const websiteMatch = text.match(/https?:\/\/[^\s]+|www\.[^\s]+/);

  if (nameMatch) document.getElementById("name").value = nameMatch[0];
  if (emailMatch) document.getElementById("email").value = emailMatch[0];
  if (phoneMatch) document.getElementById("phone").value = phoneMatch[0];
  if (websiteMatch) document.getElementById("website").value = websiteMatch[0];

  // --- Section segmentation ---
  const sections = splitIntoSections(text);

  // --- Populate sections ---
  populateEducation(sections.education);
  populateExperience(sections.experience);
  populateProjects(sections.projects);
  populateSkills(sections.skills);

  saveToLocalStorage();
  logDebug("✅ Resume data populated from uploaded file.");
}

function splitIntoSections(text) {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const sectionMap = { education: [], experience: [], projects: [], skills: [] };

  logDebug("🎓 Split into sections...");

  let current = null;
  for (let line of lines) {
    const low = line.toLowerCase();
    if (/^(education|academics)/i.test(line)) {
      current = "education";
      continue;
    }
    if (/^(experience|work history)/i.test(line)) {
      current = "experience";
      continue;
    }
    if (/^(projects|portfolio)/i.test(line)) {
      current = "projects";
      continue;
    }
    if (/^(skills|technical skills)/i.test(line)) {
      current = "skills";
      continue;
    }
    if (!current) {
      // fallback can assign to experience or education heuristically
      if (/school|university/i.test(line)) current = "education";
      else if (/engineer|developer|manager|intern/i.test(line)) current = "experience";
      else current = "skills";
    }
    sectionMap[current].push(line);
  }
  return sectionMap;
}

// ------------------ Normalizer + Debug Splitter ------------------
function normalizeResumeTextForSections(text) {
  // Normalize line endings and remove weird spacing
  let t = text.replace(/\r/g, "\n").replace(/\t/g, " ").replace(/[ \u00A0]+/g, " ");
  // Insert newlines around common section headings to help segmentation
  t = t.replace(/(\b(?:education|experience|employment|work history|projects|portfolio|skills|technical skills|certifications|education and qualifications)\b[:\s]?)/ig, "\n$1\n");
  // Collapse multiple newlines to a single separator
  t = t.replace(/\n{2,}/g, "\n");
  return t.trim();
}

function splitIntoSectionsWithDebug(text) {
  const normalized = normalizeResumeTextForSections(text);
  // Show a short preview of normalized text
  logDebug("---- Resume Text Preview (first 1000 chars) ----");
  logDebug(normalized.slice(0, 1000));
  console.log("Normalized resume text (preview):\n", normalized.slice(0, 1000));

  const lines = normalized.split(/\n+/).map(l => l.trim()).filter(Boolean);

  // Prepare containers
  const sections = { education: [], experience: [], projects: [], skills: [], other: [] };

  // markers for explicit header lines
  const headerMap = {
    education: /\b(education|academics|qualifications)\b/i,
    experience: /\b(experience|employment|work history|professional experience|career)\b/i,
    projects: /\b(projects|portfolio|selected projects|case studies)\b/i,
    skills: /\b(skills|technical skills|technologies|proficiencies)\b/i
  };

  // Current target section
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // If the line *looks like* a header, switch current
    if (headerMap.education.test(line)) { current = "education"; continue; }
    if (headerMap.experience.test(line)) { current = "experience"; continue; }
    if (headerMap.projects.test(line)) { current = "projects"; continue; }
    if (headerMap.skills.test(line)) { current = "skills"; continue; }

    // If no current, use heuristics
    if (!current) {
      if (/\b(university|college|b\.sc|bachelor|master|ph\.d|degree)\b/i.test(line)) current = "education";
      else if (/\b(engineer|developer|manager|consultant|intern|co-founder|director|company|inc\.|llc|corp|at)\b/i.test(line)) current = "experience";
      else if (/\b(project|built|developed|designed|created|implemented)\b/i.test(line)) current = "projects";
      else if (/\b(java(script)?|python|react|node|sql|html|css|d3|aws|azure|git)\b/i.test(line)) current = "skills";
      else current = "other";
    }

    sections[current].push(line);
  }

  // Debug output: counts + samples
  const report = {};
  ["education","experience","projects","skills","other"].forEach(key => {
    report[key] = {
      count: sections[key].length,
      sample: sections[key].slice(0, 8)
    };
  });

  logDebug("---- Section split report ----");
  Object.entries(report).forEach(([k,v]) => {
    logDebug(`${k.toUpperCase()}: ${v.count} lines`);
    v.sample.forEach((s, idx) => logDebug(`  ${idx+1}. ${s}`));
  });
  console.log("Section split report:", report);

  return sections;
}

// ------------------ Updated parseResumeText to use debug splitter ------------------
function parseResumeText(text) {
  logDebug("🧠 Attempting to extract fields and sections...");

  // Basic info (same as before)
  const nameMatch = text.match(/^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+/);
  const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{8,}\d)/);
  const websiteMatch = text.match(/https?:\/\/[^\s]+|www\.[^\s]+/);

  if (nameMatch) document.getElementById("name").value = nameMatch[0];
  if (emailMatch) document.getElementById("email").value = emailMatch[0];
  if (phoneMatch) document.getElementById("phone").value = phoneMatch[0];
  if (websiteMatch) document.getElementById("website").value = websiteMatch[0];

  // Use debug splitter
  const sections = splitIntoSectionsWithDebug(text);

  // Now call your populate functions (they must use correct IDs)
  populateEducation(sections.education);
  populateExperience(sections.experience);
  populateProjects(sections.projects);
  populateSkills(sections.skills);

  saveToLocalStorage();
  logDebug("✅ parseResumeText finished.");
}

// ------------------ Populate Sections ------------------
function populateEducation(lines = []) {
  if (!lines.length) return;
  logDebug("🎓 Parsing education section...");

  const eduContainer = document.getElementById("education-cards");
  if (!eduContainer) return;
  eduContainer.innerHTML = "";

  const items = lines.filter(line =>
    /(B\.?Sc|M\.?Sc|B\.?A|M\.?A|Ph\.?D|University|College|Degree)/i.test(line)
  );

  items.forEach(line => {
    addEducationCard({
      school: line,
      degree: line.match(/(B\.?Sc|M\.?Sc|Ph\.?D|Bachelor|Master|Degree)/i)?.[0] || "",
      dates: line.match(/\b(19|20)\d{2}\b(.*\b(19|20)\d{2}\b)?/)?.[0] || ""
    });
  });
}

function populateExperience(lines = []) {
  if (!lines.length) return;
  logDebug("💼 Parsing experience section...");

  const expContainer = document.getElementById("experience-cards");
  if (!expContainer) return;
  expContainer.innerHTML = "";

  const items = lines.filter(line =>
    /(Engineer|Developer|Manager|Director|Intern|Consultant|Company|Inc\.|LLC|Corp)/i.test(line)
  );

  items.forEach(line => {
    addExperienceCard({
      title: line.match(/(Engineer|Developer|Manager|Consultant|Lead|Intern)/i)?.[0] || "",
      company: line.match(/[A-Z][A-Za-z&.\s]+(Inc\.|LLC|Corp|Company)?/)?.[0] || "",
      dates: line.match(/\b(19|20)\d{2}.*(19|20)\d{2}\b/)?.[0] || "",
      details: [line]
    });
  });
}

function populateProjects(lines = []) {
  if (!lines.length) return;
  logDebug("🧩 Parsing projects section...");

  const projContainer = document.getElementById("projects-cards");
  if (!projContainer) return;
  projContainer.innerHTML = "";

  const items = lines.filter(line => /(project|developed|built|created|designed)/i.test(line));

  items.forEach(line => {
    addProjectCard({
      title: line.split(":")[0] || line.slice(0, 40),
      description: line
    });
  });
}

function populateSkills(lines = []) {
  if (!lines.length) return;
  logDebug("🛠️ Parsing skills section...");

  const skillContainer = document.getElementById("skills-cards");
  if (!skillContainer) return;
  skillContainer.innerHTML = "";

  const skillText = lines.join(" ");
  const skills = skillText.split(/,|\s{2,}/).map(s => s.trim()).filter(Boolean);

  if (!skills.length) return;

  addSkillCard({
    category: "Auto Extracted",
    items: skills.slice(0, 10)
  });
}

// ------------------ Initialize UI ------------------
window.onload = () => {
  let resumeData = loadFromLocalStorage() || defaultResumeData;

  document.getElementById("name").value = resumeData.name;
  document.getElementById("email").value = resumeData.contact.email;
  document.getElementById("phone").value = resumeData.contact.phone;
  document.getElementById("website").value = resumeData.contact.website;

  (resumeData.education || []).forEach(addEducationCard);
  (resumeData.experience || []).forEach(addExperienceCard);
  (resumeData.projects || []).forEach(addProjectCard);
  (resumeData.skills || []).forEach(addSkillCard);

  document.querySelectorAll(".section").forEach(section => setupCollapsible(section));

  document.getElementById("add-education-btn").onclick = () => addEducationCard({});
  document.getElementById("add-experience-btn").onclick = () => addExperienceCard({});
  document.getElementById("add-project-btn").onclick = () => addProjectCard({});
  document.getElementById("add-skill-btn").onclick = () => addSkillCard({});

  document.getElementById("generate-btn").onclick = generatePDF;

  ["name","email","phone","website"].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener("input", saveToLocalStorage);
  });

  logDebug("🚀 Resume UI initialized");

  const uploadInput = document.getElementById("upload-resume");
  if (uploadInput) {
    uploadInput.addEventListener("change", handleResumeUpload);
  }

  logDebug("✅ Resume Builder initialized and ready.");

};

// Export functions to global scope if needed
window.addEducationCard = addEducationCard;
window.addExperienceCard = addExperienceCard;
window.addProjectCard = addProjectCard;
window.addSkillCard = addSkillCard;
window.collectResumeData = collectResumeData;
window.generatePDF = generatePDF;

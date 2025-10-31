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

  const schoolInput = createInput(data?.school || "", "School Name", val => card.dataset.school = val);
  const locationInput = createInput(data?.location || "", "Location", val => card.dataset.location = val);
  const degreeInput = createInput(data?.degree || "", "Degree", val => card.dataset.degree = val);
  const datesInput = createInput(data?.dates || "", "Dates", val => card.dataset.dates = val);

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

  const titleInput = createInput(data?.title || "", "Job Title", val => card.dataset.title = val);
  const companyInput = createInput(data?.company || "", "Company", val => card.dataset.company = val);
  const locationInput = createInput(data?.location || "", "Location", val => card.dataset.location = val);
  const datesInput = createInput(data?.dates || "", "Dates", val => card.dataset.dates = val);
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

  const titleInput = createInput(data?.title || "", "Project Title", val => card.dataset.title = val);
  const descInput = createInput(data?.description || data?.desc || "", "Description", val => card.dataset.description = val);

  card.append(titleInput, descInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
  adjustSectionHeight(container.closest(".section"));
}

function addSkillCard(data) {
  const container = document.getElementById("skills-cards");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";
  const categoryInput = createInput(data?.category || "", "Category", val => card.dataset.category = val);
  const itemsInput = createInput((data?.items || []).join(", "), "Comma-separated skills", val => card.dataset.items = val.split(",").map(s => s.trim()));

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
    details: card.children[4].value.split("\n").map(s => s.trim()).filter(Boolean)
  }));

  const projects = Array.from(document.getElementById("projects-cards")?.children || []).map(card => ({
    title: card.children[0].value,
    description: card.children[1].value
  }));

  const skills = Array.from(document.getElementById("skills-cards")?.children || []).map(card => ({
    category: card.children[0].value,
    items: card.children[1].value.split(",").map(s => s.trim()).filter(Boolean)
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

// Improved splitter: handles OCR spaced headings, buffering for multi-line entries
function splitResumeSections(text) {
  // Collapse spaced-out all-caps words like "W ORK EXPERI ENC E"
  text = text.replace(/\b([A-Z])\s+(?=[A-Z]\b)/g, "$1");

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const sections = {
    header: [],
    education: [],
    experience: [],
    projects: [],
    skills: []
  };

  let currentSection = "header";
  let bufferEntry = null; // for merging multi-line entries

  const sectionMarkers = {
    education: ["education","academic background","studies","qualifications","certifications","certification","training","academics"],
    experience: ["experience","employment","work history","professional experience","career","work experience","positions","roles","employment history"],
    projects: ["projects","portfolio","case studies","accomplishments","notable work","personal projects","research","initiatives"],
    skills: ["skills","technical skills","technologies","competencies","abilities","tools","languages","proficiencies","expertise"]
  };

  const isSubheading = (line) => {
    // Detect date ranges like "Jun 2020 – Present" or "June 2019 - Aug 2020"
    return /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s?\d{4}\s*[-–]\s*(?:Present|\d{4})/i.test(line)
        || /\b\d{4}\s*[-–]\s*(?:Present|\d{4})/.test(line);
  };

  for (let i = 0; i < lines.length; i++) {
    let rawLine = lines[i];
    if (!rawLine) continue;

    // Normalize for section detection (letters + spaces only)
    let normalized = rawLine.toLowerCase().replace(/[^a-z&\s]/g, " ").replace(/\s+/g, " ").trim();

    // collapse spaced OCR headings like "E D U C A T I O N"
    normalized = normalized.replace(/\b(e d u c a t i o n|w o r k e x p e r i e n c e|p r o j e c t s|t e c h n i c a l s k i l l s)\b/g, m => m.replace(/\s+/g, ""));

    // find exact marker
    let matchedSection = Object.keys(sectionMarkers).find(key =>
      sectionMarkers[key].some(marker => normalized === marker)
    );

    // Also try word-boundary match if exact didn't hit (handles "technical skills" vs "technical skill")
    if (!matchedSection) {
      matchedSection = Object.keys(sectionMarkers).find(key =>
        sectionMarkers[key].some(marker => new RegExp("\\b" + marker.replace(/\s+/g, "\\s+") + "\\b", "i").test(rawLine))
      );
    }

    logDebug(`(line ${i}) + [${currentSection}] "${rawLine}"`);

    if (matchedSection) {
      if (bufferEntry) {
        sections[currentSection].push(bufferEntry);
        bufferEntry = null;
      }
      currentSection = matchedSection;
      logDebug(`→ Switching to section: ${matchedSection} (line ${i})`);
      continue;
    }

    // Handle experience/projects with subheadings (dates denote new entry)
    if (currentSection === "experience" || currentSection === "projects") {
      if (isSubheading(rawLine)) {
        if (bufferEntry) {
          sections[currentSection].push(bufferEntry);
        }
        bufferEntry = rawLine;
      } else {
        if (bufferEntry) bufferEntry += " " + rawLine;
        else bufferEntry = rawLine;
      }
    } else {
      sections[currentSection].push(rawLine);
    }
  }

  if (bufferEntry) sections[currentSection].push(bufferEntry);

  logDebug("DEBUG: split sections = " + JSON.stringify(sections, null, 2));
  return sections;
}

// ------------------ Extractors (Option B inline, robust) ------------------

function extractBasicInfo(headerLines) {
  const joined = (headerLines || []).join(" ");
  const nameMatch = joined.match(/^[A-Za-z][A-Za-z\s\-']{1,60}/);
  const name = nameMatch ? nameMatch[0].trim() : (headerLines[0] || "");
  const email = joined.match(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/)?.[1] || "";
  const phone = joined.match(/(\+?\d[\d .\-()]{7,}\d)/)?.[1] || "";
  const website = joined.match(/(https?:\/\/[^\s]+|linkedin\.com\/[^\s]+|github\.com\/[^\s]+)/i)?.[0] || "";

  logDebug(`Basic info extracted — name: ${name}, email: ${email}, phone: ${phone}, website: ${website}`);
  return { name, contact: { email, phone, website } };
}

function extractEducation(lines) {
  const results = [];
  if (!lines || !lines.length) return results;

  // Join lines and split heuristically by degree keywords or by double spaces
  const joined = lines.join(" | ");
  // Split where there is a degree or a university/college marker
  const parts = joined.split(/\s*(?=(?:Bachelor|Master|Associate|Ph\.?D|University|College|Diploma|Certificate)\b)/i);

  parts.forEach(p => {
    const text = p.trim();
    if (!text) return;
    // Try to extract institution, degree, dates, location
    const datesMatch = text.match(/(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s?\d{4}\b.*?(?:\b(?:Present|\d{4})\b)?)/i);
    const dates = datesMatch ? datesMatch[0].trim() : (text.match(/\b(19|20)\d{2}\b.*?(19|20)\d{2}\b/)?.[0] || "");
    const degree = text.match(/\b(Bachelor|Master|Associate|Ph\.?D|Diploma|Certificate|B\.Sc|BSc|M\.Sc|MS|BA|BS)\b/i)?.[0] || "";
    // institution: take leading part up to degree or date
    let institution = text.split(/Bachelor|Master|Associate|Ph\.?D|Diploma|Certificate|University|College/i)[0].trim();
    if (!institution) {
      // fallback: first 50 chars
      institution = text.slice(0, 60).trim();
    }
    // location: try to extract state/city pattern (comma + two-letter)
    const locationMatch = text.match(/([A-Za-z\s]+,\s*[A-Z]{2})/);
    const location = locationMatch ? locationMatch[0] : "";

    results.push({
      school: institution,
      degree: degree,
      dates: dates,
      location: location,
      raw: text
    });
  });

  return results;
}

function extractExperience(lines) {
  const results = [];
  if (!lines || !lines.length) return results;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // If line contains a pipe-separated project lookalike, skip (belongs to projects)
    // Try to extract title, company, dates, location, bullets
    // Split bullets if present
    const bullets = line.split(/•|·|–|-{2,}/).map(s => s.trim()).filter(Boolean);

    // Heuristics: If bullets length > 1 and first part contains dates, etc.
    // Try to extract dates
    const datesMatch = line.match(/(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s?\d{4}\b.*?(?:\b(?:Present|\d{4})\b)?)/i)
                    || line.match(/(\b\d{4}\b.*?(?:\b(?:Present|\d{4})\b)?)/);
    const dates = datesMatch ? datesMatch[0].trim() : "";

    // Attempt title/company extraction using ' - ' or ' | ' or line start heuristics
    let title = "", company = "", location = "", details = [];

    // If there's a comma before the dates, treat preceding part as title/company/location
    const beforeDates = dates ? line.split(dates)[0].trim() : line;
    // If ' at ' present, split title and company
    if (/ at /i.test(beforeDates)) {
      const [t, c] = beforeDates.split(/ at /i);
      title = t.trim();
      company = c.trim();
    } else if (/,/.test(beforeDates)) {
      // sometimes "Title, Company Location" or "Company, Location"
      const parts = beforeDates.split(",").map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        title = parts[0];
        company = parts[1];
        if (parts.length > 2) location = parts.slice(2).join(", ");
      } else {
        title = beforeDates;
      }
    } else {
      // fallback: split by double space
      const parts = beforeDates.split(/\s{2,}/).map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        title = parts[0];
        company = parts[1];
      } else {
        // if it's short (one or two words), treat as possible title
        title = beforeDates;
      }
    }

    // Details: everything after dates or bullets
    if (dates) {
      const after = line.split(dates)[1] || "";
      if (after.trim()) details = after.split(/•|·/).map(s => s.trim()).filter(Boolean);
    }
    if (!details.length && bullets.length > 1) {
      // treat bullets (excluding first which might be title/company) as details
      if (bullets.length > 1) details = bullets.slice(1);
      else details = bullets;
    }

    // If no company found, try to extract capitalized company-like word
    if (!company) {
      const companyGuess = line.match(/\b([A-Z][A-Za-z0-9&.\s]{2,40}(?:Inc|LLC|Corp|Company|Technologies|Solutions|Systems|Labs)?)\b/);
      if (companyGuess) company = companyGuess[0];
    }

    // final cleanup
    title = title.trim();
    company = company.trim();
    location = location.trim();
    details = details.map(s => s.replace(/^[\-\–\•\s]+/, "").trim()).filter(Boolean);

    results.push({
      title: title || "",
      company: company || "",
      location: location || "",
      dates: dates || "",
      details: details.length ? details : [line] // fallback: raw line as a single detail
    });
  }

  return results;
}

function extractProjects(lines) {
  const results = [];
  if (!lines || !lines.length) return results;

  // Combine lines and split on strong delimiters like "ProjectName |" or double newlines
  const joined = lines.join("\n");
  // split by patterns like "Name | techs" or blank-line separated blocks
  const parts = joined.split(/\n(?=[A-Z][^\n]{0,80}\s*\|)|\n{2,}/);

  for (const p of parts) {
    const text = p.trim();
    if (!text) continue;

    if (text.includes("|")) {
      const [titlePart, rest] = text.split("|", 2);
      const title = titlePart.trim();
      const desc = rest.trim().replace(/\s{2,}/g, " ");
      results.push({ title, description: desc });
    } else {
      // If bullets present, combine them to description
      const bullets = text.split(/•|·/).map(s => s.trim()).filter(Boolean);
      let title = "";
      let description = "";
      // If first line is short and uppercase-ish, use it as title
      const firstLine = text.split("\n")[0].trim();
      if (firstLine.length < 60 && /^[A-Z0-9][A-Za-z0-9\s\-:]{0,60}$/.test(firstLine)) {
        title = firstLine;
        description = text.split("\n").slice(1).join(" ").trim();
      } else {
        // fallback: title is first 40 chars
        title = text.slice(0, 40).trim();
        description = text;
      }
      // if bullets exist, prefer joining bullets for description
      if (bullets.length) description = bullets.join(" • ");
      results.push({ title, description });
    }
  }

  return results;
}

function extractSkills(lines) {
  const results = [];
  if (!lines || !lines.length) return results;

  // Join and split by known category markers if present
  const joined = lines.join(" | ");
  // Try splitting by categories
  const categories = joined.split(/\s*(?=Languages|Frameworks|Developer Tools|Libraries|Tools|Technologies)\s*[:|]/i);

  if (categories.length > 1) {
    categories.forEach(cat => {
      const m = cat.match(/(Languages|Frameworks|Developer Tools|Libraries|Tools|Technologies)[:|]?\s*(.*)/i);
      if (m) {
        const catName = m[1];
        const items = m[2].split(/,|·|•/).map(s => s.trim()).filter(Boolean);
        if (items.length) results.push({ category: catName, items });
      } else {
        // fallback: try comma-split
        const items = cat.split(/,|·|•/).map(s => s.trim()).filter(Boolean);
        if (items.length) results.push({ category: "Skills", items });
      }
    });
  } else {
    // fallback: split by comma and chunk into one category
    const items = joined.split(/,|·|•/).map(s => s.trim()).filter(Boolean);
    if (items.length) results.push({ category: "Auto Extracted", items });
  }

  return results;
}

// ------------------ Map sections to your UI cards (Option B) ------------------

function mapSectionsToForm(sections) {
  // Defensive: ensure sections object
  if (!sections) {
    logDebug("⚠️ mapSectionsToForm: no sections provided");
    return;
  }

  // Extract header basic info
  const basic = extractBasicInfo(sections.header || []);
  if (basic.name) document.getElementById("name").value = basic.name;
  if (basic.contact?.email) document.getElementById("email").value = basic.contact.email;
  if (basic.contact?.phone) document.getElementById("phone").value = basic.contact.phone;
  if (basic.contact?.website) document.getElementById("website").value = basic.contact.website;

  // Clear existing cards (only the sections we'll repopulate)
  ["education","experience","projects","skills"].forEach(id => {
    const c = document.getElementById(`${id}-cards`);
    if (c) c.innerHTML = "";
  });

  // Education
  const eduObjs = extractEducation(sections.education || []);
  if (eduObjs.length) {
    eduObjs.forEach(e => {
      addEducationCard({
        school: e.school || e.raw || "",
        location: e.location || "",
        degree: e.degree || "",
        dates: e.dates || ""
      });
    });
  }

  // Experience
  const expObjs = extractExperience(sections.experience || []);
  if (expObjs.length) {
    expObjs.forEach(e => {
      addExperienceCard({
        title: e.title || "",
        company: e.company || "",
        location: e.location || "",
        dates: e.dates || "",
        details: e.details || []
      });
    });
  }

  // Projects
  const projObjs = extractProjects(sections.projects || []);
  if (projObjs.length) {
    projObjs.forEach(p => {
      addProjectCard({
        title: p.title || p.name || "",
        description: p.description || ""
      });
    });
  }

  // Skills
  const skillObjs = extractSkills(sections.skills || []);
  if (skillObjs.length) {
    skillObjs.forEach(s => addSkillCard({ category: s.category || "Skills", items: s.items || [] }));
  }

  saveToLocalStorage();
  logDebug("🎯 mapSectionsToForm: populated UI from parsed resume.");
}

// ------------------ Main parseResumeText (integrated) ------------------

function parseResumeText(text) {
  try {
    logDebug("🧠 Parsing resume text...");

    if (!text || typeof text !== "string") {
      logDebug("⚠️ parseResumeText: empty or invalid input");
      return;
    }

    // Pre-clean: collapse long whitespace and insert newlines around common headings
    let cleaned = text
      .replace(/\r/g, "\n")
      .replace(/\t/g, " ")
      .replace(/\u00A0/g, " ")
      .replace(/[ \t]{2,}/g, " ")
      // Insert newline before/after common headings (case-insensitive)
      .replace(/\b(Education|Experience|Projects|Project|Technical Skills|Skills|Certifications|Awards|Activities|Research|Training)\b/gi, match => "\n" + match + "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();

    logDebug("DEBUG: text length = " + cleaned.length);

    // Split into sections
    const sections = splitResumeSections(cleaned);

    logDebug("DEBUG education: " + JSON.stringify(sections.education, null, 2));
    logDebug("DEBUG experience: " + JSON.stringify(sections.experience, null, 2));
    logDebug("DEBUG projects: " + JSON.stringify(sections.projects, null, 2));
    logDebug("DEBUG skills: " + JSON.stringify(sections.skills, null, 2));

    // Safety guard — don't wipe UI if nothing parsed
    if (
      (!sections.education || !sections.education.length) &&
      (!sections.experience || !sections.experience.length) &&
      (!sections.projects || !sections.projects.length) &&
      (!sections.skills || !sections.skills.length)
    ) {
      logDebug("⚠️ No resume sections found — skipping UI update");
      return;
    }

    // Map to UI
    mapSectionsToForm(sections);

  } catch (err) {
    logDebug("❌ Error parsing resume text: " + (err && err.message ? err.message : String(err)));
  }
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
window.parseResumeText = parseResumeText;o

//-----------------------------------------------------
// 🧩 Resume Parsing and Populating Script (Unified)
//-----------------------------------------------------

function splitResumeSections(text) {
  logDebug("🔍 Splitting resume sections (merged stable version)");

  // --- Normalize and clean ---
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
  let bufferEntry = null;

  const sectionMarkers = {
    education: [
      "education", "academic background", "studies", "qualifications",
      "certifications", "certification", "training", "academics"
    ],
    experience: [
      "experience", "employment", "work history", "professional experience",
      "career", "work experience", "positions", "roles", "employment history"
    ],
    projects: [
      "projects", "portfolio", "case studies", "accomplishments",
      "notable work", "personal projects", "initiatives"
    ],
    skills: [
      "skills", "technical skills", "technologies", "competencies",
      "abilities", "tools", "languages", "proficiencies", "expertise"
    ]
  };

  const isSubheading = (line) => {
    // Detects date-like patterns that indicate a new job/project block
    return /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s?\d{4}\s*[-–]\s*(?:Present|\d{4})/i.test(line);
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];

      // --- Education-specific cleanup ---
      if (currentSection === "education") {
          // collapse multiple spaces to avoid splitting dates/school info
          rawLine = rawLine.replace(/\s{2,}/g, " ");
      }

    // Normalize for section header detection
    let normalized = rawLine.toLowerCase().replace(/[^a-z&\s]/g, " ").replace(/\s+/g, " ").trim();

    // Fix spaced-out headers like "e d u c a t i o n"
    normalized = normalized.replace(/\b(e d u c a t i o n|w o r k e x p e r i e n c e|p r o j e c t s|t e c h n i c a l s k i l l s)\b/g, 
      m => m.replace(/\s+/g, "")
    );

    // --- Section header detection ---
    const matchedSection = Object.keys(sectionMarkers).find(key =>
      sectionMarkers[key].some(marker => normalized === marker)
    );

    if (matchedSection) {
      // Avoid switching on inline words like “Research Experience Assistant”
      if (rawLine.split(" ").length > 6) {
        // long line → likely not a pure section heading
        logDebug(`(line ${i}) ⚠️ Ignored false section: "${rawLine}"`);
      } else {
        if (bufferEntry) {
          sections[currentSection].push(bufferEntry);
          bufferEntry = null;
        }
        currentSection = matchedSection;
        logDebug(`(line ${i}) → Switching to section: ${matchedSection}`);
        continue;
      }
    }

    // --- Handle Experience/Projects buffering ---
    if (currentSection === "experience" || currentSection === "projects") {
      if (isSubheading(rawLine) || /^[A-Z]/.test(rawLine)) {
        if (bufferEntry) sections[currentSection].push(bufferEntry);
        bufferEntry = rawLine;
      } else {
        bufferEntry = bufferEntry ? bufferEntry + " " + rawLine : rawLine;
      }
    } else {
      sections[currentSection].push(rawLine);
    }

    logDebug(`(line ${i}) + [${currentSection}] "${rawLine}"`);
  }

  // --- Flush last buffered entry ---
  if (bufferEntry) sections[currentSection].push(bufferEntry);

  logDebug("DEBUG: split sections = " + JSON.stringify(sections, null, 2));
  return sections;
}


function extractBasicInfo(headerLines) {
  const joined = headerLines.join(" ");
  const name = headerLines[0] || "Unknown";
  const email = joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = joined.match(/(\+?\d[\d .-]{8,}\d)/)?.[0] || "";
  const website = joined.match(/(https?:\/\/[^\s]+|linkedin\.com\/[^\s]+|github\.com\/[^\s]+)/i)?.[0] || "";

  return { name, contact: { email, phone, website } };
}

// -------- extractEducation -----

function extractEducation(lines) {
  const results = [];
  
  // Regex for dates like "Aug. 2018 – May 2021"
  const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s?\d{4}\s*(?:[-–]\s*(?:Present|\d{4}))?/gi;

  // Regex to detect school names
  const schoolRegex = /([A-Z][\w\s.&']+(University|College|Institute|School))/i;

  // Regex to detect degree names
  const degreeRegex = /\b(Bachelor|Master|Associate|Ph\.?D|Diploma|Degree)[^,•\n]*/i;

  for (let line of lines) {
    if (!line.trim()) continue;

    // Split line into multiple schools if needed
    const parts = line.split(/(?=\b[A-Z][\w\s.&']+(University|College|Institute|School)\b)/g)
                      .map(p => p.trim())
                      .filter(Boolean);

    for (const part of parts) {
      const entry = {};

      // Extract dates
      const dates = part.match(dateRegex);
      if (dates) {
        entry.dates = dates.join(" – "); // join multiple dates if found
      }

      // Extract school
      const schoolMatch = part.match(schoolRegex);
      if (schoolMatch) entry.school = schoolMatch[0].trim();

      // Extract degree
      const degreeMatch = part.match(degreeRegex);
      if (degreeMatch) entry.degree = degreeMatch[0].trim();

      // Extract location (look for "City, ST" near school)
      const locationMatch = part.match(/\b[A-Z][a-z]+,\s*[A-Z]{2}\b/);
      if (locationMatch) entry.location = locationMatch[0].trim();

      // Only push if at least school or degree exists
      if (entry.school || entry.degree || entry.dates) results.push(entry);
    }
  }

  return results;
}

function extractExperience(lines) {
  const results = [];
  let current = null;

  const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s?\d{4}\s*(?:[-–]\s*(?:Present|\d{4}))?/i;

  for (const line of lines) {
    if (!line.trim()) continue;

    if (line.startsWith("•")) {
      if (current) current.details.push(line.replace(/^•\s*/, ""));
    } else {
      // New experience entry
      if (current) results.push(current);

      // Try to extract title + dates from first line
      let datesMatch = line.match(dateRegex);
      let dates = datesMatch ? datesMatch[0] : "";
      let titlePart = dates ? line.replace(dates, "").trim() : line.trim();

      // Split titlePart by " / " or " – " for possible company/location
      let parts = titlePart.split(/\/|–/).map(s => s.trim());
      let title = parts[0] || "";
      let company = parts[1] || "";
      let location = parts[2] || "";

      current = {
        title,
        company,
        location,
        dates,
        details: []
      };
    }
  }

  if (current) results.push(current);
  return results;
}

function extractProjects(lines) {
  const results = [];
  let current = null;

  const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s?\d{4}\s*(?:[-–]\s*(?:Present|\d{4}))?/i;

  for (const line of lines) {
    if (!line.trim()) continue;

    if (line.startsWith("•")) {
      // Add bullet to current project details
      if (current) current.details.push(line.replace(/^•\s*/, ""));
    } else if (line.includes("|")) {
      // New project entry with explicit title | description
      if (current) results.push(current);

      const [title, ...rest] = line.split("|");
      current = {
        title: title.trim(),
        description: rest.join("|").trim(),
        details: []
      };
    } else {
      // Possibly a title line with dates
      let datesMatch = line.match(dateRegex);
      let dates = datesMatch ? datesMatch[0] : "";
      let titlePart = dates ? line.replace(dates, "").trim() : line.trim();

      // Split by " / " or " – " to extract title & optional description
      let parts = titlePart.split(/\/|–/).map(s => s.trim());
      let title = parts[0] || "";
      let description = parts.slice(1).join(" | ") || "";

      if (current) results.push(current);
      current = {
        title,
        description: description + (dates ? " " + dates : ""),
        details: []
      };
    }
  }

  if (current) results.push(current);
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

async function parseResumeText(text) {
  try {
    logDebug("🧠 Parsing resume text resumeParser ver 2...");

    // --- Clean PDF text and force newlines around section markers ---
    let cleaned = text
      .replace(/\s{2,}/g, " ") // collapse extra spaces
      .replace(
        /\s+(Education|Experience|Projects|Technical Skills|Certifications|Awards|Activities|Research|Training)\b/gi,
        "\n$1\n"
      )
      .replace(/\n{2,}/g, "\n"); // collapse multiple newlines

    logDebug("DEBUG: text length = " + cleaned.length);

    // --- Split into sections ---
    const sections = splitResumeSections(cleaned);

    const headerLines = sections.header || [];
    const educationLines = sections.education || [];
    const experienceLines = sections.experience || [];
    const projectLines = sections.projects || [];
    const skillsLines = sections.skills || [];

   // logDebug("DEBUG: split sections = " + JSON.stringify(sections, null, 2));

    // --- Extract data from each section ---
    const basic = extractBasicInfo(headerLines);
    const education = extractEducation(educationLines);
    const experience = extractExperience(experienceLines);
    const projects = extractProjects(projectLines);
    const skills = extractSkills(skillsLines);

    logDebug("DEBUG basic: " + JSON.stringify(basic, null, 2));
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

    // --- Populate UI fields ---
    if (basic.name) document.getElementById("name").value = basic.name;
    if (basic.contact?.email) document.getElementById("email").value = basic.contact.email;
    if (basic.contact?.phone) document.getElementById("phone").value = basic.contact.phone;
    if (basic.contact?.website) document.getElementById("website").value = basic.contact.website;

    ["education", "experience", "projects", "skills"].forEach(id => {
      document.getElementById(`${id}-cards`).innerHTML = "";
    });

    if (education.length) education.forEach(addEducationCard);
    if (experience.length) experience.forEach(addExperienceCard);
    if (projects.length) projects.forEach(addProjectCard);
    if (skills.length) skills.forEach(addSkillCard);

    // --- Save to localStorage ---
    saveToLocalStorage();

    logDebug("🎯 Resume parsed and populated successfully.");
  } catch (err) {
    logDebug("❌ Error parsing resume text: " + err.message);
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

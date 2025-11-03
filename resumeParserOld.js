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
  let bufferEntry = null; // string accumulator for experience/projects

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

  const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s?\d{4}\s*(?:[-–]\s*(?:Present|\d{4}))?/i;
  const companyOrSchoolRegex = /\b(University|College|Institute|School|Inc|LLC|Ltd|Corp|Corporation|Company)\b/i;
  const isSubheading = (line) => dateRegex.test(line);

  for (let i = 0; i < lines.length; i++) {
    let rawLine = lines[i];

    // --- Education-specific small cleanup (preserve spacing for parsing) ---
    if (currentSection === "education") {
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
        logDebug(`(line ${i}) ⚠️ Ignored false section: "${rawLine}"`);
      } else {
        // flush any buffered entry for previous section
        if (bufferEntry) {
          sections[currentSection].push(bufferEntry.trim());
          bufferEntry = null;
        }
        currentSection = matchedSection;
        logDebug(`(line ${i}) → Switching to section: ${matchedSection}`);
        continue;
      }
    }

    // --- Handle Experience/Projects buffering (NEW safer logic) ---
    if (currentSection === "experience" || currentSection === "projects") {
      // If this line is a bullet, append as detail to current buffer (if any),
      // or start a new buffer with the bullet if none present.
      if (rawLine.startsWith("•")) {
        if (!bufferEntry) bufferEntry = "";
        bufferEntry = bufferEntry ? bufferEntry + " " + rawLine : rawLine;
        // bullets usually indicate continuation; don't flush immediately
        continue;
      }

      // If the line contains a date OR a company/school token OR a project '|' delimiter,
      // treat it as a strong boundary marker — append to the buffer and then flush it as one entry.
      if (dateRegex.test(rawLine) || companyOrSchoolRegex.test(rawLine) || rawLine.includes("|")) {
        bufferEntry = bufferEntry ? bufferEntry + " " + rawLine : rawLine;
        sections[currentSection].push(bufferEntry.trim());
        bufferEntry = null;
        continue;
      }

      // Otherwise this is likely part of the title/description — accumulate it.
      bufferEntry = bufferEntry ? bufferEntry + " " + rawLine : rawLine;
      // do not flush yet; wait for a date/company/bullet to mark the end
      logDebug(`(line ${i}) (buffering ${currentSection}) "${rawLine}"`);
      continue;
    }

    // --- Default: push into the current non-experience/projects section directly ---
    sections[currentSection].push(rawLine);
    logDebug(`(line ${i}) + [${currentSection}] "${rawLine}"`);
  }

  // --- Flush last buffered entry (if any) ---
  if (bufferEntry) sections[currentSection].push(bufferEntry.trim());

  logDebug("DEBUG: split sections = " + JSON.stringify(sections, null, 2));
  return sections;
}

function splitResumeSectionsOld(text) {
  logDebug(" 💐💐 resumeParser ver 3.2....");

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
    let rawLine = lines[i];

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
       // logDebug(`(line ${i}) ⚠️ Ignored false section: "${rawLine}"`);
      } else {
        if (bufferEntry) {
          sections[currentSection].push(bufferEntry);
          bufferEntry = null;
        }
        currentSection = matchedSection;
        //logDebug(`(line ${i}) → Switching to section: ${matchedSection}`);
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

 // logDebug("DEBUG: split sections = " + JSON.stringify(sections, null, 2));
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

  // 🧹 Normalize input (support both array or raw string)
  let text = Array.isArray(lines) ? lines.join("\n") : (lines || "");
  if (!text.trim()) return results;

  // --- Regex definitions ---
  const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s?\d{4}(?:\s*[-–]\s*(?:Present|\d{4}))?/gi;
  const schoolRegex = /([A-Z][\w\s.&'’-]+(?:University|College|Institute|School|Academy|Polytechnic))/i;
  const degreeRegex = /\b(Bachelor(?:'s)?|Master(?:'s)?|Associate(?:'s)?|Ph\.?D|Diploma|Degree|B\.A\.|B\.S\.|M\.S\.|M\.A\.)[^,•\n]*/i;
  const locationRegex = /\b[A-Z][a-zA-Z.\- ]+,\s*[A-Z]{2}\b/; // e.g. "Georgetown, TX"

  // --- Split into logical education blocks ---
  // Split at school-like tokens, but keep any leading text with the school token.
  const chunks = text
    .split(/(?=\b[A-Z][\w\s.&'’-]+(?:University|College|Institute|School|Academy|Polytechnic)\b)/g)
    .map(p => p.trim())
    .filter(Boolean);

  for (const rawPart of chunks) {
    // Work on a copy
    const part = rawPart.replace(/\s+/g, " ").trim();
    if (!part) continue;

    // Extract dates first (may be multiple)
    const datesFound = Array.from(part.matchAll(dateRegex)).map(m => m[0].trim());
    const dates = datesFound.length ? datesFound.join(" – ") : "";

    // Remove date substrings from a cleaned copy so degree/school extraction is not polluted
    let clean = part.replace(dateRegex, "").replace(/\s{2,}/g, " ").trim();

    // Extract school
    const schoolMatch = clean.match(schoolRegex);
    const school = schoolMatch ? schoolMatch[0].trim() : "";

    // Extract location (prefer a location near the school name if possible)
    // Try to find a location substring after the school name in original part
    let location = "";
    if (school) {
      const afterSchool = part.slice(part.indexOf(school) + school.length);
      const locMatch = afterSchool.match(locationRegex) || part.match(locationRegex);
      if (locMatch) location = locMatch[0].trim();
    } else {
      const locMatch = part.match(locationRegex);
      if (locMatch) location = locMatch[0].trim();
    }

    // Extract degree from cleaned (dates removed)
    let degree = "";
    const degreeMatch = clean.match(degreeRegex);
    if (degreeMatch) {
      degree = degreeMatch[0].trim();
      // strip trailing punctuation or stray year fragments
      degree = degree.replace(/[,;:.–\-\d]+$/, "").trim();
    } else {
      // As fallback, look for "Minor in ..." or "Major: ..." or common patterns
      const minorMatch = clean.match(/\b(Minor in|Minor:|Major in|Concentration in)\s+([^,\n]+)/i);
      if (minorMatch) degree = (minorMatch[0] || "").trim();
    }

    const entry = {};
    if (school) entry.school = school;
    if (degree) entry.degree = degree;
    if (location) entry.location = location;
    if (dates) entry.dates = dates;

    // If chunk contains only a date (no school/degree), push a minimal entry for later merge
    if (!entry.school && !entry.degree && entry.dates) {
      results.push({ dates: entry.dates });
    } else if (entry.school || entry.degree || entry.dates || entry.location) {
      results.push(entry);
    }
  }

  // --- Post-process: merge date-only fragments into previous result when appropriate ---
  for (let i = 0; i < results.length; i++) {
    const e = results[i];
    if ((!e.school && !e.degree) && e.dates) {
      // merge into previous if exists
      if (i > 0) {
        const prev = results[i - 1];
        // if prev has dates and the current dates look like an end-year, try to combine intelligently
        if (prev.dates && !prev.dates.includes("–") && e.dates) {
          prev.dates = prev.dates + " – " + e.dates;
        } else if (!prev.dates) {
          prev.dates = e.dates;
        } else {
          // as fallback, append with " / "
          prev.dates = prev.dates + " / " + e.dates;
        }
        // mark for removal
        e._remove = true;
      }
    }
  }
  // remove marked
  const filtered = results.filter(r => !r._remove);

  // Final tidy: normalize whitespace in dates and trim fields
  filtered.forEach(r => {
    if (r.dates) r.dates = r.dates.replace(/\s+/g, " ").replace(/\s*–\s*/, " – ").trim();
    if (r.degree) r.degree = r.degree.replace(/\s+/g, " ").trim();
    if (r.school) r.school = r.school.replace(/\s+/g, " ").trim();
    if (r.location) r.location = r.location.replace(/\s+/g, " ").trim();
  });

  //logDebug("DEBUG education: " + JSON.stringify(filtered, null, 2));
  return filtered;
}

// ------- extractExperience ----
// -------- extractExperience ---------
function extractExperience(lines) {
  const results = [];
  const text = Array.isArray(lines) ? lines.join("\n") : lines || "";

  if (!text.trim()) return results;

  // Regex to match dates like "June 2020 – Present" or "Sep. 2018 – May 2021"
  const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s?\d{4}\s*(?:[-–]\s*(?:Present|\d{4}))?/gi;

  // Split by line breaks or bullet points
  const chunks = text.split(/(?:\n|•)/).map(l => l.trim()).filter(Boolean);

  let buffer = null;

  for (const chunk of chunks) {
    // Skip small fragments
    if (chunk.length < 3) continue;

    const entry = { title: "", company: "", location: "", dates: "", details: [] };

    // Extract dates first
    const datesMatch = chunk.match(dateRegex);
    if (datesMatch) {
      entry.dates = datesMatch.join(" – ");
    }

    // Attempt to extract location (last "City, ST" before details)
    const locMatch = chunk.match(/\b[A-Z][a-z]+,\s*[A-Z]{2}\b/);
    if (locMatch) entry.location = locMatch[0].trim();

    // Extract title and company heuristically:
    // Take text before first date as "title/company block"
    let preDate = chunk.split(entry.dates)[0].trim();
    if (preDate) {
      // Try splitting by known delimiters like "at" or capitalized company patterns
      const atSplit = preDate.split(/\s+at\s+/i);
      if (atSplit.length === 2) {
        entry.title = atSplit[0].trim();
        entry.company = atSplit[1].trim();
      } else {
        // fallback: first capitalized phrase(s) as title, rest as company
        const words = preDate.split(" ");
        let idx = 0;
        while (idx < words.length && /^[A-Z]/.test(words[idx])) idx++;
        entry.title = words.slice(0, idx).join(" ").trim();
        entry.company = words.slice(idx).join(" ").trim();
      }
    }

    // Everything after dates can be treated as details
    const postDate = chunk.split(entry.dates)[1] || "";
    if (postDate.trim()) {
      entry.details = postDate.split(/•/).map(d => d.trim()).filter(Boolean);
    }

    // Merge with previous buffer if it looks like continuation (no title)
    if (buffer && !entry.title) {
      buffer.details.push(...[entry.company, ...entry.details].filter(Boolean));
    } else {
      if (entry.title || entry.company || entry.details.length) results.push(entry);
      buffer = entry;
    }
  }

  logDebug("DEBUG experience: " + JSON.stringify(results, null, 2));
  return results;
}

// -------- extractProjects ---------
function extractProjects(lines) {
  const results = [];
  const text = Array.isArray(lines) ? lines.join("\n") : lines || "";

  if (!text.trim()) return results;

  // Split projects by either newlines or pipe (|) boundaries
  const chunks = text.split(/\n|(?=\|)/).map(l => l.trim()).filter(Boolean);

  for (const chunk of chunks) {
    if (chunk.length < 3) continue;

    const entry = { title: "", description: "", technologies: [], dates: "" };

    // Attempt to split title | tech | date
    const pipeSplit = chunk.split("|").map(p => p.trim());
    if (pipeSplit.length >= 2) {
      entry.title = pipeSplit[0];
      entry.technologies = pipeSplit[1].split(/,|\s+/).map(t => t.trim()).filter(Boolean);
      entry.description = pipeSplit.slice(2).join(" | ").trim();
    } else {
      // fallback: take first capitalized phrase as title, rest as description
      const words = chunk.split(" ");
      let idx = 0;
      while (idx < words.length && /^[A-Z]/.test(words[idx])) idx++;
      entry.title = words.slice(0, idx).join(" ").trim();
      entry.description = words.slice(idx).join(" ").trim();
    }

    // Attempt to extract dates from description
    const dateMatch = entry.description.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s?\d{4}\s*(?:[-–]\s*(?:Present|\d{4}))?/gi);
    if (dateMatch) {
      entry.dates = dateMatch.join(" – ");
      entry.description = entry.description.replace(dateMatch.join("|"), "").trim();
    }

    results.push(entry);
  }

  logDebug("DEBUG projects: " + JSON.stringify(results, null, 2));
  return results;
}

// -------- extractProjects -----


// ------- extractSkills ------

function extractSkills(lines) {
  const results = [];
  for (const line of lines) {
    const [category, rest] = line.split(":");
    if (rest) results.push({ category: category.trim(), items: rest.split(",").map(s => s.trim()).filter(Boolean) });
  }
  return results;
}

async function parseResumeTextOld(text) {
  try {
    logDebug("🧠 Parsing resume text resumeParser ver 3 ...");

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

async function parseResumeText(pdfFile) {
  try {
    logDebug("🚀 Sending PDF to backend /api/generate for parsing...");

    if (!pdfFile) {
      logDebug("⚠️ No file provided.");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);

    // ⬇️ CHANGE this to your actual backend endpoint
    const API_URL = "https://idea-ai-parseresume.hf.space/api/generate";

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const parsed = await response.json();
    logDebug("✅ Received parsed JSON:", parsed);

    // --- Safety guard ---
    if (!parsed || Object.keys(parsed).length === 0) {
      logDebug("⚠️ Empty response from server.");
      return;
    }

    // --- Populate UI fields ---
    if (parsed.name) document.getElementById("name").value = parsed.name;
    if (parsed.contact?.email) document.getElementById("email").value = parsed.contact.email;
    if (parsed.contact?.phone) document.getElementById("phone").value = parsed.contact.phone;
    if (parsed.contact?.website) document.getElementById("website").value = parsed.contact.website;

    ["education", "experience", "projects", "skills"].forEach(id => {
      document.getElementById(`${id}-cards`).innerHTML = "";
    });

    if (parsed.education?.length) parsed.education.forEach(addEducationCard);
    if (parsed.experience?.length) parsed.experience.forEach(addExperienceCard);
    if (parsed.projects?.length) parsed.projects.forEach(addProjectCard);
    if (parsed.skills?.length) parsed.skills.forEach(addSkillCard);

    saveToLocalStorage();
    logDebug("🎯 Resume parsed and populated successfully via API.");

  } catch (err) {
    logDebug("❌ Error during resume parsing: " + err.message);
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

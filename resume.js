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
  logBox.value += message + "\n";
  logBox.scrollTop = logBox.scrollHeight;
}

// ------------------ Storage ------------------
function saveToLocalStorage() {
  localStorage.setItem("resumeData", JSON.stringify(collectResumeData()));
  logDebug("✅ Auto-saved resume data.");
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("resumeData");
  if (!data) return null;
  return JSON.parse(data);
}

// ------------------ Utility to create inputs ------------------
function createInput(value, placeholder, onChange) {
  const input = document.createElement("input");
  input.value = value || "";
  input.placeholder = placeholder;
  input.oninput = (e) => {
    onChange(e.target.value);
    saveToLocalStorage();
    adjustSectionHeight(input.closest(".section-content"));
  };
  return input;
}

function createTextarea(value, placeholder, onChange) {
  const textarea = document.createElement("textarea");
  textarea.value = value || "";
  textarea.placeholder = placeholder;
  textarea.oninput = (e) => {
    onChange(e.target.value);
    saveToLocalStorage();
    adjustSectionHeight(textarea.closest(".section-content"));
  };
  return textarea;
}

// ------------------ Utility to create remove button ------------------
function createRemoveButton(card) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Remove";
  btn.className = "remove-btn";
  btn.onclick = () => {
    card.remove();
    saveToLocalStorage();
    adjustSectionHeight(card.closest(".section-content"));
  };
  return btn;
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

  card.append(schoolInput, locationInput, degreeInput, datesInput, createRemoveButton(card));
  container.appendChild(card);
  adjustSectionHeight(container.closest(".section-content"));
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

  card.append(titleInput, companyInput, locationInput, datesInput, detailsInput, createRemoveButton(card));
  container.appendChild(card);
  adjustSectionHeight(container.closest(".section-content"));
}

function addProjectCard(data) {
  const container = document.getElementById("projects-cards");
  const card = document.createElement("div");
  card.className = "card";

  const titleInput = createInput(data?.title, "Project Title", val => card.dataset.title = val);
  const descInput = createTextarea(data?.description, "Description", val => card.dataset.description = val);

  card.append(titleInput, descInput, createRemoveButton(card));
  container.appendChild(card);
  adjustSectionHeight(container.closest(".section-content"));
}

function addSkillCard(data) {
  const container = document.getElementById("skills-cards");
  const card = document.createElement("div");
  card.className = "card";

  const categoryInput = createInput(data?.category, "Category", val => card.dataset.category = val);
  const itemsInput = createInput((data?.items || []).join(", "), "Comma-separated skills", val => card.dataset.items = val.split(",").map(s => s.trim()));

  card.append(categoryInput, itemsInput, createRemoveButton(card));
  container.appendChild(card);
  adjustSectionHeight(container.closest(".section-content"));
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

// ------------------ PDF ------------------
async function generatePDF() {
  const resumeData = collectResumeData();
  logDebug("Sending data to backend...");
  logDebug(JSON.stringify(resumeData, null, 2));

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
      logDebug(`Error: ${errText}`);
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
    logDebug("✅ PDF downloaded.");
  } catch (err) {
    console.error(err);
    logDebug(`Failed to connect: ${err}`);
    alert("⚠️ Failed to connect to backend.\n" + err.message);
  } finally {
    document.getElementById("spinner-overlay")?.remove();
  }
}

// ------------------ Collapsible Sections ------------------
function setupCollapsible(section) {
  const headerDiv = section.querySelector(".section-header");
  const content = section.querySelector(".section-content");
  const icon = headerDiv.querySelector(".toggle-icon");
  if (!headerDiv || !content || !icon) return;

  // Initial state
  content.style.maxHeight = content  .classList.contains("collapsed") ? "0" : content.scrollHeight + "px";
  icon.textContent = content.classList.contains("collapsed") ? "+" : "−";

  // Toggle on click
  headerDiv.addEventListener("click", () => {
    const isCollapsed = content.classList.toggle("collapsed");
    content.style.maxHeight = isCollapsed ? "0" : content.scrollHeight + "px";
    icon.textContent = isCollapsed ? "+" : "−";
  });
}

// ------------------ Adjust Section Height Dynamically ------------------
function adjustSectionHeight(sectionContent) {
  if (!sectionContent) return;
  sectionContent.style.maxHeight = sectionContent.classList.contains("collapsed") ? "0" : sectionContent.scrollHeight + "px";
}

// ------------------ Initialize UI ------------------
window.onload = () => {
  let resumeData = loadFromLocalStorage();
  if (resumeData) {
    logDebug("✅ Loaded resume from storage.");
  } else {
    logDebug("ℹ️ No saved data found, using defaultResumeData.");
    resumeData = defaultResumeData;
  }

  // Populate basic info
  document.getElementById("name").value = resumeData.name;
  document.getElementById("email").value = resumeData.contact.email;
  document.getElementById("phone").value = resumeData.contact.phone;
  document.getElementById("website").value = resumeData.contact.website;

  // Populate sections
  resumeData.education.forEach(addEducationCard);
  resumeData.experience.forEach(addExperienceCard);
  resumeData.projects.forEach(addProjectCard);
  resumeData.skills.forEach(addSkillCard);

  // Setup collapsible sections
  document.querySelectorAll(".section").forEach(section => setupCollapsible(section));

  // Attach button handlers
  document.getElementById("generate-btn").onclick = generatePDF;
  document.getElementById("add-education-btn").onclick = () => addEducationCard({});
  document.getElementById("add-experience-btn").onclick = () => addExperienceCard({});
  document.getElementById("add-project-btn").onclick = () => addProjectCard({});
  document.getElementById("add-skill-btn").onclick = () => addSkillCard({});

  // Auto-save for basic info
  ["name", "email", "phone", "website"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", saveToLocalStorage);
  });
};

// ------------------ Export functions globally for HTML buttons ------------------
window.addEducationCard = addEducationCard;
window.addExperienceCard = addExperienceCard;
window.addProjectCard = addProjectCard;
window.addSkillCard = addSkillCard;
window.collectResumeData = collectResumeData;
window.generatePDF = generatePDF;
window.logDebug = logDebug;

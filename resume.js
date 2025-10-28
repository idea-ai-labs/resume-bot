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
  if (logBox) {
    logBox.value += message + "\n";
    logBox.scrollTop = logBox.scrollHeight;
  }
}

// ------------------ Local Storage Helpers ------------------
function saveToLocalStorage() {
  const resumeData = collectResumeData();
  localStorage.setItem("nextgen_resume_data", JSON.stringify(resumeData));
  logDebug("Auto-saved resume data to localStorage.");
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("nextgen_resume_data");
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse saved resume data:", e);
      return null;
    }
  }
  return null;
}

// ------------------ Utility to create inputs ------------------
function createInput(value, placeholder, onChange) {
  const input = document.createElement("input");
  input.value = value || "";
  input.placeholder = placeholder;
  input.oninput = (e) => onChange(e.target.value);
  return input;
}

// ------------------ Utility to create remove button ------------------
function createRemoveButton(card) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Remove";
  btn.className = "remove-btn";
  btn.onclick = () => { card.remove(); saveToLocalStorage(); };
  return btn;
}

// ------------------ Education ------------------
function addEducationCard(data) {
  const container = document.getElementById("education-cards");
  const card = document.createElement("div");
  card.className = "card";

  const schoolInput = createInput(data?.school, "School Name", val => { card.dataset.school = val; saveToLocalStorage(); });
  const locationInput = createInput(data?.location, "Location", val => { card.dataset.location = val; saveToLocalStorage(); });
  const degreeInput = createInput(data?.degree, "Degree", val => { card.dataset.degree = val; saveToLocalStorage(); });
  const datesInput = createInput(data?.dates, "Dates", val => { card.dataset.dates = val; saveToLocalStorage(); });

  card.append(schoolInput, locationInput, degreeInput, datesInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
}

// ------------------ Experience ------------------
function addExperienceCard(data) {
  const container = document.getElementById("experience-cards");
  const card = document.createElement("div");
  card.className = "card";

  const titleInput = createInput(data?.title, "Job Title", val => { card.dataset.title = val; saveToLocalStorage(); });
  const companyInput = createInput(data?.company, "Company", val => { card.dataset.company = val; saveToLocalStorage(); });
  const locationInput = createInput(data?.location, "Location", val => { card.dataset.location = val; saveToLocalStorage(); });
  const datesInput = createInput(data?.dates, "Dates", val => { card.dataset.dates = val; saveToLocalStorage(); });

  const detailsInput = document.createElement("textarea");
  detailsInput.placeholder = "Details (one per line)";
  detailsInput.value = (data?.details || []).join("\n");
  detailsInput.oninput = (e) => { card.dataset.details = e.target.value.split("\n"); saveToLocalStorage(); };

  card.append(titleInput, companyInput, locationInput, datesInput, detailsInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
}

// ------------------ Projects ------------------
function addProjectCard(data) {
  const container = document.getElementById("projects-cards");
  const card = document.createElement("div");
  card.className = "card";

  const titleInput = createInput(data?.title, "Project Title", val => { card.dataset.title = val; saveToLocalStorage(); });
  const descInput = createInput(data?.description, "Description", val => { card.dataset.description = val; saveToLocalStorage(); });

  card.append(titleInput, descInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
}

// ------------------ Skills ------------------
function addSkillCard(data) {
  const container = document.getElementById("skills-cards");
  const card = document.createElement("div");
  card.className = "card";

  const categoryInput = createInput(data?.category, "Category", val => { card.dataset.category = val; saveToLocalStorage(); });
  const itemsInput = createInput((data?.items || []).join(", "), "Comma-separated skills", val => { card.dataset.items = val.split(",").map(s => s.trim()); saveToLocalStorage(); });

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

// ------------------ Generate PDF ------------------
async function generatePDF() {
  const resumeData = collectResumeData();
  logDebug("Sending data to backend...");
  logDebug("Resume JSON: " + JSON.stringify(resumeData, null, 2));

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
    logDebug("PDF downloaded successfully.");
  } catch (error) {
    console.error("Failed to connect:", error);
    logDebug(`Failed to connect: ${error}`);
    alert("⚠️ Failed to connect to backend.\n" + error.message);
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

// ------------------ Initialize UI ------------------
window.onload = () => {
  const savedData = loadFromLocalStorage();
  const resumeData = savedData || defaultResumeData;

  // Basic Info
  document.getElementById("name").value = resumeData.name;
  document.getElementById("email").value = resumeData.contact.email;
  document.getElementById("phone").value = resumeData.contact.phone;
  document.getElementById("website").value = resumeData.contact.website;

  // Populate cards
  resumeData.education.forEach(addEducationCard);
  resumeData.experience.forEach(addExperienceCard);
  resumeData.projects.forEach(addProjectCard);
  resumeData.skills.forEach(addSkillCard);

  // Setup collapsibles
  document.querySelectorAll(".section").forEach(section => setupCollapsible(section));

  // Buttons
  document.getElementById("generate-btn").onclick = generatePDF;
  document.getElementById("add-education-btn").onclick = () => { addEducationCard({}); saveToLocalStorage(); };
  document.getElementById("add-experience-btn").onclick = () => { addExperienceCard({}); saveToLocalStorage(); };
  document.getElementById("add-project-btn").onclick = () => { addProjectCard({}); saveToLocalStorage(); };
  document.getElementById("add-skill-btn").onclick = () => { addSkillCard({}); saveToLocalStorage(); };

  // Auto-save Basic Info
  ["name", "email", "phone", "website"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", saveToLocalStorage);
  });
};

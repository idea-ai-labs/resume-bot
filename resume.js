// ------------------ Default Resume Data ------------------
const defaultResumeData = {
  name: "Jake Ryan",
  contact: {
    email: "jake@su.edu",
    phone: "123-456-7890",
    website: "https://linkedin.com/in/jake"
  },
  education: [
    { school: "Southwestern University", location: "Georgetown, TX", degree: "Bachelor of Arts in Computer Science, Minor in Business", dates: "Aug. 2018 -- May 2021" },
    { school: "Blinn College", location: "Bryan, TX", degree: "Associate's in Liberal Arts", dates: "Aug. 2014 -- May 2018" }
  ],
  experience: [
    { title: "Undergraduate Research Assistant", company: "Texas A&M University", location: "College Station, TX", dates: "June 2020 -- Present", details: ["Developed REST API using FastAPI", "Full-stack web app with React & Flask"] }
  ],
  projects: [
    { title: "Gitlytics", description: "Full-stack web app using Flask + React" }
  ],
  skills: [
    { category: "Languages", items: ["Java", "Python", "C/C++", "SQL", "JavaScript"] }
  ]
};

// ------------------ Debug Log ------------------
function logDebug(message) {
  const logBox = document.getElementById("log-box");
  logBox.value += message + "\n";
  logBox.scrollTop = logBox.scrollHeight;
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
  btn.onclick = () => card.remove();
  return btn;
}

// ------------------ Education ------------------
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
}

// ------------------ Experience ------------------
function addExperienceCard(data) {
  const container = document.getElementById("experience-cards");
  const card = document.createElement("div");
  card.className = "card";

  const titleInput = createInput(data?.title, "Job Title", val => card.dataset.title = val);
  const companyInput = createInput(data?.company, "Company", val => card.dataset.company = val);
  const locationInput = createInput(data?.location, "Location", val => card.dataset.location = val);
  const datesInput = createInput(data?.dates, "Dates", val => card.dataset.dates = val);

  const detailsInput = document.createElement("textarea");
  detailsInput.placeholder = "Details (one per line)";
  detailsInput.value = (data?.details || []).join("\n");
  detailsInput.oninput = (e) => card.dataset.details = e.target.value.split("\n");

  card.append(titleInput, companyInput, locationInput, datesInput, detailsInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
}

// ------------------ Projects ------------------
function addProjectCard(data) {
  const container = document.getElementById("projects-cards");
  const card = document.createElement("div");
  card.className = "card";

  const titleInput = createInput(data?.title, "Project Title", val => card.dataset.title = val);
  const descInput = createInput(data?.description, "Description", val => card.dataset.description = val);

  card.append(titleInput, descInput);
  card.appendChild(createRemoveButton(card));
  container.appendChild(card);
}

// ------------------ Skills ------------------
function addSkillCard(data) {
  const container = document.getElementById("skills-cards");
  const card = document.createElement("div");
  card.className = "card";

  const categoryInput = createInput(data?.category, "Category", val => card.dataset.category = val);
  const itemsInput = createInput((data?.items || []).join(", "), "Comma-separated skills", val => card.dataset.items = val.split(",").map(s => s.trim()));

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

  // Show spinner
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

    logDebug(`Response status: ${response.status}`);

    if (!response.ok) {
      const errText = await response.text();
      logDebug(`Error response: ${errText}`);
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

// ------------------ Initialize UI ------------------
window.onload = () => {
  document.getElementById("name").value = defaultResumeData.name;
  document.getElementById("email").value = defaultResumeData.contact.email;
  document.getElementById("phone").value = defaultResumeData.contact.phone;
  document.getElementById("website").value = defaultResumeData.contact.website;

  defaultResumeData.education.forEach(addEducationCard);
  defaultResumeData.experience.forEach(addExperienceCard);
  defaultResumeData.projects.forEach(addProjectCard);
  defaultResumeData.skills.forEach(addSkillCard);

  document.getElementById("generate-btn").onclick = generatePDF;

  // Optional: buttons to add new cards
  document.getElementById("add-education-btn").onclick = () => addEducationCard({});
  document.getElementById("add-experience-btn").onclick = () => addExperienceCard({});
  document.getElementById("add-project-btn").onclick = () => addProjectCard({});
  document.getElementById("add-skill-btn").onclick = () => addSkillCard({});
};

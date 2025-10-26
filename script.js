// ------------------------------
// Default Resume Data
// ------------------------------
const defaultResumeData = {
  name: "Jake Smith",
  contact: {
    email: "jake@su.edu",
    phone: "123-456-7890",
    website: "https://linkedin.com/in/jake"
  },
  education: [
    {
      school: "Southwestern University",
      location: "Georgetown, TX",
      degree: "Bachelor of Arts in Computer Science, Minor in Business",
      dates: "Aug. 2018 -- May 2021"
    },
    {
      school: "Blinn College",
      location: "Bryan, TX",
      degree: "Associate's in Liberal Arts",
      dates: "Aug. 2014 -- May 2018"
    }
  ],
  experience: [
    {
      title: "Undergraduate Research Assistant",
      company: "Texas A&M University",
      location: "College Station, TX",
      dates: "June 2020 -- Present",
      details: [
        "Developed a REST API using FastAPI and PostgreSQL to store LMS data",
        "Built a full-stack web app using Flask, React, PostgreSQL and Docker",
        "Explored visualization of GitHub collaboration for classroom analytics"
      ]
    },
    {
      title: "IT Support Specialist",
      company: "Southwestern University",
      location: "Georgetown, TX",
      dates: "Sep. 2018 -- Present",
      details: [
        "Communicated with managers to configure and deploy campus systems",
        "Assessed and troubleshooted computer issues",
        "Maintained classrooms, equipment, and 200+ printers"
      ]
    }
  ],
  projects: [
    {
      title: "Gitlytics",
      description: "Full-stack web app using Flask (REST API) + React for GitHub data analytics"
    },
    {
      title: "Simple Paintball",
      description: "Minecraft server plugin with 2K+ downloads and CI/CD integration"
    }
  ],
  skills: [
    {
      category: "Languages",
      items: ["Java", "Python", "C/C++", "SQL (Postgres)", "JavaScript", "HTML/CSS", "R"]
    },
    {
      category: "Frameworks",
      items: ["React", "Node.js", "Flask", "JUnit", "WordPress", "Material-UI", "FastAPI"]
    }
  ]
};

// ------------------------------
// Section Add Functions
// ------------------------------
function addEducation(data = {}) {
  const container = document.getElementById('education-container');
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <input type="text" placeholder="School" value="${data.school || ''}">
    <input type="text" placeholder="Location" value="${data.location || ''}">
    <input type="text" placeholder="Degree" value="${data.degree || ''}">
    <input type="text" placeholder="Dates" value="${data.dates || ''}">
    <button class="remove-btn" onclick="this.parentNode.remove()">✖</button>
  `;
  container.appendChild(card);
}

function addExperience(data = {}) {
  const container = document.getElementById('experience-container');
  const card = document.createElement('div');
  card.className = 'card';
  const details = data.details ? data.details.join("\n") : "";
  card.innerHTML = `
    <input type="text" placeholder="Job Title" value="${data.title || ''}">
    <input type="text" placeholder="Company" value="${data.company || ''}">
    <input type="text" placeholder="Location" value="${data.location || ''}">
    <input type="text" placeholder="Dates" value="${data.dates || ''}">
    <textarea placeholder="Details (one per line)">${details}</textarea>
    <button class="remove-btn" onclick="this.parentNode.remove()">✖</button>
  `;
  container.appendChild(card);
}

function addProject(data = {}) {
  const container = document.getElementById('projects-container');
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <input type="text" placeholder="Project Title" value="${data.title || ''}">
    <textarea placeholder="Description">${data.description || ''}</textarea>
    <button class="remove-btn" onclick="this.parentNode.remove()">✖</button>
  `;
  container.appendChild(card);
}

function addSkill(data = {}) {
  const container = document.getElementById('skills-container');
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <input type="text" placeholder="Category (e.g. Languages)" value="${data.category || ''}">
    <input type="text" placeholder="Items (comma-separated)" value="${data.items ? data.items.join(', ') : ''}">
    <button class="remove-btn" onclick="this.parentNode.remove()">✖</button>
  `;
  container.appendChild(card);
}

// ------------------------------
// On Load: Prefill Defaults
// ------------------------------
window.onload = function () {
  // Basic info
  document.getElementById('name').value = defaultResumeData.name || '';
  document.getElementById('email').value = defaultResumeData.contact.email || '';
  document.getElementById('phone').value = defaultResumeData.contact.phone || '';
  document.getElementById('website').value = defaultResumeData.contact.website || '';

  // Prefill data
  defaultResumeData.education.forEach(edu => addEducation(edu));
  defaultResumeData.experience.forEach(exp => addExperience(exp));
  defaultResumeData.projects.forEach(proj => addProject(proj));
  defaultResumeData.skills.forEach(skill => addSkill(skill));
};

// ------------------------------
// Collect Data from UI
// ------------------------------
function collectResumeData() {
  const data = {
    name: document.getElementById('name').value.trim(),
    contact: {
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      website: document.getElementById('website').value.trim()
    },
    education: Array.from(document.querySelectorAll('#education-container .card')).map(c => ({
      school: c.children[0].value,
      location: c.children[1].value,
      degree: c.children[2].value,
      dates: c.children[3].value
    })),
    experience: Array.from(document.querySelectorAll('#experience-container .card')).map(c => ({
      title: c.children[0].value,
      company: c.children[1].value,
      location: c.children[2].value,
      dates: c.children[3].value,
      details: c.children[4].value.split("\n").filter(d => d.trim() !== "")
    })),
    projects: Array.from(document.querySelectorAll('#projects-container .card')).map(c => ({
      title: c.children[0].value,
      description: c.children[1].value
    })),
    skills: Array.from(document.querySelectorAll('#skills-container .card')).map(c => ({
      category: c.children[0].value,
      items: c.children[1].value.split(',').map(i => i.trim()).filter(Boolean)
    }))
  };
  return data;
}

// ------------------------------
// Generate PDF (Hugging Face Call)
// ------------------------------
async function generatePDF() {
  const resumeData = collectResumeData(); // already defined in your script
  console.log("Sending data to backend:", resumeData);

  // 👉 Change this to your actual backend endpoint
  const API_URL = "https://idea-ai-resumelatex.hf.space/generate"; 
  // Example: "http://127.0.0.1:7860/generate"

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

    // Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("⚠️ Failed to connect to backend.\n" + error.message);
  }
}

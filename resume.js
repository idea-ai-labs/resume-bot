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
// Debug Panel
// ------------------------------
function logDebug(message) {
  const panel = document.getElementById("debugPanel");
  if (!panel) return;
  const timestamp = new Date().toLocaleTimeString();
  panel.textContent += `[${timestamp}] ${message}\n`;
  panel.scrollTop = panel.scrollHeight;
}

// ------------------------------
// Section Add Functions
// ------------------------------
function addEducation(data = {}) {
  const container = document.getElementById('education-container');
  if (!container) return;
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <input type="text" placeholder="School" value="${data.school || ''}">
    <input type="text" placeholder="Location" value="${data.location || ''}">
    <input type="text" placeholder="Degree" value="${data.degree || ''}">
    <input type="text" placeholder="Dates" value="${data.dates || ''}">
    <button type="button" class="remove-btn" onclick="this.parentNode.remove()">✖</button>
  `;
  container.appendChild(card);
}

function addExperience(data = {}) {
  const container = document.getElementById('experience-container');
  if (!container) return;
  const card = document.createElement('div');
  card.className = 'card';
  const details = data.details ? data.details.join("\n") : "";
  card.innerHTML = `
    <input type="text" placeholder="Job Title" value="${data.title || ''}">
    <input type="text" placeholder="Company" value="${data.company || ''}">
    <input type="text" placeholder="Location" value="${data.location || ''}">
    <input type="text" placeholder="Dates" value="${data.dates || ''}">
    <textarea placeholder="Details (one per line)">${details}</textarea>
    <button type="button" class="remove-btn" onclick="this.parentNode.remove()">✖</button>
  `;
  container.appendChild(card);
}

function addProject(data = {}) {
  const container = document.getElementById('projects-container');
  if (!container) return;
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <input type="text" placeholder="Project Title" value="${data.title || ''}">
    <textarea placeholder="Description">${data.description || ''}</textarea>
    <button type="button" class="remove-btn" onclick="this.parentNode.remove()">✖</button>
  `;
  container.appendChild(card);
}

function addSkill(data = {}) {
  const container = document.getElementById('skills-container');
  if (!container) return;
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <input type="text" placeholder="Category (e.g. Languages)" value="${data.category || ''}">
    <input type="text" placeholder="Items (comma-separated)" value="${data.items ? data.items.join(', ') : ''}">
    <button type="button" class="remove-btn" onclick="this.parentNode.remove()">✖</button>
  `;
  container.appendChild(card);
}

// ------------------------------
// Prefill Defaults
// ------------------------------
window.addEventListener("DOMContentLoaded", () => {
  try {
    logDebug("Prefilling default resume data...");

    const setIf = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.value = value || "";
    };

    setIf("name", defaultResumeData.name);
    setIf("email", defaultResumeData.contact?.email || "");
    setIf("phone", defaultResumeData.contact?.phone || "");
    setIf("website", defaultResumeData.contact?.website || "");

    defaultResumeData.education.forEach(addEducation);
    defaultResumeData.experience.forEach(addExperience);
    defaultResumeData.projects.forEach(addProject);
    defaultResumeData.skills.forEach(addSkill);

    logDebug("Default resume data prefilling complete.");
  } catch (err) {
    console.error("Error during prefill:", err);
    logDebug(`Error during prefill: ${err}`);
  }
});

// ------------------------------
// Collect Data from UI
// ------------------------------
function collectResumeData() {
  const data = {
    name: document.getElementById('name')?.value.trim() || "",
    contact: {
      email: document.getElementById('email')?.value.trim() || "",
      phone: document.getElementById('phone')?.value.trim() || "",
      website: document.getElementById('website')?.value.trim() || ""
    },
    education: Array.from(document.querySelectorAll('#education-container .card')).map(c => {
      const inputs = c.querySelectorAll('input');
      return {
        school: inputs[0]?.value || "",
        location: inputs[1]?.value || "",
        degree: inputs[2]?.value || "",
        dates: inputs[3]?.value || ""
      };
    }),
    experience: Array.from(document.querySelectorAll('#experience-container .card')).map(c => {
      const inputs = c.querySelectorAll('input, textarea');
      return {
        title: inputs[0]?.value || "",
        company: inputs[1]?.value || "",
        location: inputs[2]?.value || "",
        dates: inputs[3]?.value || "",
        details: inputs[4]?.value.split("\n").filter(d => d.trim())
      };
    }),
    projects: Array.from(document.querySelectorAll('#projects-container .card')).map(c => {
      const inputs = c.querySelectorAll('input, textarea');
      return {
        title: inputs[0]?.value || "",
        description: inputs[1]?.value || ""
      };
    }),
    skills: Array.from(document.querySelectorAll('#skills-container .card')).map(c => {
      const inputs = c.querySelectorAll('input');
      return {
        category: inputs[0]?.value || "",
        items: inputs[1]?.value.split(",").map(i => i.trim()).filter(Boolean)
      };
    })
  };
  return data;
}

// ------------------------------
// Generate PDF (Hugging Face Call)
// ------------------------------
async function generatePDF() {
  const resumeData = collectResumeData();
  logDebug("📤 Sending data to backend...");

  // Use same domain, just different endpoint for backend
  const API_URL = `${window.location.origin}/api/generate`;

  // Prevent multiple clicks
  if (document.getElementById("spinner-overlay")) {
    logDebug("⚠️ Already generating PDF — please wait...");
    return;
  }

  // Show spinner overlay
  const spinner = document.createElement("div");
  spinner.id = "spinner-overlay";
  spinner.innerHTML = `
    <style>
      #spinner-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 9999;
        color: white;
        font-family: Arial, sans-serif;
      }
      .spinner-container {
        text-align: center;
      }
      .spinner {
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
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

    logDebug(`📥 Response status: ${response.status}`);

    if (!response.ok) {
      const errText = await response.text();
      logDebug(`❌ Error response: ${errText}`);
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
    logDebug("✅ PDF downloaded successfully.");
  } catch (error) {
    console.error("❌ Failed to connect:", error);
    logDebug(`⚠️ Failed to connect: ${error.message}`);
    alert("⚠️ Failed to connect to backend.\n" + error.message);
  } finally {
    // Always remove spinner
    document.getElementById("spinner-overlay")?.remove();
  }
}

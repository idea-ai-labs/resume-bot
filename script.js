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

function logDebug(message) {
    const panel = document.getElementById("debugPanel");
    const timestamp = new Date().toLocaleTimeString();
    panel.textContent += `[${timestamp}] ${message}\n`;
    panel.scrollTop = panel.scrollHeight; // auto-scroll
}
// ------------------------------
// On Load: Prefill Defaults
// ------------------------------

// Safe init: populate defaults and debug what's present
window.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("INIT: Prefilling default resume data...");

    // quick helpers to test existence
    const has = name => {
      try { return typeof window[name] !== "undefined"; }
      catch { return false; }
    };

    // Validate default data
    if (typeof defaultResumeData === "undefined" || !defaultResumeData) {
      console.warn("INIT: defaultResumeData is missing or undefined.");
      return;
    }

    // Basic contact fields (only set if element exists)
    const setIf = (id, value) => {
      const el = document.getElementById(id);
      if (el) {
        el.value = value || "";
      } else {
        console.warn(`INIT: element #${id} not found in DOM.`);
      }
    };

    setIf("name", defaultResumeData.name);
    setIf("email", (defaultResumeData.contact && defaultResumeData.contact.email) || "");
    setIf("phone", (defaultResumeData.contact && defaultResumeData.contact.phone) || "");
    setIf("website", (defaultResumeData.contact && defaultResumeData.contact.website) || "");

    // Generic apply function that supports two patterns:
    // 1) existing addEducation(data) style
    // 2) generic addSection('education') or createCard fallback
    function applyDefaultsArray(kind, items) {
      if (!Array.isArray(items)) return;

      // prefer specialized add function if available
      const specialized = {
        education: "addEducation",
        experience: "addExperience",
        projects: "addProject",
        skills: "addSkill"
      }[kind];

      if (specialized && has(specialized)) {
        console.log(`INIT: Using specialized function ${specialized} for ${kind} (${items.length} items).`);
        items.forEach(it => {
          try { window[specialized](it); } 
          catch (e) { console.error(`INIT: error calling ${specialized} for`, it, e); }
        });
        return;
      }

      // fallback: try generic addSection(kind) repeated + populate fields if possible
      if (has("addSection")) {
        console.log(`INIT: Using generic addSection for ${kind} (${items.length} items).`);
        items.forEach(it => {
          try {
            // create an empty section then populate inputs inside it
            addSection(kind); // expected to add a .resume-section in #${kind}-container
            const container = document.getElementById(`${kind}-container`);
            if (!container) return;
            const latest = container.lastElementChild;
            if (!latest) return;
            // populate any inputs/textareas by matching keys to placeholders/names
            Object.entries(it).forEach(([k, v]) => {
              try {
                // try name selector then placeholder match
                const byName = latest.querySelector(`[name="${k}"]`);
                const byClass = latest.querySelector(`.${k}`);
                if (byName) byName.value = Array.isArray(v) ? v.join("\n") : v;
                else if (byClass) byClass.value = Array.isArray(v) ? v.join("\n") : v;
                else {
                  // last resort: set first input/textarea if empty
                  const first = latest.querySelector("input, textarea");
                  if (first && !first.value) first.value = Array.isArray(v) ? v.join("\n") : v;
                }
              } catch(e) { /* ignore field-level errors */ }
            });
          } catch (e) {
            console.error("INIT: error in addSection fallback for", kind, it, e);
          }
        });
        return;
      }

      // final fallback: try to directly append a card into container
      console.log(`INIT: Falling back to direct card injection for ${kind} (${items.length} items).`);
      const container = document.getElementById(`${kind}-container`);
      if (!container) {
        console.warn(`INIT: No container found for ${kind} (id=${kind}-container).`);
        return;
      }
      items.forEach(it => {
        const card = document.createElement("div");
        card.className = "card";
        // create simple inputs for object keys
        Object.entries(it).forEach(([k, v]) => {
          const label = document.createElement("label");
          label.textContent = k;
          const field = document.createElement(Array.isArray(v) ? "textarea" : "input");
          if (!Array.isArray(v)) field.type = "text";
          field.value = Array.isArray(v) ? v.join("\n") : v;
          field.name = k;
          field.className = k;
          card.appendChild(label);
          card.appendChild(field);
        });
        // add a remove button
        const rem = document.createElement("button");
        rem.type = "button";
        rem.textContent = "✖";
        rem.className = "remove-btn";
        rem.onclick = () => card.remove();
        card.appendChild(rem);
        container.appendChild(card);
      });
    }

    // Apply arrays
    applyDefaultsArray("education", defaultResumeData.education || []);
    applyDefaultsArray("experience", defaultResumeData.experience || []);
    applyDefaultsArray("projects", defaultResumeData.projects || []);
    applyDefaultsArray("skills", defaultResumeData.skills || []);

    console.log("INIT: done prefilling defaults.");
  } catch (err) {
    console.error("INIT: unexpected error while prefilling defaults:", err);
  }
});
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

async function generatePDF-new() {
  const resumeData = collectResumeData();
  console.log("📤 Sending data to backend:", resumeData);

  const API_URL = "https://idea-ai-resumelatex.hf.space/proxy/5000/generate";

  // Show loading spinner
  const spinner = document.createElement("div");
  spinner.id = "spinner-overlay";
  spinner.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
      <p>Generating your PDF...</p>
    </div>`;
  document.body.appendChild(spinner);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resumeData)
    });

    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Error response:", errText);
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
    console.log("✅ PDF downloaded successfully.");

  } catch (error) {
    console.error("⚠️ Failed to connect:", error);
    alert("⚠️ Failed to connect to backend.\n" + error.message);
  } finally {
    document.getElementById("spinner-overlay")?.remove();
  }
}

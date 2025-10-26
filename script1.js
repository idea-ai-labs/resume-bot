// Utility to create a new card
function createCard(htmlContent, containerId) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = htmlContent;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "X";
  removeBtn.className = "remove";
  removeBtn.onclick = () => card.remove();
  card.appendChild(removeBtn);

  document.getElementById(containerId).appendChild(card);
}

// Education
function addEducation() {
  const html = `
    <input type="text" placeholder="School">
    <input type="text" placeholder="Location">
    <input type="text" placeholder="Degree">
    <input type="text" placeholder="Dates">
  `;
  createCard(html, "education-container");
}

// Experience
function addExperience() {
  const html = `
    <input type="text" placeholder="Title">
    <input type="text" placeholder="Company">
    <input type="text" placeholder="Location">
    <input type="text" placeholder="Dates">
    <textarea placeholder="Details (comma separated)"></textarea>
  `;
  createCard(html, "experience-container");
}

// Projects
function addProject() {
  const html = `
    <input type="text" placeholder="Project Title">
    <textarea placeholder="Project Description"></textarea>
  `;
  createCard(html, "projects-container");
}

// Skills
function addSkill() {
  const html = `
    <input type="text" placeholder="Category">
    <input type="text" placeholder="Comma-separated skills">
  `;
  createCard(html, "skills-container");
}

// Generate PDF
async function generatePDF() {
  const data = {
    name: document.getElementById("contact-name").value,
    contact: {
      phone: document.getElementById("contact-phone").value,
      email: document.getElementById("contact-email").value,
      website: document.getElementById("contact-website").value
    },
    education: [],
    experience: [],
    projects: [],
    skills: []
  };

  document.querySelectorAll("#education-container .card").forEach(card => {
    data.education.push({
      school: card.children[0].value,
      location: card.children[1].value,
      degree: card.children[2].value,
      dates: card.children[3].value
    });
  });

  document.querySelectorAll("#experience-container .card").forEach(card => {
    data.experience.push({
      title: card.children[0].value,
      company: card.children[1].value,
      location: card.children[2].value,
      dates: card.children[3].value,
      details: card.children[4].value.split(",").map(d => ({ description: d.trim() }))
    });
  });

  document.querySelectorAll("#projects-container .card").forEach(card => {
    data.projects.push({
      title: card.children[0].value,
      description: card.children[1].value
    });
  });

  document.querySelectorAll("#skills-container .card").forEach(card => {
    data.skills.push({
      category: card.children[0].value,
      items: card.children[1].value.split(",").map(s => s.trim())
    });
  });

  console.log("Sending data to Hugging Face:", data);

  // REST call to Hugging Face Space
  try {
    const response = await fetch("YOUR_HUGGINGFACE_SPACE_URL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(await response.text());

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Error generating PDF: " + err.message);
  }
}

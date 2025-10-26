// Utility to create input
function createInput(placeholder, value="") {
    const input = document.createElement('input');
    input.type = "text";
    input.placeholder = placeholder;
    input.value = value;
    return input;
}

// Add Education
function addEducation(school="", location="", degree="", dates="") {
    const container = document.getElementById('education-entries');
    const div = document.createElement('div');
    div.className = "entry";
    div.innerHTML = `
        <button class="remove-btn" onclick="this.parentNode.remove()">X</button>
    `;
    div.appendChild(createInput("School", school));
    div.appendChild(createInput("Location", location));
    div.appendChild(createInput("Degree", degree));
    div.appendChild(createInput("Dates", dates));
    container.appendChild(div);
}

// Add Experience
function addExperience(title="", company="", location="", dates="", details="") {
    const container = document.getElementById('experience-entries');
    const div = document.createElement('div');
    div.className = "entry";
    div.innerHTML = `<button class="remove-btn" onclick="this.parentNode.remove()">X</button>`;
    div.appendChild(createInput("Job Title", title));
    div.appendChild(createInput("Company", company));
    div.appendChild(createInput("Location", location));
    div.appendChild(createInput("Dates", dates));
    div.appendChild(createInput("Details", details));
    container.appendChild(div);
}

// Add Project
function addProject(title="", description="") {
    const container = document.getElementById('projects-entries');
    const div = document.createElement('div');
    div.className = "entry";
    div.innerHTML = `<button class="remove-btn" onclick="this.parentNode.remove()">X</button>`;
    div.appendChild(createInput("Project Title", title));
    div.appendChild(createInput("Description", description));
    container.appendChild(div);
}

// Add Skill
function addSkill(category="", items="") {
    const container = document.getElementById('skills-entries');
    const div = document.createElement('div');
    div.className = "entry";
    div.innerHTML = `<button class="remove-btn" onclick="this.parentNode.remove()">X</button>`;
    div.appendChild(createInput("Skill Category", category));
    div.appendChild(createInput("Items (comma separated)", items));
    container.appendChild(div);
}

// Collect form data
function collectData() {
    const data = {
        name: document.getElementById('name').value,
        contact: {
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            website: document.getElementById('website').value
        },
        education: [],
        experience: [],
        projects: [],
        skills: []
    };

    document.querySelectorAll('#education-entries .entry').forEach(e => {
        const inputs = e.querySelectorAll('input');
        data.education.push({
            school: inputs[0].value,
            location: inputs[1].value,
            degree: inputs[2].value,
            dates: inputs[3].value
        });
    });

    document.querySelectorAll('#experience-entries .entry').forEach(e => {
        const inputs = e.querySelectorAll('input');
        data.experience.push({
            title: inputs[0].value,
            company: inputs[1].value,
            location: inputs[2].value,
            dates: inputs[3].value,
            details: [{description: inputs[4].value}]
        });
    });

    document.querySelectorAll('#projects-entries .entry').forEach(e => {
        const inputs = e.querySelectorAll('input');
        data.projects.push({title: inputs[0].value, description: inputs[1].value});
    });

    document.querySelectorAll('#skills-entries .entry').forEach(e => {
        const inputs = e.querySelectorAll('input');
        data.skills.push({
            category: inputs[0].value,
            items: inputs[1].value.split(',').map(i => i.trim())
        });
    });

    return data;
}

// Generate PDF
function generatePDF() {
    const payload = collectData();
    console.log("Sending data:", payload);

    fetch("https://huggingface-space-url/api/generate", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    .then(res => res.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.pdf

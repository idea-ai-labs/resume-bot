// ============================================================
// Resume Builder – Plug-and-play components
// ============================================================

// ✅ Basic section templates (add more later easily)
const sectionTemplates = {
  project: `
    <div class="bg-white p-4 rounded-lg shadow border border-gray-200 relative">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-red-500 remove-section">✕</button>
      <h2 class="text-lg font-semibold mb-2">Project</h2>
      <input placeholder="Title" class="w-full border rounded px-3 py-2 mb-2" />
      <textarea placeholder="Description" class="w-full border rounded px-3 py-2"></textarea>
    </div>
  `,
  education: `
    <div class="bg-white p-4 rounded-lg shadow border border-gray-200 relative">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-red-500 remove-section">✕</button>
      <h2 class="text-lg font-semibold mb-2">Education</h2>
      <input placeholder="School" class="w-full border rounded px-3 py-2 mb-2" />
      <input placeholder="Degree" class="w-full border rounded px-3 py-2 mb-2" />
      <input placeholder="Year" class="w-full border rounded px-3 py-2" />
    </div>
  `,
  experience: `
    <div class="bg-white p-4 rounded-lg shadow border border-gray-200 relative">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-red-500 remove-section">✕</button>
      <h2 class="text-lg font-semibold mb-2">Experience</h2>
      <input placeholder="Company" class="w-full border rounded px-3 py-2 mb-2" />
      <input placeholder="Role" class="w-full border rounded px-3 py-2 mb-2" />
      <textarea placeholder="Details" class="w-full border rounded px-3 py-2"></textarea>
    </div>
  `
};

// ============================================================
// UI logic
// ============================================================

// Dropdown or random section type
const sectionKeys = Object.keys(sectionTemplates);
const addBtn = document.getElementById("addSection");
const container = document.getElementById("sections");

// 🔹 Add new section
addBtn.addEventListener("click", () => {
  const next = prompt("Which section to add? (project / education / experience)");
  const type = sectionTemplates[next?.toLowerCase()];
  if (type) {
    container.insertAdjacentHTML("beforeend", type);
  } else {
    alert("Invalid section type.");
  }
});

// 🔹 Remove section
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-section")) {
    e.target.closest("div").remove();
  }
});

// ============================================================
// PDF generation stub (connect later to Hugging Face API)
// ============================================================
document.getElementById("generatePDF").addEventListener("click", async () => {
  const sections = [...container.children].map((sec) => {
    const inputs = sec.querySelectorAll("input, textarea");
    const data = {};
    inputs.forEach((inp) => {
      data[inp.placeholder.toLowerCase()] = inp.value;
    });
    return data;
  });

  console.log("🧾 Resume JSON:", sections);

  alert("✅ Resume data collected. (Next: Send to Hugging Face for PDF)");
  // Later:
  // const res = await fetch("https://huggingface.co/spaces/your-space/api/predict", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ data: [JSON.stringify(sections)] }),
  // });
});

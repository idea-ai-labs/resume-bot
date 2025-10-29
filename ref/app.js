// ============================================================
// Modern Resume Builder – Mobile-first, Canva-like
// ============================================================

const sectionTemplates = {
  project: `
    <div class="fade-in bg-white p-4 rounded-xl shadow-md border border-gray-100 relative">
      <button class="absolute top-3 right-3 text-gray-400 hover:text-red-500 remove-section">✕</button>
      <h2 class="text-lg font-semibold mb-3">🧩 Project</h2>
      <input placeholder="Title" class="w-full border border-gray-200 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500" />
      <textarea placeholder="Description" rows="3" class="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"></textarea>
    </div>
  `,
  education: `
    <div class="fade-in bg-white p-4 rounded-xl shadow-md border border-gray-100 relative">
      <button class="absolute top-3 right-3 text-gray-400 hover:text-red-500 remove-section">✕</button>
      <h2 class="text-lg font-semibold mb-3">🎓 Education</h2>
      <input placeholder="School" class="w-full border border-gray-200 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500" />
      <input placeholder="Degree" class="w-full border border-gray-200 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500" />
      <input placeholder="Year" class="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
    </div>
  `,
  experience: `
    <div class="fade-in bg-white p-4 rounded-xl shadow-md border border-gray-100 relative">
      <button class="absolute top-3 right-3 text-gray-400 hover:text-red-500 remove-section">✕</button>
      <h2 class="text-lg font-semibold mb-3">💼 Experience</h2>
      <input placeholder="Company" class="w-full border border-gray-200 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500" />
      <input placeholder="Role" class="w-full border border-gray-200 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500" />
      <textarea placeholder="Details" rows="3" class="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"></textarea>
    </div>
  `
};

// ============================================================
// Main Logic
// ============================================================
const addBtn = document.getElementById("addSection");
const container = document.getElementById("sections");

addBtn.addEventListener("click", () => {
  // Fancy selection modal using prompt for now (later: bottom sheet)
  const next = prompt("Which section to add? (project / education / experience)");
  const type = sectionTemplates[next?.toLowerCase()];
  if (type) {
    container.insertAdjacentHTML("beforeend", type);
    scrollToBottomSmooth();
  } else {
    alert("Invalid section type.");
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-section")) {
    e.target.closest("div").remove();
  }
});

// ============================================================
// PDF Generation Stub (later connect to Hugging Face)
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
});

// ============================================================
// Helpers
// ============================================================
function scrollToBottomSmooth() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}

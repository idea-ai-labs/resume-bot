const componentsDiv = document.getElementById("components");
const addBtn = document.getElementById("addComponent");
const generateBtn = document.getElementById("generatePDF");

let resumeData = [];

addBtn.addEventListener("click", () => {
  const component = document.createElement("div");
  component.className = "component-card";
  component.innerHTML = `
    <input type="text" placeholder="Section Title (e.g., Education)" />
    <textarea placeholder="Details..."></textarea>
    <button class="remove">🗑 Remove</button>
  `;

  component.querySelector(".remove").addEventListener("click", () => {
    component.remove();
  });

  componentsDiv.appendChild(component);
});

generateBtn.addEventListener("click", async () => {
  resumeData = Array.from(componentsDiv.children).map(c => ({
    title: c.querySelector("input").value,
    details: c.querySelector("textarea").value
  }));

  console.log("Generated Resume Data:", resumeData);

  // Example: Replace this with your Hugging Face API endpoint later
  // const res = await fetch("https://huggingface.co/spaces/yourname/resume/api/generate", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(resumeData)
  // });
  // const blob = await res.blob();
  // window.open(URL.createObjectURL(blob));
});

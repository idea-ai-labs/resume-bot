// resume-parser.js
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result;
    // Placeholder for resume parsing logic
    console.log("Resume file content:", text);
    alert("Parsing existing resume not implemented yet.");
  };
  reader.readAsText(file);
}

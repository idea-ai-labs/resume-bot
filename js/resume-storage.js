// resume-storage.js
const STORAGE_KEY = "resumeData";

function saveToLocalStorage() {
  const data = collectResumeData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Error parsing saved resume:", e);
      return defaultResumeData;
    }
  }
  return defaultResumeData;
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

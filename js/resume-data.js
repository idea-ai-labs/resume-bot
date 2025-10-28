// resume-data.js
const defaultResumeData = {
  name: "John Smith",
  contact: {
    email: "john.smith@email.com",
    phone: "555-987-6543",
    website: "https://linkedin.com/in/johnsmith"
  },
  education: [
    {
      school: "University of Washington",
      location: "Seattle, WA",
      degree: "B.S. in Information Systems",
      dates: "Aug. 2017 – May 2021"
    }
  ],
  experience: [
    {
      title: "Product Analyst",
      company: "NextGen Analytics",
      location: "Seattle, WA",
      dates: "Jun. 2021 – Present",
      details: [
        "Developed internal dashboards for customer metrics using React and Flask",
        "Collaborated with data engineers to optimize ETL pipelines reducing load time by 40%",
        "Led requirements gathering sessions with business stakeholders"
      ]
    },
    {
      title: "IT Intern",
      company: "Pacific Tech Solutions",
      location: "Bellevue, WA",
      dates: "Jun. 2020 – Aug. 2020",
      details: [
        "Supported IT operations and helped automate daily reporting via Python scripts",
        "Assisted in managing ticketing workflows and device maintenance"
      ]
    }
  ],
  projects: [
    {
      title: "InsightBoard",
      description: "Interactive business analytics dashboard using Flask + React + Chart.js"
    },
    {
      title: "EcoRoute",
      description: "Web app recommending eco-friendly travel routes using OpenStreetMap API"
    }
  ],
  skills: [
    { category: "Languages", items: ["Python", "JavaScript", "SQL", "HTML/CSS"] },
    { category: "Frameworks", items: ["React", "Node.js", "Flask", "Pandas", "Bootstrap"] }
  ]
};

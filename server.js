import express from "express";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "32kb" }));

// CORS
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://sandeep-yadav-webside.onrender.com"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.static("."));

/* =========================================================
   SANDEEP PROFILE
========================================================= */

const profile = {
  name: "Sandeep Yadav",
  role: "Software Engineer | Web Developer | Technology Enthusiast",

  education:
    "B.Tech from Dr. A.P.J. Abdul Kalam Technical University (AKTU), Uttar Pradesh.",

  school:
    "Saraswati Gyan Mandir",

  journey: {
    classes1to8: "2009 – 2015 — Saraswati Gyan Mandir — NCERT Curriculum",
    class10: "2017 — Class X — High School — UP Board — 66.33%",
    class12: "2021 — Class XII — Intermediate — UP Board — 64.80%",
    college: "B.Tech — Dr. A.P.J. Abdul Kalam Technical University (AKTU)"
  },

  skills: [
    "HTML5",
    "CSS3",
    "JavaScript",
    "PHP",
    "MySQL",
    "Python",
    "Java",
    "C",
    "C++",
    "Git",
    "GitHub",
    "Responsive Design",
    "REST/API Basics",
    "Visual Studio Code",
    "XAMPP",
    "phpMyAdmin"
  ],

  projects: [
    "Task Management Dashboard",
    "Login & Registration System",
    "Responsive Web Projects"
  ],

  focus: [
    "Web Development",
    "Software Engineering",
    "Backend & Database",
    "Continuous Growth"
  ],

  email: "sky811572@gmail.com",

  whatsapp: "https://wa.me/918115728884",

  linkedin: "https://www.linkedin.com/in/sandeep8115",

  instagram: "https://www.instagram.com/sandeep_yadav_0.7_/",

  github: "https://github.com/sky811572",

  linktree: "https://linktr.ee/sandeep_yadav_07"
};


/* =========================================================
   FREE AI RESPONSE ENGINE
========================================================= */

function getFreeAIResponse(message) {
  const text = String(message || "").trim().toLowerCase();

  if (!text) {
    return "Please ask me something about Sandeep.";
  }

  // Greeting
  if (
    /^(hi|hello|hey|hii|hola|namaste|good morning|good afternoon|good evening)\b/i.test(
      text
    )
  ) {
    return `Hi! 👋 I'm Sandeep AI.

I can tell you about Sandeep's:
• Skills
• Education
• Projects
• Career focus
• Contact details

What would you like to know?`;
  }

  // Who is Sandeep?
  if (
    text.includes("who is sandeep") ||
    text.includes("about sandeep") ||
    text.includes("tell me about sandeep") ||
    text.includes("sandeep kaun")
  ) {
    return `Sandeep Yadav is a Software Engineer, Web Developer, and Technology Enthusiast.

He has a B.Tech background from Dr. A.P.J. Abdul Kalam Technical University (AKTU), Uttar Pradesh.

His main focus areas are Web Development, Software Engineering, Backend & Database development, and continuous learning.`;
  }

  // Skills
  if (
    text.includes("skill") ||
    text.includes("technology") ||
    text.includes("technologies") ||
    text.includes("programming") ||
    text.includes("language")
  ) {
    return `Sandeep's technical skills include:

• HTML5
• CSS3
• JavaScript
• PHP
• MySQL
• Python
• Java
• C
• C++
• Git & GitHub
• Responsive Design
• REST/API Basics
• VS Code
• XAMPP
• phpMyAdmin`;
  }

  // Education
  if (
    text.includes("education") ||
    text.includes("qualification") ||
    text.includes("degree") ||
    text.includes("college") ||
    text.includes("university") ||
    text.includes("aktu")
  ) {
    return `Sandeep's education journey:

• 2009–2015 — Classes 1–8, Saraswati Gyan Mandir, NCERT Curriculum
• 2017 — Class X, UP Board — 66.33%
• 2021 — Class XII, UP Board — 64.80%
• B.Tech — Dr. A.P.J. Abdul Kalam Technical University (AKTU), Uttar Pradesh`;
  }

  // School
  if (
    text.includes("school") ||
    text.includes("class 1") ||
    text.includes("class 8") ||
    text.includes("2009") ||
    text.includes("2015")
  ) {
    return `Sandeep studied Classes 1–8 from 2009 to 2015 at Saraswati Gyan Mandir under the NCERT Curriculum.`;
  }

  // Class 10
  if (
    text.includes("class 10") ||
    text.includes("10th") ||
    text.includes("high school") ||
    text.includes("66.33")
  ) {
    return `Sandeep completed Class X (High School) in 2017 under the UP Board with 66.33%.`;
  }

  // Class 12
  if (
    text.includes("class 12") ||
    text.includes("12th") ||
    text.includes("intermediate") ||
    text.includes("64.80")
  ) {
    return `Sandeep completed Class XII (Intermediate) in 2021 under the UP Board with 64.80%.`;
  }

  // Projects
  if (
    text.includes("project") ||
    text.includes("projects") ||
    text.includes("work")
  ) {
    return `Sandeep has worked on projects including:

1. Task Management Dashboard
2. Login & Registration System
3. Responsive Web Projects

These projects involve frontend development, backend development, databases, authentication, and responsive UI development.`;
  }

  // Task dashboard
  if (
    text.includes("task management") ||
    text.includes("todo") ||
    text.includes("to-do") ||
    text.includes("task dashboard")
  ) {
    return `Sandeep's Task Management Dashboard is a web-based project designed to manage tasks with features such as task creation, descriptions, dates, status management, and database integration.`;
  }

  // Career / focus
  if (
    text.includes("career") ||
    text.includes("focus") ||
    text.includes("professional") ||
    text.includes("developer")
  ) {
    return `Sandeep's professional focus includes:

• Web Development
• Software Engineering
• Backend & Database
• Building practical software projects
• Continuous technical growth`;
  }

  // GitHub
  if (text.includes("github")) {
    return `You can explore Sandeep's GitHub projects here:

${profile.github}`;
  }

  // LinkedIn
  if (text.includes("linkedin")) {
    return `You can connect with Sandeep on LinkedIn:

${profile.linkedin}`;
  }

  // Instagram
  if (text.includes("instagram")) {
    return `Sandeep's Instagram:

${profile.instagram}`;
  }

  // Contact
  if (
    text.includes("contact") ||
    text.includes("email") ||
    text.includes("reach") ||
    text.includes("phone") ||
    text.includes("whatsapp")
  ) {
    return `You can contact Sandeep through:

📧 Email: ${profile.email}

💬 WhatsApp:
${profile.whatsapp}

💼 LinkedIn:
${profile.linkedin}`;
  }

  // Resume
  if (
    text.includes("resume") ||
    text.includes("cv") ||
    text.includes("experience")
  ) {
    return `Sandeep is a Software Engineer focused on Web Development, Backend & Database technologies, and practical software projects.

For professional details, you can connect with him on LinkedIn:
${profile.linkedin}`;
  }

  // Thanks
  if (
    text.includes("thank") ||
    text.includes("thanks") ||
    text === "thx"
  ) {
    return `You're welcome! 😊

If you want to know more about Sandeep's skills, projects, education, or contact details, just ask me.`;
  }

  // Default
  return `I'm Sandeep AI 🤖

I can answer questions about Sandeep's:

• Skills
• Education
• Projects
• Career focus
• GitHub
• LinkedIn
• Contact details

Try asking:
"What are Sandeep's skills?"
or
"Tell me about Sandeep's projects."`;
}


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mode: "free",
    aiConfigured: false,
    message: "Sandeep AI is running in free mode."
  });
});


/* =========================================================
   CHAT API
========================================================= */

app.post("/api/chat", (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const response = getFreeAIResponse(message);

    return res.json({
      success: true,
      response
    });

  } catch (error) {
    console.error("FREE AI ERROR:", error);

    return res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
});


/* =========================================================
   ASSIGNMENT ENDPOINT
========================================================= */

app.post("/api/assignment/batch", (req, res) => {
  res.json({
    success: true,
    message:
      "Assignment service is available in free mode. No OpenAI API credits are required."
  });
});


/* =========================================================
   404
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found."
  });
});


/* =========================================================
   START SERVER
========================================================= */

app.listen(port, () => {
  console.log(`Sandeep AI Free Server running on port ${port}`);
});

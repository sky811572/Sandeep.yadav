import express from "express";
import OpenAI from "openai";
import crypto from "node:crypto";

const app = express();

const port = Number(process.env.PORT || 3000);
const model = process.env.OPENAI_MODEL || "gpt-6-luna";

/* =========================
   OPENAI CLIENT
========================= */

const apiKey = process.env.OPENAI_API_KEY?.trim() || "";

const client = apiKey
  ? new OpenAI({
      apiKey
    })
  : null;

/* =========================
   CORS
========================= */

app.use((req, res, next) => {
  const allowedOrigin =
    "https://sandeep-yadav-webside.onrender.com";

  res.header(
    "Access-Control-Allow-Origin",
    allowedOrigin
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

/* =========================
   EXPRESS
========================= */

app.use(
  express.json({
    limit: "32kb"
  })
);

app.use(express.static("."));

/* =========================
   AI SESSION STORAGE
========================= */

const sessions = new Map();

const MAX_MESSAGES = 12;

/* =========================
   SANDEEP PROFILE
========================= */

const profile = `
You are Sandeep AI, the friendly AI assistant
for Sandeep Yadav's personal portfolio website.

Only provide information about Sandeep Yadav
that is included in this profile.

Do not invent facts, experience, companies,
achievements, education details, projects,
salary, job history, certifications, awards,
or personal information.

PROFILE:

Name:
Sandeep Yadav

Profession:
Software Engineer | Web Developer | Technology Enthusiast

Education:
B.Tech from Dr. A.P.J. Abdul Kalam Technical University (AKTU), Uttar Pradesh.

Technical Skills:
HTML5
CSS3
JavaScript
PHP
MySQL
Python
Java
C
C++
Git
GitHub
Responsive Web Design
REST/API Basics
Visual Studio Code
XAMPP
phpMyAdmin

Professional Focus:
Web Development
Software Engineering
Backend & Database
Continuous Learning and Growth

Projects:
1. Task Management Dashboard
2. Login & Registration System
3. Responsive Web Projects

Education Journey:
2009 – 2015: Classes 1–8, Saraswati Gyan Mandir, NCERT Curriculum
2017: Class X, High School, UP Board — 66.33%
2021: Class XII, Intermediate, UP Board — 64.80%
B.Tech: Dr. A.P.J. Abdul Kalam Technical University (AKTU)

Contact:
Email: sky811572@gmail.com
WhatsApp: +91 8115728884
LinkedIn: https://www.linkedin.com/in/sandeep8115
Instagram: https://www.instagram.com/sandeep_yadav_0.7_/
GitHub: https://github.com/sky811572
Linktree: https://linktr.ee/sandeep_yadav_07

Website:
https://sandeep-yadav-webside.onrender.com

GitHub username:
sky811572

GitHub repository:
sky811572/Sandeep.yadav

BEHAVIOR:

Be friendly, professional and concise.

If someone asks:
"Who is Sandeep?"
explain his profession, education,
technical skills and professional focus.

If someone asks about skills,
list the relevant technical skills.

If someone asks about projects,
explain the projects listed above.

If someone asks for contact information,
provide the relevant contact information
from this profile.

If someone asks something that is not present
in this profile, say that the information is
not available in Sandeep's portfolio profile.

Never claim that Sandeep has worked for a company
unless that company is explicitly listed in this profile.

Never invent salary, job experience,
certifications, awards or achievements.
`;

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  const currentKey =
    process.env.OPENAI_API_KEY?.trim() || "";

  res.json({
    status: "ok",

    aiConfigured:
      currentKey.length > 0,

    keyLength:
      currentKey.length,

    keyStartsWith:
      currentKey.length > 0
        ? currentKey.slice(0, 3)
        : null,

    model
  });
});

/* =========================
   AI CHAT
========================= */

app.post("/api/chat", async (req, res) => {
  try {
    const currentKey =
      process.env.OPENAI_API_KEY?.trim() || "";

    if (!currentKey || !client) {
      return res.status(503).json({
        error:
          "OPENAI_API_KEY is not configured on the server."
      });
    }

    const message =
      typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

    const sessionId =
      typeof req.body?.sessionId === "string" &&
      req.body.sessionId.trim()
        ? req.body.sessionId.trim()
        : crypto.randomUUID();

    if (!message) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: "Message is too long."
      });
    }

    let history =
      sessions.get(sessionId) || [];

    history.push({
      role: "user",
      content: message
    });

    history =
      history.slice(-MAX_MESSAGES);

    const response =
      await client.responses.create({
        model,
        instructions: profile,
        input: history
      });

    const reply =
      response.output_text ||
      "I couldn't generate a response right now.";

    history.push({
      role: "assistant",
      content: reply
    });

    sessions.set(
      sessionId,
      history.slice(-MAX_MESSAGES)
    );

    return res.json({
      reply,
      sessionId
    });

  } catch (error) {

    console.error(
      "AI CHAT ERROR:",
      error?.message || error
    );

    return res.status(500).json({
      error:
        "AI assistant is temporarily unavailable."
    });
  }
});

/* =========================
   ASSIGNMENT BATCH API
========================= */

app.post(
  "/api/assignment/batch",
  async (req, res) => {

    try {

      const currentKey =
        process.env.OPENAI_API_KEY?.trim() || "";

      if (!currentKey || !client) {
        return res.status(503).json({
          error:
            "OPENAI_API_KEY is not configured."
        });
      }

      const questions =
        Array.isArray(req.body?.questions)
          ? req.body.questions.slice(0, 100)
          : [];

      const style =
        [
          "concise",
          "detailed",
          "exam"
        ].includes(req.body?.style)
          ? req.body.style
          : "concise";

      if (!questions.length) {
        return res.status(400).json({
          error:
            "No questions supplied."
        });
      }

      const instruction =
        style === "exam"
          ? "Give a clear exam-ready answer. Use steps, definitions, formulas or examples when useful."
          : style === "detailed"
          ? "Give a correct answer with a useful explanation. Keep it focused."
          : "Give a concise, correct answer. Avoid unnecessary detail.";

      const numbered =
        questions
          .map(
            (question, index) =>
              `${index + 1}. ${String(question).slice(0, 5000)}`
          )
          .join("\n");

      const response =
        await client.responses.create({
          model,

          instructions: `
You are an assignment answer engine.

${instruction}

Return ONLY valid JSON:

{
  "answers": [
    {
      "index": 1,
      "answer": "..."
    }
  ]
}

Answer every numbered question in order.

Do not invent facts.

If a question is ambiguous,
state the reasonable assumption briefly.
`,

          input: numbered
        });

      let parsed;

      try {

        parsed =
          JSON.parse(
            response.output_text
          );

      } catch {

        return res.status(502).json({
          error:
            "The AI returned an invalid batch format. Retry this batch."
        });
      }

      const items =
        Array.isArray(parsed.answers)
          ? parsed.answers
          : [];

      const answers =
        questions.map(
          (question, index) => ({
            question,

            answer:
              items[index]?.answer ||
              "No answer returned."
          })
        );

      return res.json({
        answers
      });

    } catch (error) {

      console.error(
        "ASSIGNMENT BATCH ERROR:",
        error?.message || error
      );

      return res.status(500).json({
        error:
          "Assignment batch temporarily failed."
      });
    }
  }
);

/* =========================
   404 API HANDLER
========================= */

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found."
  });
});

/* =========================
   START SERVER
========================= */

app.listen(
  port,
  () => {
    console.log(
      `Sandeep AI server running on port ${port}`
    );

    console.log(
      `OpenAI API key configured: ${Boolean(
        process.env.OPENAI_API_KEY
      )}`
    );

    console.log(
      `OpenAI model: ${model}`
    );
  }
);

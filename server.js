import express from "express";
import OpenAI from "openai";
import crypto from "node:crypto";

const app = express();
const port = Number(process.env.PORT || 3000);
const model = process.env.OPENAI_MODEL || "gpt-6-luna";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json({ limit: "32kb" }));
app.use(express.static("."));

const sessions = new Map();
const MAX_MESSAGES = 12;

const profile = `
You are Sandeep AI, the friendly portfolio assistant for Sandeep Yadav.
Only present information about Sandeep that is included here:
Name: Sandeep Yadav.
Profession: Software Engineer, Web Developer, Technology Enthusiast.
Education: B.Tech, Dr. A.P.J. Abdul Kalam Technical University (AKTU), Uttar Pradesh.
Schooling: Classes 1-8 at Saraswati Gyan Mandir, NCERT curriculum. Class X: UP Board, 66.33%. Class XII: UP Board, 64.80%.
Skills: HTML5, CSS3, JavaScript, PHP, MySQL, Python, Java, C, C++, Git, GitHub, Responsive Design, REST/API basics, VS Code, XAMPP, phpMyAdmin.
Projects: Task Management Dashboard; Login & Registration System; Responsive Web Projects.
Links: GitHub https://github.com/sky811572 ; LinkedIn https://www.linkedin.com/in/sandeep8115 ; Instagram https://www.instagram.com/sandeep_yadav_0.7_/ ; Linktree https://linktr.ee/sandeep_yadav_07 ; WhatsApp https://wa.me/918115728884 ; Email sky811572@gmail.com.
Answer naturally in the user's language. If the user asks for facts not listed here, say you don't have that information rather than inventing it.
Keep portfolio answers concise, helpful and professional. For hiring questions, encourage the visitor to contact Sandeep through the listed contact links.
`;

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "OPENAI_API_KEY is not configured on the server." });
    }

    const message = typeof req.body?.message === "string"
      ? req.body.message.trim()
      : "";

    let sessionId = typeof req.body?.sessionId === "string"
      ? req.body.sessionId.trim()
      : "";

    if (!message || message.length > 1200) {
      return res.status(400).json({ error: "Invalid message." });
    }

    if (!sessionId || sessionId.length > 120) {
      sessionId = crypto.randomUUID();
    }

    let history = sessions.get(sessionId) || [];
    history.push({ role: "user", content: message });
    history = history.slice(-MAX_MESSAGES);

    const response = await client.responses.create({
      model,
      instructions: profile,
      input: history
    });

    const reply = response.output_text || "I couldn't generate a response right now.";

    history.push({ role: "assistant", content: reply });
    sessions.set(sessionId, history.slice(-MAX_MESSAGES));

    res.json({ reply, sessionId });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ error: "AI assistant is temporarily unavailable." });
  }
});

app.post("/api/assignment/batch", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "OPENAI_API_KEY is not configured."
      });
    }

    const questions = Array.isArray(req.body?.questions)
      ? req.body.questions.slice(0, 100)
      : [];

    const style = ["concise", "detailed", "exam"].includes(req.body?.style)
      ? req.body.style
      : "concise";

    if (!questions.length) {
      return res.status(400).json({ error: "No questions supplied." });
    }

    const instruction =
      style === "exam"
        ? "Give a clear exam-ready answer. Use steps, definitions, formulas or examples when useful."
        : style === "detailed"
        ? "Give a correct answer with a useful explanation. Keep it focused."
        : "Give a concise, correct answer. Avoid unnecessary detail.";

    const numbered = questions
      .map((q, i) => `${i + 1}. ${String(q).slice(0, 5000)}`)
      .join("\n");

    const response = await client.responses.create({
      model,
      instructions: `You are an assignment answer engine. ${instruction}
Return ONLY valid JSON: {"answers":[{"index":1,"answer":"..."},...]}.
Answer every numbered question in order. Do not invent facts. If a question is ambiguous, state the reasonable assumption briefly.`,
      input: numbered
    });

    let parsed;

    try {
      parsed = JSON.parse(response.output_text);
    } catch {
      return res.status(502).json({
        error: "The AI returned an invalid batch format. Retry this batch."
      });
    }

    const items = Array.isArray(parsed.answers)
      ? parsed.answers
      : [];

    const answers = questions.map((q, i) => ({
      question: q,
      answer: items[i]?.answer || "No answer returned."
    }));

    res.json({ answers });

  } catch (error) {
    console.error("Assignment batch error:", error);
    res.status(500).json({
      error: "Assignment batch temporarily failed."
    });
  }
});

app.listen(port, () => {
  console.log(`Sandeep AI server running on port ${port}`);
});

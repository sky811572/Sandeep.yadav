# AI Assignment Solver

Supports CSV, JSON and TXT question uploads and processes up to 100,000 questions through controlled batches.

## Important
- The browser does not send 100,000 questions in one request.
- It sends controlled batches to `/api/assignment/batch`.
- Keep the OpenAI API key server-side in `.env`.
- Large workloads consume API credits and may take substantial time.
- Review generated answers before academic submission.

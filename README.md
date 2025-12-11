# 📝 Design Document: AI-Powered GitHub Auto-Review System

## 1. Introduction

### 1.1 Goal
The primary goal is to design, build, and integrate an **AI-powered automated review system** within the existing Superteam `earn-agent` service. This system will fetch, analyze, and score public GitHub Pull Requests (PRs) and repositories submitted for Superteam Earn bounties, providing sponsors with accurate, scalable, and automated feedback.

### 1.2 Problem Statement Summary
Manual review of GitHub PR/repo submissions is slow and does not scale. The current system lacks automated fetching, code analysis, and requirement matching for GitHub-based submissions.

### 1.3 Scope of Work
* Design and plan the GitHub auto-review feature, including edge-case handling.
* Develop auto-review functionality within the existing `earn-agent` service.
* Create and integrate events for context generation, review, and cron-job initiation.
* Integrate with the `earn` service to display auto-review results (score, notes, labels) in the Sponsor Dashboard (React/Next.js frontend).
* Implement robust testing against real-world GitHub data.
* Produce a clear score and concise review notes as output.

---

## 2. System Design and Architecture

### 2.1 Overview
The new feature will extend the existing event-based `earn-agent` architecture. It will introduce a new workflow for GitHub submissions, leveraging the GitHub API for data fetching and the existing LLM infrastructure (Vercel AI SDK, OpenRouter) for code analysis and review generation.

### 2.2 Component Breakdown

#### A. Earn Service (Frontend & API)
* **Frontend (Sponsor Dashboard):**
    * **New Feature:** A toggle/button to trigger the GitHub auto-review, similar to existing review features.
    * **Display:** Render the clear score, AI-generated review notes, and relevant labels/metadata in the submission view.
* **API:**
    * Initiate the auto-review process by sending a request to the `earn-agent`'s new GitHub-specific event handler, passing the submission URL (PR or Repo link) and bounty requirements.

#### B. Earn Agent Service (Backend: TypeScript/Node.js, BullMQ/Redis, MySQL)

1.  **New Event Handlers & Queue:**
    * **`github:generateContext`:** (New/Modified) Takes the GitHub URL and bounty requirements.
        * **Action:** Fetches relevant code/metadata from the GitHub API. Parses bounty requirements. Packages all necessary data for the LLM.
        * **Output:** Pushes a job to the `github:reviewSubmission` queue.
    * **`github:reviewSubmission`:** (New) The core processing event.
        * **Action:** Calls the LLM to analyze the context, generate a score, and write review notes.
        * **Output:** Updates the submission record in MySQL with the score, notes, and status, and potentially emits a notification event back to the `earn` service.
    * **Cron Job:** (Modified) Schedules automated reviews for GitHub submissions after their deadline, triggering the `github:generateContext` event for pending submissions.

2.  **GitHub Data Fetching Module:**
    * **Technology:** GitHub API (REST/GraphQL).
    * **Functionality:** Fetch PR title, description, file diffs, commit history, and key repository files (`README`, config files). Implement robust rate-limiting and backoff logic.

3.  **LLM Integration (Vercel AI SDK / OpenRouter):**
    * **Prompt Engineering:** Develop a structured, multi-step prompt for the LLM.
    * **Input:** **Bounty Requirements**, **GitHub Context** (code snippets, diffs, metadata), and a **Scoring Rubric**.
    * **Output Format:** Enforce a strict JSON output schema:
        ```json
        {
          "score": number, // 0-100
          "notes": string, // Concise, actionable feedback
          "labels": string[] // e.g., ["meets-criteria", "needs-refactor"]
        }
        ```
    * **Context Management:** Handle large code/diff inputs using summarization and focusing on key modified files to manage token limits.

---

## 3. Implementation Plan and Key Steps

### Phase 1: Planning and Setup (3-5 days)
1.  **Project Plan Finalization:** Detail API endpoints and LLM prompts.
2.  **GitHub API Wrapper:** Build a reusable module in `earn-agent` for fetching PR and repo data, handling auth and rate limits.
3.  **Database Schema Review:** Confirm/update MySQL schema for review metadata (`github_review_status`, `github_review_score`, etc.).

### Phase 2: Core Development (7-10 days)
1.  **Event and Queue Implementation:** Implement `github:generateContext` and `github:reviewSubmission` jobs in BullMQ.
2.  **Context Generation Logic:** Write logic to transform GitHub API data into clean, LLM-readable input.
3.  **LLM Prompt Engineering:** Develop and test structured prompts to ensure reliable JSON output.
4.  **Integration with Earn Service:** Implement API endpoints in the `earn` service to trigger the review agent.

### Phase 3: Testing and Deployment (4-6 days)
1.  **Unit and Integration Testing:** Test individual components and the full review loop.
2.  **Historical Data Validation:** Test the system against 10-20 *historical* GitHub submissions to validate AI scores against actual human reviews.
3.  **Frontend Integration:** Implement the display logic in the Sponsor Dashboard.
4.  **Edge Case Testing:** Specifically test all identified edge cases (Section 4).

---

## 4. Edge Cases and Mitigations

| Edge Case | Description | Mitigation Strategy |
| :--- | :--- | :--- |
| **Private/Invalid Link** | User submits a private PR/repo link or an invalid URL. | Pre-check URL validity and repository visibility using a fast API call. Fail early and mark the submission as "Review Failed: Invalid/Private Link." |
| **Large PR/Repo** | PR with thousands of lines of diff or a very large repository (token limit concern). | **Chunking/Summarization:** Prioritize fetching diffs for core files and summarizing large file contents. Focus the LLM on the `README` and curated key files. |
| **Rate Limiting** | Hitting GitHub API rate limits due to high volume. | Implement exponential backoff and job delay/re-queuing in BullMQ when a rate limit error is encountered. |
| **LLM Hallucination/Bias** | The AI produces an irrelevant, biased, or factually incorrect review/score. | **Prompt Structure:** Use strict JSON schema output and instruct the LLM to base its analysis *only* on the provided context. Implement post-processing validation. |
| **Dependency Complexity** | The LLM cannot fully assess a complex codebase without running it (functional test). | **Disclaimer:** The auto-review is a **first-pass assessment** of code quality and requirement fulfillment. Notes should guide the human sponsor on verification gaps. |

---

## 5. Success Criteria

The project will be considered successful if:

1.  **End-to-End Functionality:** The feature works seamlessly from frontend trigger to backend processing and result display.
2.  **Accuracy/Validation:** The agent's auto-review scores are consistently close to the actual human-reviewed results on a validation set of historical GitHub submissions (e.g., within 10% tolerance).
3.  **Scalability:** The system handles concurrent reviews without causing API rate-limit issues or queue backlogs.
4.  **Robustness:** All major edge cases are handled gracefully and logged appropriately.

##SynIntView
A high-performance, real-time ecosystem designed for conducting technical assessments. This platform integrates low-latency video conferencing, a collaborative code editor, and instant data synchronization to provide a seamless experience for both interviewers and candidates.

Core Features
Real-Time Video Infrastructure: Powered by WebRTC via the Stream Video SDK, featuring hardware testing lobbies, dynamic grid layouts, and automated theater mode for screen sharing.

Collaborative Code Editor: A synchronized Monaco-based editor (the engine behind VS Code) that allows multiple users to write and review code simultaneously with zero-latency updates.

Instant Feedback Syncing: An integrated sidebar for interviewers that persists notes and candidate evaluations directly to a cloud database during the live call.

Automated Scheduling: A dashboard for managing candidate directories and scheduling sessions with unique, secure meeting IDs.

Persistent State Management: Real-time status tracking (Upcoming, Live, Completed) to manage the lifecycle of every interview session.

Technical Stack
Frontend
Next.js 15 (App Router): Utilizing Server Components for optimized data fetching and Client Components for interactive UI elements.

Tailwind CSS: For a responsive, dark-themed interface designed for long-duration technical sessions.

Shadcn/UI: A collection of re-usable, accessible components ensuring a professional and consistent design system.

Lucide React: Vector-based iconography for clear visual communication across the dashboard and meeting rooms.

Backend & Real-Time
Convex: A type-safe, real-time backend and database that handles all mutations, queries, and persistent state without manual WebSockets.

Stream Video SDK: A robust WebRTC framework providing high-fidelity video, audio, and screen-sharing capabilities.

Auth.js (NextAuth): Secure authentication via GitHub OAuth, managing user sessions and identity across the platform.

Engineering Implementation Details
The Layout Engine
The platform utilizes a three-pane layout architecture. The center pane is dedicated to the Code Editor (flex-2), while the right pane stacks the Video Feed and Interviewer Notes vertically. This layout ensures the interviewer maintains visual contact with the candidate while recording feedback and monitoring code progression.

Data Synchronization
All code changes and interviewer notes are handled via Convex mutations. Using a "Patch" strategy rather than full document replacement, the system ensures high-efficiency updates and prevents data loss during concurrent typing sessions.

Security and Middleware
Authentication is enforced at the edge. Next.js middleware and server-side checks verify user sessions before granting access to specific meeting rooms or dashboard data, ensuring that interview metadata remains private and secure.

How to Run Locally
Clone the Repository

Bash
git clone <your-repo-url>
cd technical-interview-platform
Install Dependencies

Bash
npm install
Environment Configuration
Create a .env.local file in the root directory and populate it with the following keys from your Convex, Stream, and Auth.js dashboards:

Code snippet
# Deployment
NEXT_PUBLIC_CONVEX_URL=

# Authentication
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Video Infrastructure
NEXT_PUBLIC_STREAM_API_KEY=
STREAM_SECRET_KEY=
Start the Backend
In a separate terminal, run the Convex development server to handle real-time data and schema validation:

Bash
npx convex dev
Start the Frontend

Bash
npm run dev
Engineering Philosophy
The primary objective of this project was the high-level orchestration of disparate real-time systems. While the user interface utilizes a modern dark-mode aesthetic, the core value lies in the backend architecture and WebRTC signaling logic. This project prioritizes robust feature implementation—such as operational sync and state machine transitions—over decorative design-heavy CSS or complex animations, ensuring the underlying engine is stable for professional use cases.

Key Terminal Commands
npx convex dashboard: Open the web-based UI to monitor the interviews and users tables in real-time.

npm run build: Create an optimized production build of the Next.js application.

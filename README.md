# NexusCore

**An interactive prototype for governing multi-agent software workflows.** NexusCore explores how a team could see what specialized AI agents are doing, inspect their decisions, and pause a feature for human approval before completion. This repository contains the command-center frontend, built with React, TypeScript, Vite, and Tailwind CSS.

> **Project status:** This is a frontend simulation. The agents, security findings, audit events, metrics, and feature runs use seeded data and timed client-side state changes. This repository does not contain an agent runtime, backend API, actual code generation, security scanner, GitHub integration, or deployment pipeline. UI messages about merges and deployments are part of the simulation.

## Purpose

Autonomous coding workflows become difficult to oversee when planning, implementation, security review, and approval happen across several agents. NexusCore presents those steps in one place, with a feature timeline, agent status, review surfaces, governance policies, and an audit trail. It is a product and interaction prototype for human oversight of AI-assisted engineering.

## Agent-governance workflow

1. A user enters a feature description and chooses an agent in **Launch Workflow**.
2. `AppContext` creates a feature and advances it through **Planning → Architecture → Conflict Review → Engineering → Security Review → Compliance → Approved** using timers. It updates visible agent statuses and appends illustrative logs.
3. When the **Require Human Approval for Code Commits** policy is enabled, the simulated run pauses with `awaiting_approval`. The user can approve it, which marks it complete, or reject it, which marks it failed. Both choices add an audit entry.
4. The dashboard, feature list, governance view, security view, and analytics view present the resulting in-memory state. **Run Security Scan** simulates a delay and updates mock findings; it does not inspect files or dependencies.

The launch dialog displays execution mode and security-check controls, but those selections are not passed into the workflow logic. Selecting **Production Commit** does not commit or deploy anything.

## Architecture

| Layer | Repository implementation | Role |
| --- | --- | --- |
| Entry and routing | `src/main.tsx`, `src/app/App.tsx` | Mount the app, route dashboard and section views, open the launch dialog and command palette. |
| Shared state | `src/app/context/AppContext.tsx` | Hold seeded features, agents, findings, policies, settings, metrics, and audit logs; simulate state transitions. |
| Views | `src/app/components/` | Render workflow, governance, feature, agent, security, architecture, analytics, and settings screens. |
| UI and styling | React components, Radix UI, Tailwind CSS, Motion, Recharts | Provide controls, layout, animation, and charts. |

The architecture screen illustrates a proposed agent network and sample JSON messages. Its nodes and contracts are static presentation data, not connected services. State is held in React memory and resets on refresh. The settings form simulates saving; credentials entered there are not used to connect to external services.

## Run locally

Install a current Node.js release and npm, then:

```bash
git clone https://github.com/abdul354/NexusCore.git
cd NexusCore
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production bundle, run `npm run build`. No API keys or backend service are required for the prototype.

## Suggested demo (about two minutes)

1. Open the dashboard and explain the staged workflow and agent activity panels. The initial counts and sample features are illustrative data.
2. Visit **Governance** and enable the human approval policy if it is off.
3. Return to the dashboard, choose **Launch Workflow**, enter a sample feature such as “Add password reset,” and launch it.
4. Open **Features** to follow the timed stage changes and logs. Once the feature reaches `awaiting_approval`, approve or reject it and inspect the new audit entry in **Governance**.
5. Open **Architecture** to discuss the proposed agent roles, then **Security** to show how simulated findings are presented.

The run takes several timed steps. Refreshing the page restores the original sample state.

## My contribution and evidence

The Git history under `abdul354` shows the initial **FrontEnd** commit and follow-up fixes to an image import, the logo, and the search-bar layout. This supports describing my contribution as **frontend implementation and UI fixes**. The history does not separate every screen or interaction by individual author, so I do not attribute particular components or backend work to myself here.

For an AI/ML internship, the project demonstrates an interest in agent orchestration, human approval gates, observable workflow state, and communicating system limits in a usable interface. It does not demonstrate trained models, evaluated agent performance, or a working multi-agent backend in this repository.

## Evidence still needed for broader claims

If the agent service or live hackathon demo exists elsewhere, add a link to its repository or recording, an integration diagram, and a reproducible setup before describing NexusCore as an end-to-end agent system. A short screen recording and screenshots would help reviewers assess the frontend without running it. No benchmark, real security scan result, or production deployment evidence is included here.

# Copilot Instructions

## What This Project Is

Squadforge is a Node.js framework for building one main AI agent that orchestrates specialized subagents. It provides a runtime for agent delegation, tool execution, prompt composition, reusable skills, persisted sessions, and cron-based workflows. It is channel-agnostic: applications plug in their own transport layer and pass normalized messages into the runtime.

## Core Concepts

- `forge(...)` boots the runtime and leader agent.
- `agents/*.md` defines the leader and subagents with frontmatter plus prompt body.
- `prompts/*.md` composes shared instructions for leader and subagent prompts.
- `tools/**/*.js` contains runtime-callable tools.
- `skills/*/SKILL.md` contains reusable workflows loaded into prompts.
- `sessions/` stores conversation state and `crons/` stores scheduled jobs.

## Working Rules

1. Keep changes aligned with the framework's filesystem-driven structure.
2. Prefer extending agents, prompts, tools, and skills instead of hardcoding behavior.
3. Preserve the leader/subagent model: the leader delegates, subagents stay scoped to their allowed tools, and escalations flow back through the runtime.
4. Keep integrations channel-agnostic and consistent with the runtime message/session model.
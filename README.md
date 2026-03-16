<div align="center">

# 🤖 Squadforge

### Forge one main AI agent. Orchestrate the whole squad.

Squadforge is a JavaScript framework for building one main AI agent that coordinates specialized subagents, local tools, prompt files, reusable skills, persisted sessions, and cron-driven workflows.

<p>
  <a href="https://github.com/brumaombra/squadforge"><img alt="GitHub Repo" src="https://img.shields.io/badge/github-brumaombra%2Fsquadforge-111111?logo=github"></a>
  <a href="https://www.npmjs.com/package/squadforge"><img alt="npm" src="https://img.shields.io/badge/npm-squadforge-CB3837?logo=npm&logoColor=white"></a>
  <img alt="Node 18+" src="https://img.shields.io/badge/node-%3E%3D18-3C873A?logo=node.js&logoColor=white">
  <img alt="License MIT" src="https://img.shields.io/badge/license-MIT-2563EB">
  <img alt="Status Early Release" src="https://img.shields.io/badge/status-early%200.x-F59E0B">
</p>

<p>
  🧠 Main-agent orchestration • 🤝 Specialized subagents • 🛠️ Tool runtime • 🧩 Prompt + skill loading • ⏰ Cron workflows
</p>

<p>
  <a href="#features"><strong>Features</strong></a> •
  <a href="#install"><strong>Install</strong></a> •
  <a href="#quick-start"><strong>Quick Start</strong></a> •
  <a href="#project-layout"><strong>Project Layout</strong></a> •
  <a href="#built-in-tools"><strong>Built-in Tools</strong></a> •
  <a href="#public-api"><strong>Public API</strong></a>
</p>

</div>

Squadforge is designed for agent systems that need a clean filesystem convention, a long-lived runtime loop, and built-in delegation primitives without forcing application code to own the orchestration internals.

## ✨ Features

- Filesystem-driven app structure for agents, prompts, skills, tools, sessions, and crons
- Single `forge(...)` entrypoint for booting a runtime-backed leader agent
- Built-in leader and subagent communication primitives
- Background subagent registry with follow-up chat support
- Persistent session storage with trimming and TTL cleanup
- Runtime-owned cron scheduling with queueing into agent sessions
- OpenRouter-backed LLM client included out of the box
- Channel-agnostic inbound and outbound runtime message contract

## 📦 Install

```bash
npm install squadforge
```

Requirements:

- Node.js 18 or newer

## 🚀 Quick Start

```js
import { forge, OpenRouterLlm } from 'squadforge';

const agent = await forge({
    rootDir: process.cwd(),
    llm: new OpenRouterLlm({
        apiKey: process.env.OPENROUTER_API_KEY
    }),
    model: 'openai/gpt-5-mini'
});

agent.onMessage(receiveMessage => {
    telegram.on('message', update => {
        receiveMessage({
            sessionId: `telegram:${update.chat.id}`,
            role: 'user',
            content: update.text,
            replyToId: update.message_id
        });
    });
});

agent.sendMessage(async message => {
    await telegram.sendMessage(message.sessionId.split(':')[1], message.content);
});

await agent.start();
```

## 🗂️ Project Layout

```text
my-app/
  agents/
    leader.md
    researcher.md
    coder.md
  prompts/
    SUBAGENTS.md
    TOOLS.md
    SKILLS.md
    SUBAGENT.md
  skills/
    research-report/
      SKILL.md
  tools/
    web/
      web_search.js
    filesystem/
      read_file.js
  sessions/
  crons/
```

## 🤖 Agent Definitions

Each agent lives in `agents/<id>.md`.

Example:

```md
---
name: Researcher
description: Searches the web and summarizes findings.
allowed_tools:
  - web_search
model: openai/gpt-5-mini
---

You are a research specialist.
```

Rules:

- `leader.md` is required
- at least one non-leader subagent file is required
- `allowed_tools` may list external tools; built-in tools are injected automatically by role

## 🧩 Prompt Composition

Squadforge uses the markdown body of each file in `agents/` as the base prompt for that agent.

- Leader prompt: `agents/leader.md` + `prompts/SUBAGENTS.md` + `prompts/TOOLS.md` + `prompts/SKILLS.md`
- Subagent prompt: `prompts/SUBAGENT.md` + subagent markdown body + `prompts/TOOLS.md`

If the `prompts/` directory or one of the supported prompt files is missing, Squadforge scaffolds the defaults automatically.

Supported placeholders inside prompt fragments:

- `{subagentsList}`
- `{toolsList}`
- `{skillsList}`

## 🛠️ Built-in Tools

Leader agents automatically receive:

- `get_datetime`
- `read_file`
- `send_file`
- `subagent_start`
- `subagent_chat`
- `subagent_list`

Subagents automatically receive:

- `get_datetime`
- `ask_main_agent`

Cron management tools are also available in the runtime tool catalog:

- `cron_create`
- `cron_get`
- `cron_list`
- `cron_update`
- `cron_delete`

## 🧠 Skills

Each skill lives under `skills/<skill-id>/SKILL.md`.

Supported frontmatter fields:

- `name`
- `description`

Loaded skills are injected into `prompts/SKILLS.md` and are available to prompt composition.

## 📡 Channel Contract

Squadforge keeps channel integration outside the runtime, but the runtime speaks one normalized message shape.

Inbound messages accepted by `onMessage(...)`:

- `sessionId` or `sessionKey`: required session identifier
- `role`: optional, defaults to `user`
- `content`: optional text content
- `replyToId`: optional transport-specific reply target
- `metadata`: optional adapter-defined metadata
- `file`: optional inbound file payload

Outbound messages emitted through `sendMessage(...)` and direct runtime sends:

- `sessionId`
- `sessionKey`
- `role`
- `content`
- `replyToId`
- `metadata`
- `timedOut`
- `error`
- `file`

Outbound file payload shape:

- `path`
- `caption`
- `name`
- `mimeType`
- `metadata`

## ⏱️ Runtime Policies

Default runtime behavior:

- soft runtime deadline per agent run: 5 minutes
- wrap-up warning threshold: 60 seconds remaining
- maximum messages kept per session: 50
- session TTL for non-leader sessions: 24 hours
- transient LLM retries: 2

These can be overridden through `forge(...)`:

```js
const agent = await forge({
    maxRuntimeMs: 5 * 60 * 1000,
    wrapUpThresholdMs: 60 * 1000,
    maxMessagesPerSession: 50,
    sessionTtlMs: 24 * 60 * 60 * 1000,
    llmChatMaxRetries: 2
});
```

The runtime checks deadlines between turns. It does not cancel in-flight LLM requests or already-running tool executions.

## 📚 Public API

Current exports:

- `forge`
- `OpenRouterLlm`
- `logger`
- `resolveLogFiles`
- `readLogTail`
- config constants from `src/config.js`

The folder loaders and most runtime internals are intentionally private.

## 🧪 Development

Run the test suite:

```bash
npm test
```

Run the example from a repository checkout:

```bash
npm run example
```

## ⚖️ License

MIT
---
title: "Building a CLI Agent with ReAct Pattern"
date: 2026-07-15
tags: [Node.js, TypeScript, Agent, AI]
category: project
slug: cli-agent-react
---

I built a **CLI agent** that brings LLM-powered task automation directly to the terminal. It uses the **ReAct** (Reasoning + Acting) pattern to break down complex tasks into executable steps.

## What It Does

The agent sits in your terminal and can:

- Answer questions using file search and web lookups
- Execute shell commands with permission control
- Manage tasks with todo/plan tracking
- Maintain conversation memory across sessions

## Architecture

Built with **Node.js + TypeScript**, the agent follows the ReAct pattern:

```
User Input → Thought → Action → Observation → Thought → ... → Final Answer
```

Each cycle, the LLM reasons about what to do, picks a tool, and observes the result before deciding the next step. This loop continues until the task is complete.

## Tool Chain

The agent has a growing set of tools:

- **File search** — Find files by pattern and content
- **File read/edit** — View and modify files with absolute path support
- **Command execution** — Run shell commands with user confirmation
- **Task management** — Create, track, and update todo items

## Feishu Integration

One of the most interesting features is the **Feishu (Lark) long-connection integration**. The same agent that works in the terminal can also be invoked through IM, making it available in both environments from a single codebase.

## Key Design Decisions

- **Session persistence** — Conversation state is saved and can be restored
- **Context compression** — Prevents context window overflow in long conversations
- **Permission control** — Every tool execution requires explicit user approval

Building this gave me a deep appreciation for the challenges of productionizing LLM agents — from error recovery to token management to user experience design.

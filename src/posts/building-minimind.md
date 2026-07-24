---
title: "Building MiniMind: A 26M Parameter LLM from Scratch"
date: 2026-07-20
tags: [LLM, PyTorch, Transformer, AI]
category: project
slug: building-minimind
---

Over the past few months, I've been working on **MiniMind** — a full reproduction of a Decoder-Only Transformer with 26 million parameters. The goal was simple: understand every component of a modern LLM by building it from scratch.

## Architecture

MiniMind follows the standard decoder-only architecture used by GPT-style models:

- **RoPE** (Rotary Position Embedding) for position encoding
- **GQA** (Grouped Query Attention) for efficient attention computation
- **RMSNorm** for layer normalization
- **SwiGLU** activation in the feed-forward network

Each component was implemented manually in PyTorch, which gave me a deep understanding of the mathematical underpinnings.

## The Full Pipeline

Beyond just the model architecture, I replicated the entire training pipeline:

1. **BPE Tokenizer** — Trained from scratch on the training corpus
2. **Pre-training** — Next-token prediction on a large text corpus
3. **SFT** (Supervised Fine-Tuning) — Instruction tuning on curated datasets
4. **RLHF** (Reinforcement Learning from Human Feedback) — Alignment with human preferences

## Multimodal Extension: MiniMind-V

I also extended the project to handle vision inputs, creating **MiniMind-V**. This involved adding a vision encoder and cross-attention layers to bridge the modality gap.

## Key Takeaways

Building a language model from scratch is one of the best ways to truly understand how LLMs work. The experience gave me practical insights into:

- The engineering challenges of training large models
- How architectural choices affect model behavior
- The importance of data quality in the SFT phase
- Why alignment (RLHF) is crucial for useful model outputs

The full code and training details are available on my GitHub.

---
title: "Building a Multimodal Document RAG System"
date: 2026-07-10
tags: [RAG, LLM, Python, Embedding]
slug: multimodal-document-rag
---

Retrieval-Augmented Generation (RAG) is one of the most practical applications of LLMs today. I built a **multimodal RAG system** that can handle not just text, but also images, tables, and charts found in PDF documents.

## System Architecture

The pipeline has three main stages:

1. **Document Parsing** — Using MinerU to extract text, images, tables, and charts from PDFs
2. **Knowledge Indexing** — Chunking and embedding with vllm for local embedding service
3. **Retrieval & Generation** — Hybrid search with BGE-Reranker for precision

## The Reranking Problem

One of the key challenges in RAG is retrieval quality. Initial results with naive embedding similarity were mediocre. The breakthrough came with **BGE-Reranker**:

| Metric | Baseline | +Reranker |
|--------|----------|-----------|
| Context Precision | 0.542 | **0.993** |
| Factual Correctness | 0.453 | **0.564** |

The reranker dramatically improved precision — from barely better than random to near-perfect.

## Tech Stack

- **RAGAnything** — Core RAG framework
- **LightRAG** — Lightweight retrieval
- **MinerU** — PDF parsing for multimodal content
- **Kimi** — Generation model
- **BGE-Reranker** — Result re-ranking
- **ragas** — Automated evaluation framework

## Evaluation-Driven Development

The entire system was built with evaluation in mind. Using the `ragas` framework, I set up automated benchmarks to measure:

- Context precision and recall
- Faithfulness
- Answer relevancy
- Factual correctness

This data-driven approach made it clear where improvements were needed and whether each change actually moved the needle.

## Lessons Learned

- Embedding quality matters more than model size for retrieval
- Reranking is cheap relative to the quality improvement it provides
- Multimodal parsing (especially tables) is still a hard problem
- Evaluation frameworks are essential for iterative improvement

'use client';

import React, { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { REPO_FILES } from '@/lib/repo-files';
import { createZipBlob, triggerBlobDownload } from '@/lib/zip';
import RepoExplorer from './RepoExplorer';
import ChatbotAdapterStudio from './ChatbotAdapterStudio';
import QRCESimulator from './QRCESimulator';
import GitPublishPanel from './GitPublishPanel';

export default function QRCEWorkspace() {
  const [copiedUniversal, setCopiedUniversal] = useState<boolean>(false);

  const handleDownloadFullZip = () => {
    const entries = REPO_FILES.map((file) => ({
      path: file.path,
      content: file.content,
    }));
    const zipBlob = createZipBlob(entries, 'qrce-skill');
    triggerBlobDownload(zipBlob, 'qrce-skill-v3.0.0.zip');
  };

  const handleCopyQuickSkill = () => {
    const universal =
      REPO_FILES.find((f) => f.path === 'prompts/universal-system-prompt.txt') || REPO_FILES[1];
    navigator.clipboard.writeText(universal.content);
    setCopiedUniversal(true);
    setTimeout(() => setCopiedUniversal(false), 1800);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Strict 3-Zone Top Navigation Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            className="font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            sparsh-keshwani / qrce-skill
          </a>

          {/* Zone 2: 4 Concise Single-Line Nav Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex"
          >
            <a
              href="#repository"
              className="transition-colors hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Repository
            </a>
            <a
              href="#chatbots"
              className="transition-colors hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Chatbot Setup
            </a>
            <a
              href="#simulator"
              className="transition-colors hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              CQS Simulator
            </a>
            <a
              href="#publish"
              className="transition-colors hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Git Publish
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action Button */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleDownloadFullZip}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Repo (.zip)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="top">
        <section className="border-b border-slate-200 bg-slate-50/50 pt-10 pb-12 sm:pt-14">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12"
            >
              {/* Left Editorial Column */}
              <div className="flex flex-col justify-between lg:col-span-7">
                <div>
                  {/* Clean unboxed metadata discipline */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Author: Sparsh Keshwani</span>
                    <span aria-hidden="true">·</span>
                    <span>Version 3.0.0 (Production Grade)</span>
                    <span aria-hidden="true">·</span>
                    <span>MIT License</span>
                    <span aria-hidden="true">·</span>
                    <span>Agent Skill &amp; System Directive</span>
                  </div>

                  <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance] sm:text-4xl lg:text-[42px] lg:leading-[1.14]">
                    Quantitative Rating &amp; Conversion Engine for AI Chatbots and LLMs
                  </h1>

                  <p className="mt-4 max-w-[64ch] text-base leading-relaxed text-slate-600">
                    An open-source multi-factor equity research skill that converts unstructured
                    earnings transcripts, 10-K/10-Q filings, and alternative data into a bounded{' '}
                    <span className="font-[family-name:var(--font-mono)] text-sm font-medium text-slate-900">
                      CQS ∈ [-100, +100]
                    </span>{' '}
                    with SEC XBRL cash-flow verification, Form 4 insider cross-checks, and dynamic
                    macroeconomic regime weighting.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadFullZip}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download GitHub Repo (.zip)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyQuickSkill}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                  >
                    {copiedUniversal ? (
                      <Check className="h-4 w-4 text-emerald-700" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-500" />
                    )}
                    <span>{copiedUniversal ? 'Copied Universal Prompt' : 'Copy Universal Prompt'}</span>
                  </button>
                </div>
              </div>

              {/* Right Equation & Actionable Rating Matrix Card */}
              <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-5">
                <div className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-slate-100">
                  <div className="text-[11px] font-medium text-slate-400">
                    Composite Quant Score Master Equation
                  </div>
                  <div className="mt-1.5 font-[family-name:var(--font-mono)] text-sm font-semibold text-white tabular-nums">
                    CQS = ∑(W_i × S_i) + Δ_HardData + Δ_AltData + Δ_Macro
                  </div>
                </div>

                <div className="divide-y divide-slate-200 text-xs tabular-nums">
                  <div className="grid grid-cols-12 bg-slate-50 px-4 py-2 font-semibold text-slate-600">
                    <span className="col-span-4">Rating</span>
                    <span className="col-span-3">CQS Range</span>
                    <span className="col-span-2">Conf.</span>
                    <span className="col-span-3 text-right">Horizon</span>
                  </div>
                  <div className="grid grid-cols-12 items-center px-4 py-2.5">
                    <span className="col-span-4 font-bold text-emerald-800">STRONG BUY</span>
                    <span className="col-span-3 font-[family-name:var(--font-mono)] text-slate-700">
                      +65 to +100
                    </span>
                    <span className="col-span-2 text-slate-600">≥ 85%</span>
                    <span className="col-span-3 text-right text-slate-600">6–12 Months</span>
                  </div>
                  <div className="grid grid-cols-12 items-center px-4 py-2.5">
                    <span className="col-span-4 font-semibold text-emerald-700">BUY</span>
                    <span className="col-span-3 font-[family-name:var(--font-mono)] text-slate-700">
                      +20 to +64
                    </span>
                    <span className="col-span-2 text-slate-600">≥ 70%</span>
                    <span className="col-span-3 text-right text-slate-600">6–12 Months</span>
                  </div>
                  <div className="grid grid-cols-12 items-center px-4 py-2.5">
                    <span className="col-span-4 font-semibold text-slate-700">HOLD</span>
                    <span className="col-span-3 font-[family-name:var(--font-mono)] text-slate-700">
                      -19 to +19
                    </span>
                    <span className="col-span-2 text-slate-500">N/A</span>
                    <span className="col-span-3 text-right text-slate-600">Neutral</span>
                  </div>
                  <div className="grid grid-cols-12 items-center px-4 py-2.5">
                    <span className="col-span-4 font-semibold text-red-700">SELL</span>
                    <span className="col-span-3 font-[family-name:var(--font-mono)] text-slate-700">
                      -64 to -20
                    </span>
                    <span className="col-span-2 text-slate-600">≥ 70%</span>
                    <span className="col-span-3 text-right text-slate-600">3–6 Months</span>
                  </div>
                  <div className="grid grid-cols-12 items-center px-4 py-2.5">
                    <span className="col-span-4 font-bold text-red-800">STRONG SELL</span>
                    <span className="col-span-3 font-[family-name:var(--font-mono)] text-slate-700">
                      -100 to -65
                    </span>
                    <span className="col-span-2 text-slate-600">≥ 85%</span>
                    <span className="col-span-3 text-right text-slate-600">Immediate</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Full-Width 4-Column Quantitative Architecture Strip Below Hero Split */}
            <div className="mt-8 grid grid-cols-1 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              <div className="p-5">
                <div className="font-[family-name:var(--font-mono)] text-lg font-bold text-slate-900 tabular-nums">
                  4 Macro Regimes
                </div>
                <div className="mt-1 text-xs leading-relaxed text-slate-600">
                  Dynamic W1..W5 re-weighting across Baseline, High Rate, Bull Growth, and
                  Stagflation cycles.
                </div>
              </div>
              <div className="p-5">
                <div className="font-[family-name:var(--font-mono)] text-lg font-bold text-slate-900 tabular-nums">
                  -20 pt XBRL Audit
                </div>
                <div className="mt-1 text-xs leading-relaxed text-slate-600">
                  Automatic divergence deduction when bullish earnings spin conflicts with negative
                  10-Q/10-K Free Cash Flow.
                </div>
              </div>
              <div className="p-5">
                <div className="font-[family-name:var(--font-mono)] text-lg font-bold text-slate-900 tabular-nums">
                  Form 4 &amp; Options Δ
                </div>
                <div className="mt-1 text-xs leading-relaxed text-slate-600">
                  Cross-checks C-suite 90-day &gt;$5M insider selling (-15) vs. &gt;$500k
                  open-market alignment buys (+10).
                </div>
              </div>
              <div className="p-5">
                <div className="font-[family-name:var(--font-mono)] text-lg font-bold text-slate-900 tabular-nums">
                  {REPO_FILES.length} Repository Files
                </div>
                <div className="mt-1 text-xs leading-relaxed text-slate-600">
                  Ready for Claude 3.5/3.7, ChatGPT GPT-4o/o3, Gemini 1.5/2.0, Perplexity, JSON
                  Schema APIs, and Python CLI.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Interactive GitHub Repository Explorer */}
        <RepoExplorer onDownloadFullZip={handleDownloadFullZip} />

        {/* Section 2: Online AI Chatbot & LLM Deployment Studio */}
        <ChatbotAdapterStudio />

        {/* Section 3: Deterministic CQS Formula Simulator & Terminal Sandbox */}
        <QRCESimulator />

        {/* Section 4: Git Push & Archive Export */}
        <GitPublishPanel onDownloadFullZip={handleDownloadFullZip} />
      </main>

      {/* Quiet Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800">
              Quantitative Rating &amp; Conversion Engine (QRCE v3.0.0)
            </span>
            <span aria-hidden="true">·</span>
            <span>Authored by Sparsh Keshwani</span>
            <span aria-hidden="true">·</span>
            <span>Released under MIT License</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#repository" className="hover:text-slate-900 hover:underline">
              Repository Files
            </a>
            <a href="#chatbots" className="hover:text-slate-900 hover:underline">
              Chatbot Adapters
            </a>
            <a href="#simulator" className="hover:text-slate-900 hover:underline">
              CQS Simulator
            </a>
            <a
              href="/assets/aistudio/QUANTITATIVE_RATING___CONVERSION_ENGINE__QRCE__by_Sparsh_Keshwani_-_Skill_8c36bd47.md"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 hover:underline"
            >
              Original Spec (.md)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

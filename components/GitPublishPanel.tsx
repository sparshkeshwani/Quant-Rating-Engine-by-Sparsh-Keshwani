'use client';

import React, { useState } from 'react';
import { Check, Copy, Download, ExternalLink } from 'lucide-react';
import { REPO_FILES } from '@/lib/repo-files';

interface GitPublishPanelProps {
  onDownloadFullZip: () => void;
}

export default function GitPublishPanel({ onDownloadFullZip }: GitPublishPanelProps) {
  const [githubOwner, setGithubOwner] = useState<string>('sparsh-keshwani');
  const [repoSlug, setRepoSlug] = useState<string>('qrce-skill');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [copiedCommands, setCopiedCommands] = useState<boolean>(false);

  const safeOwner = githubOwner.trim() || 'sparsh-keshwani';
  const safeSlug = repoSlug.trim() || 'qrce-skill';

  const cliScript = [
    `# 1. Unzip the downloaded QRCE v3.0.0 repository archive`,
    `unzip qrce-skill-v3.0.0.zip && cd qrce-skill`,
    ``,
    `# 2. Initialize Git and verify deterministic CQS test case`,
    `python3 scripts/qrce_validator.py --ticker NVDA --name "NVIDIA Corporation" --regime bull_growth --fin 92 --grw 95 --val 15 --sen 82 --rsk 70 --consensus beat --options bullish_darkpool`,
    `git init -b main`,
    `git add .`,
    `git commit -m "feat: release Quantitative Rating & Conversion Engine (QRCE v3.0.0)"`,
    ``,
    `# 3. Create & push directly to GitHub via GitHub CLI`,
    `gh repo create ${safeOwner}/${safeSlug} --${visibility} --source=. --remote=origin --push`,
  ].join('\n');

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliScript);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 1800);
  };

  return (
    <section id="publish" className="border-t border-slate-200 bg-slate-50/70 py-14">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900">
            04. Export & Publish to GitHub
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Download the complete multi-directory repository archive and push directly to your
            GitHub account in three commands, or inspect the original source specification markdown.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-1 divide-y divide-slate-200 lg:grid-cols-[400px_minmax(0,1fr)] lg:divide-x lg:divide-y-0">
            <div className="space-y-4 p-6">
              <div>
                <label
                  htmlFor="gh-owner"
                  className="block text-xs font-semibold text-slate-800"
                >
                  GitHub Username or Organization
                </label>
                <input
                  id="gh-owner"
                  type="text"
                  value={githubOwner}
                  onChange={(e) => setGithubOwner(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-slate-900 focus:border-blue-700 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="gh-slug"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Repository Name
                </label>
                <input
                  id="gh-slug"
                  type="text"
                  value={repoSlug}
                  onChange={(e) => setRepoSlug(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-slate-900 focus:border-blue-700 focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-800">
                  Repository Visibility
                </span>
                <div className="mt-1.5 flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setVisibility('public')}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      visibility === 'public'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Public Repository
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      visibility === 'private'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Private Repository
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={onDownloadFullZip}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap"
                >
                  <Download className="h-4 w-4" />
                  <span>Download qrce-skill-v3.0.0.zip ({REPO_FILES.length} Files)</span>
                </button>

                <a
                  href="/assets/aistudio/QUANTITATIVE_RATING___CONVERSION_ENGINE__QRCE__by_Sparsh_Keshwani_-_Skill_8c36bd47.md"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Original Raw QRCE v3.0.0 Markdown</span>
                </a>
              </div>
            </div>

            <div className="flex min-w-0 flex-col bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-3 text-xs text-slate-400">
                <span className="font-[family-name:var(--font-mono)] text-slate-200">
                  github.com/{safeOwner}/{safeSlug}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCli}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 whitespace-nowrap shrink-0"
                >
                  {copiedCommands ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedCommands ? 'Copied Script' : 'Copy Shell Commands'}</span>
                </button>
              </div>
              <pre className="flex-1 overflow-x-auto p-5 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-slate-100">
                <code>{cliScript}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

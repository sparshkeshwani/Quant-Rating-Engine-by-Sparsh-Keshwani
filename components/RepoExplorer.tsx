'use client';

import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Search,
  X,
} from 'lucide-react';
import { REPO_FILES, RepoFileItem } from '@/lib/repo-files';
import { triggerBlobDownload } from '@/lib/zip';
import MarkdownPreview from './MarkdownPreview';

interface RepoExplorerProps {
  onDownloadFullZip: () => void;
}

const FOLDER_ORDER = ['', 'prompts', 'schemas', 'docs', 'examples', 'scripts'];

function getFileIcon(language: RepoFileItem['language']) {
  if (language === 'json') return <FileJson className="h-4 w-4 shrink-0 text-amber-700" />;
  if (language === 'python' || language === 'yaml') {
    return <FileCode className="h-4 w-4 shrink-0 text-blue-700" />;
  }
  return <FileText className="h-4 w-4 shrink-0 text-slate-500" />;
}

export default function RepoExplorer({ onDownloadFullZip }: RepoExplorerProps) {
  const [selectedPath, setSelectedPath] = useState<string>('SKILL.md');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    prompts: true,
    schemas: true,
    docs: true,
    examples: true,
    scripts: true,
  });

  const selectedFile = useMemo(
    () => REPO_FILES.find((f) => f.path === selectedPath) || REPO_FILES[0],
    [selectedPath]
  );

  const filteredFiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return REPO_FILES;
    return REPO_FILES.filter(
      (f) =>
        f.path.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const groupedByFolder = useMemo(() => {
    const groups: Record<string, RepoFileItem[]> = {};
    for (const folder of FOLDER_ORDER) {
      groups[folder] = [];
    }
    for (const file of filteredFiles) {
      if (!groups[file.folder]) groups[file.folder] = [];
      groups[file.folder].push(file);
    }
    return groups;
  }, [filteredFiles]);

  const lineCount = useMemo(() => selectedFile.content.split('\n').length, [selectedFile]);
  const byteSizeKb = useMemo(
    () => (new TextEncoder().encode(selectedFile.content).length / 1024).toFixed(1),
    [selectedFile]
  );

  const isMarkdown = selectedFile.language === 'markdown';
  const effectiveMode = isMarkdown ? viewMode : 'code';

  const handleCopyCurrentFile = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 1800);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    triggerBlobDownload(blob, selectedFile.name);
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  return (
    <section id="repository" className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900">
            01. Repository Explorer & Skill Files
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Browse all {REPO_FILES.length} production files in{' '}
            <span className="font-[family-name:var(--font-mono)] text-slate-800">
              sparsh-keshwani/qrce-skill
            </span>
            , inspect raw prompt directives, or download individual artifacts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedPath('README.md');
              setViewMode('preview');
            }}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedPath === 'README.md'
                ? 'border-blue-700 bg-blue-50 text-blue-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            README.md
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedPath('SKILL.md');
              setViewMode('preview');
            }}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedPath === 'SKILL.md'
                ? 'border-blue-700 bg-blue-50 text-blue-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            SKILL.md
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedPath('schemas/qrce-output.schema.json');
              setViewMode('code');
            }}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedPath === 'schemas/qrce-output.schema.json'
                ? 'border-blue-700 bg-blue-50 text-blue-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            JSON Schema
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedPath('scripts/qrce_validator.py');
              setViewMode('code');
            }}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedPath === 'scripts/qrce_validator.py'
                ? 'border-blue-700 bg-blue-50 text-blue-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Python Validator
          </button>
        </div>
      </div>

      {/* Main GitHub-style Single-Elevation Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Repo Commit / Branch Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-[family-name:var(--font-mono)] font-semibold text-slate-900">
              main
            </span>
            <span aria-hidden="true">·</span>
            <span>Sparsh Keshwani: Release QRCE v3.0.0 Production Grade Multi-LLM Suite</span>
          </div>
          <div className="flex items-center gap-3 tabular-nums">
            <span>{REPO_FILES.length} files</span>
            <span aria-hidden="true">·</span>
            <span>MIT License</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onDownloadFullZip}
              className="font-semibold text-blue-700 hover:text-blue-800 hover:underline whitespace-nowrap shrink-0"
            >
              Download Archive (.zip)
            </button>
          </div>
        </div>

        {/* Two-column Workspace: File Tree + Active Viewer */}
        <div className="grid grid-cols-1 divide-y divide-slate-200 lg:grid-cols-[280px_minmax(0,1fr)] lg:divide-x lg:divide-y-0">
          {/* Left Sidebar Tree */}
          <aside className="bg-slate-50/40">
            <div className="border-b border-slate-200 p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Go to file or search..."
                  aria-label="Filter repository files"
                  className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pr-8 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-xs font-medium text-slate-700">
                  No repository files match &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Try searching by filename, regime, Form 4, or XBRL.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  Clear Filter
                </button>
              </div>
            ) : (
              <nav aria-label="Repository file tree" className="max-h-[680px] overflow-y-auto p-2">
                {/* Folders first (like GitHub) */}
                {FOLDER_ORDER.filter((f) => f !== '').map((folder) => {
                  const items = groupedByFolder[folder] || [];
                  if (items.length === 0) return null;
                  const isOpen = searchQuery ? true : expandedFolders[folder] ?? true;

                  return (
                    <div key={folder} className="mb-1">
                      <button
                        type="button"
                        onClick={() => toggleFolder(folder)}
                        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 whitespace-nowrap"
                      >
                        {isOpen ? (
                          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        )}
                        {isOpen ? (
                          <FolderOpen className="h-4 w-4 shrink-0 text-blue-700" />
                        ) : (
                          <Folder className="h-4 w-4 shrink-0 text-blue-700" />
                        )}
                        <span className="truncate font-[family-name:var(--font-mono)]">
                          {folder}/
                        </span>
                      </button>

                      {isOpen && (
                        <div className="mt-0.5 space-y-0.5 pl-5">
                          {items.map((item) => {
                            const active = item.path === selectedFile.path;
                            return (
                              <button
                                key={item.path}
                                type="button"
                                onClick={() => setSelectedPath(item.path)}
                                className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors whitespace-nowrap ${
                                  active
                                    ? 'bg-blue-700 font-medium text-white'
                                    : 'text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {active ? (
                                  <FileText className="h-3.5 w-3.5 shrink-0 text-blue-100" />
                                ) : (
                                  getFileIcon(item.language)
                                )}
                                <span className="truncate font-[family-name:var(--font-mono)]">
                                  {item.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Root-level files */}
                <div className="mt-1 space-y-0.5 border-t border-slate-200/70 pt-1.5">
                  {(groupedByFolder[''] || []).map((item) => {
                    const active = item.path === selectedFile.path;
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => setSelectedPath(item.path)}
                        className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors whitespace-nowrap ${
                          active
                            ? 'bg-blue-700 font-medium text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {active ? (
                          <FileText className="h-3.5 w-3.5 shrink-0 text-blue-100" />
                        ) : (
                          getFileIcon(item.language)
                        )}
                        <span className="truncate font-[family-name:var(--font-mono)]">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            )}
          </aside>

          {/* Right File Content Viewer */}
          <div className="flex min-w-0 flex-col">
            {/* Active File Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs text-slate-500">
                  <span>qrce-skill</span>
                  <span>/</span>
                  <span className="truncate font-semibold text-slate-900">{selectedFile.path}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
                  <span>{lineCount} lines</span>
                  <span aria-hidden="true">·</span>
                  <span>{byteSizeKb} KB</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedFile.description}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isMarkdown && (
                  <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode('preview')}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        effectiveMode === 'preview'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('code')}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        effectiveMode === 'code'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Raw Code
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCopyCurrentFile}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  {copiedFile ? (
                    <Check className="h-3.5 w-3.5 text-emerald-700" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                  )}
                  <span>{copiedFile ? 'Copied' : 'Copy File'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSingleFile}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Active Body */}
            {effectiveMode === 'preview' ? (
              <div className="max-h-[720px] overflow-y-auto p-6 sm:p-8">
                <MarkdownPreview markdown={selectedFile.content} />
              </div>
            ) : (
              <div className="max-h-[720px] overflow-auto bg-slate-950 p-4 font-[family-name:var(--font-mono)] text-xs leading-6 text-slate-100 tabular-nums">
                <table className="w-full border-collapse">
                  <tbody>
                    {selectedFile.content.split('\n').map((lineText, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/80">
                        <td className="w-12 pr-4 text-right text-slate-500 select-none align-top">
                          {idx + 1}
                        </td>
                        <td className="whitespace-pre text-slate-100">{lineText || ' '}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

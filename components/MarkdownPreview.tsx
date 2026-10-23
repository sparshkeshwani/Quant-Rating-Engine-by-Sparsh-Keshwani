'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface MarkdownPreviewProps {
  markdown: string;
}

function formatMathToken(expr: string): string {
  return expr
    .replace(/\\operatorname\{clamp\}_\{\[-100,\s*\+100\]\}/g, 'clamp[-100, +100]')
    .replace(/\\sum_\{i=1\}\^\{5\}/g, '∑(i=1..5)')
    .replace(/\\Delta_\{\\text\{([^}]+)\}\}/g, 'Δ[$1]')
    .replace(/S_\{\\text\{([^}]+)\}\}/g, 'S_$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\in/g, '∈')
    .replace(/\\times/g, '×')
    .replace(/\\ge/g, '≥')
    .replace(/\\le/g, '≤')
    .replace(/\\pm/g, '±')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\dots/g, '…')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\;/g, ' ')
    .replace(/\\%/g, '%')
    .replace(/\\_/g, '_')
    .trim();
}

function renderInline(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Match inline code `...`, inline math $...$, bold **...**, italic *...*, or links [label](url)
  const pattern = /(`[^`]+`|\$[^$\n]+\$\$?|\*\*[^*]+\*\*|\*[^*\n]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const raw = match[0];
    if (raw.startsWith('`') && raw.endsWith('`')) {
      tokens.push(
        <code
          key={`c-${keyIdx++}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[13px] text-slate-800"
        >
          {raw.slice(1, -1)}
        </code>
      );
    } else if (raw.startsWith('$') && raw.endsWith('$')) {
      const inner = raw.replace(/^\$+|\$+$/g, '');
      // Check if it's a currency value like $5M or $500k without a closing math context
      tokens.push(
        <span
          key={`m-${keyIdx++}`}
          className="rounded bg-slate-50 px-1 py-0.5 font-[family-name:var(--font-mono)] text-[13px] font-medium text-blue-900 tabular-nums"
        >
          {formatMathToken(inner)}
        </span>
      );
    } else if (raw.startsWith('**') && raw.endsWith('**')) {
      tokens.push(
        <strong key={`b-${keyIdx++}`} className="font-semibold text-slate-900">
          {renderInline(raw.slice(2, -2))}
        </strong>
      );
    } else if (raw.startsWith('*') && raw.endsWith('*')) {
      tokens.push(
        <em key={`i-${keyIdx++}`} className="italic text-slate-700">
          {raw.slice(1, -1)}
        </em>
      );
    } else if (raw.startsWith('[')) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(raw);
      if (linkMatch) {
        tokens.push(
          <a
            key={`a-${keyIdx++}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-800"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        tokens.push(raw);
      }
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }
  return tokens;
}

function CodeBlockWithCopy({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="my-5 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2 text-xs text-slate-400">
        <span className="font-[family-name:var(--font-mono)]">{lang || 'terminal'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white whitespace-nowrap shrink-0"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-slate-100 tabular-nums">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  const normalized = markdown.replace(/\r\n/g, '\n');
  let body = normalized;
  let frontmatterRows: Array<{ key: string; value: string }> = [];

  if (normalized.startsWith('---\n')) {
    const endYaml = normalized.indexOf('\n---\n', 4);
    if (endYaml !== -1) {
      const yamlRaw = normalized.slice(4, endYaml);
      body = normalized.slice(endYaml + 5);
      const yamlLines = yamlRaw.split('\n');
      let currentKey = '';
      let currentVal: string[] = [];
      for (const line of yamlLines) {
        const kvMatch = /^([a-zA-Z0-9_-]+):\s*(.*)$/.exec(line);
        if (kvMatch) {
          if (currentKey) {
            frontmatterRows.push({ key: currentKey, value: currentVal.join(' ').trim() });
          }
          currentKey = kvMatch[1];
          currentVal = kvMatch[2] === '>' ? [] : [kvMatch[2]];
        } else if (currentKey) {
          currentVal.push(line.trim().replace(/^-\s*/, '· '));
        }
      }
      if (currentKey) {
        frontmatterRows.push({ key: currentKey, value: currentVal.join(' ').trim() });
      }
    }
  }

  const lines = body.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip blank lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={`hr-${i}`} className="my-7 border-slate-200" />);
      i++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // consume closing ```
      elements.push(<CodeBlockWithCopy key={`cb-${i}`} code={codeLines.join('\n')} lang={lang} />);
      continue;
    }

    // Display math block $$ ... $$
    if (line.trim() === '$$') {
      const mathLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '$$') {
        mathLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <div
          key={`math-${i}`}
          className="my-5 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-center font-[family-name:var(--font-mono)] text-sm font-medium text-slate-900 tabular-nums"
        >
          {formatMathToken(mathLines.join(' '))}
        </div>
      );
      continue;
    }

    // Headings
    const hMatch = /^(#{1,4})\s+(.+)$/.exec(line);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = hMatch[2];
      if (level === 1) {
        elements.push(
          <h1
            key={`h1-${i}`}
            className="mb-4 border-b border-slate-200 pb-3 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900 [text-wrap:balance] sm:text-3xl"
          >
            {renderInline(text)}
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className="mt-8 mb-3 border-b border-slate-100 pb-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-slate-900 [text-wrap:balance]"
          >
            {renderInline(text)}
          </h2>
        );
      } else if (level === 3) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className="mt-6 mb-2 font-[family-name:var(--font-display)] text-base font-semibold text-slate-900"
          >
            {renderInline(text)}
          </h3>
        );
      } else {
        elements.push(
          <h4 key={`h4-${i}`} className="mt-4 mb-1.5 text-sm font-semibold text-slate-800">
            {renderInline(text)}
          </h4>
        );
      }
      i++;
      continue;
    }

    // Markdown table
    if (line.trim().startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr
            .trim()
            .replace(/^\||\|$/g, '')
            .split('|')
            .map((cell) => cell.trim());

        const headers = parseRow(tableLines[0]);
        const dataRows = tableLines.slice(2).map(parseRow);

        elements.push(
          <div key={`tbl-${i}`} className="my-5 overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full border-collapse text-left text-sm tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="px-3.5 py-2.5 text-xs font-semibold text-slate-700">
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className="transition-colors hover:bg-slate-50/80">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2.5 text-[13.5px] text-slate-700 align-top">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Unordered or ordered lists
    if (/^\s*([*-]|\d+\.)\s+/.test(line)) {
      const isOrdered = /^\s*\d+\.\s+/.test(line);
      const listItems: string[] = [];
      while (i < lines.length && /^\s*([*-]|\d+\.)\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*([*-]|\d+\.)\s+/, ''));
        i++;
      }
      const ListTag = isOrdered ? 'ol' : 'ul';
      elements.push(
        <ListTag
          key={`lst-${i}`}
          className={`my-3 space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate-700 ${
            isOrdered ? 'list-decimal' : 'list-disc'
          }`}
        >
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ListTag>
      );
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('|') &&
      lines[i].trim() !== '---' &&
      lines[i].trim() !== '$$' &&
      !/^\s*([*-]|\d+\.)\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    elements.push(
      <p key={`p-${i}`} className="my-3 max-w-[75ch] text-[15px] leading-relaxed text-slate-700">
        {renderInline(paraLines.join(' '))}
      </p>
    );
  }

  return (
    <div className="text-slate-800">
      {frontmatterRows.length > 0 && (
        <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50/70">
          <div className="border-b border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
            Skill Frontmatter Metadata (YAML)
          </div>
          <table className="w-full text-left text-xs tabular-nums">
            <tbody className="divide-y divide-slate-200">
              {frontmatterRows.map((row) => (
                <tr key={row.key}>
                  <th className="w-36 px-4 py-2 font-[family-name:var(--font-mono)] font-medium text-slate-700">
                    {row.key}
                  </th>
                  <td className="px-4 py-2 text-slate-600">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {elements}
    </div>
  );
}

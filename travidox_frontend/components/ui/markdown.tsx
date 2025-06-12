import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn('prose prose-green max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-p:text-gray-600 prose-p:leading-relaxed prose-ul:text-gray-600 prose-ul:leading-relaxed prose-li:my-1 prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-800 prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 space-y-4', className)}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 
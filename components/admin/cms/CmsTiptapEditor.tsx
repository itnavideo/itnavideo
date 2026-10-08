'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Undo,
  Redo
} from 'lucide-react';

interface CmsTiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function CmsTiptapEditor({ content, onChange, placeholder }: CmsTiptapEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Highlight,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!isMounted) {
    return (
      <div className="min-h-[300px] border border-slate-200 rounded-2xl bg-slate-50 p-4 text-xs text-slate-400">
        Loading editor...
      </div>
    );
  }

  if (!editor) {
    return (
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={14}
        placeholder={placeholder || 'Write content in HTML/Markdown...'}
        className="w-full border border-slate-200 rounded-2xl bg-white p-4 text-sm text-slate-800 focus:outline-none"
      />
    );
  }

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 ${editor.isActive('bold') ? 'bg-slate-200 font-bold text-slate-900' : ''}`}
          title="Bold"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 ${editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : ''}`}
          title="Italic"
        >
          <Italic size={15} />
        </button>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-900' : ''}`}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 text-slate-900' : ''}`}
          title="Heading 3"
        >
          <Heading3 size={15} />
        </button>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : ''}`}
          title="Bullet List"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 ${editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : ''}`}
          title="Ordered List"
        >
          <ListOrdered size={15} />
        </button>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 ${editor.isActive('blockquote') ? 'bg-slate-200 text-slate-900' : ''}`}
          title="Quote"
        >
          <Quote size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 ${editor.isActive('codeBlock') ? 'bg-slate-200 text-slate-900' : ''}`}
          title="Code Block"
        >
          <Code size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 ${editor.isActive('highlight') ? 'bg-slate-200 text-slate-900' : ''}`}
          title="Highlight"
        >
          <Highlighter size={15} />
        </button>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200"
          title="Undo"
        >
          <Undo size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200"
          title="Redo"
        >
          <Redo size={15} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[350px] text-sm text-slate-800 prose max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

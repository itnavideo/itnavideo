'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Heading } from '@tiptap/extension-heading';
import { Link as LinkExtension } from '@tiptap/extension-link';
import { Image as ImageExtension } from '@tiptap/extension-image';
import { Youtube as YoutubeExtension } from '@tiptap/extension-youtube';
import { Table as TableExtension } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Table as TableIcon,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
  Code2,
  Eye,
  Sparkles,
  Plus
} from 'lucide-react';

import CmsMediaPickerModal from './CmsMediaPickerModal';

interface CmsTiptapEditorProps {
  content: string;
  onChange: (htmlContent: string) => void;
  placeholder?: string;
}

export default function CmsTiptapEditor({
  content,
  onChange,
  placeholder = 'Write your article here... Add headings, bullet points, callouts, and images to craft engaging content.',
}: CmsTiptapEditorProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlSource, setHtmlSource] = useState(content || '');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#1a73e8] font-semibold underline underline-offset-4 hover:text-[#1967d2] transition',
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl border border-slate-200 my-6 shadow-md max-w-full h-auto mx-auto block',
        },
      }),
      YoutubeExtension.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl border border-slate-200 my-6 shadow-md overflow-hidden',
        },
      }),
      TableExtension.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-collapse border border-slate-200 my-6 text-xs text-slate-800',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-slate-200 bg-slate-100 p-3 font-bold text-left text-slate-900',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-200 p-3 text-slate-700',
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'bg-yellow-100 text-yellow-900 px-1 py-0.5 rounded font-semibold',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class:
          'prose max-w-none focus:outline-none min-h-[420px] p-6 text-slate-800 text-base leading-relaxed font-sans',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlSource(html);
      onChange(html);
    },
  });

  if (!editor) return null;

  const handleInsertImage = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
  };

  const handleInsertYoutube = () => {
    if (youtubeUrl) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
      setYoutubeUrl('');
      setIsYoutubeDialogOpen(false);
    }
  };

  const handleInsertCtaButton = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="my-8 text-center"><a href="/dashboard" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1967d2] text-white font-bold text-sm shadow-md transition no-underline"><span>Try Itnavideo Studio Free</span> &rarr;</a></div>`
      )
      .run();
  };

  const handleHtmlSourceSave = () => {
    editor.commands.setContent(htmlSource);
    onChange(htmlSource);
    setIsHtmlMode(false);
  };

  return (
    <div
      className={`w-full bg-white text-slate-900 transition-all ${
        isFullScreen ? 'fixed inset-0 z-50 rounded-none h-screen flex flex-col' : 'relative'
      }`}
    >
      {/* Clean Toolbar */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50/90 backdrop-blur-md">
        {/* View Controls */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            title={isHtmlMode ? 'Visual Mode' : 'Raw HTML'}
            className={`p-1.5 rounded-lg text-xs font-semibold transition ${
              isHtmlMode ? 'bg-[#1a73e8] text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isHtmlMode ? <Eye size={15} /> : <Code2 size={15} />}
          </button>
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition"
          >
            {isFullScreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded text-xs font-bold ${
              editor.isActive('heading', { level: 2 }) ? 'bg-[#1a73e8] text-white' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 rounded text-xs font-bold ${
              editor.isActive('heading', { level: 3 }) ? 'bg-[#1a73e8] text-white' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`px-2 py-1 rounded text-xs font-semibold ${
              editor.isActive('paragraph') && !editor.isActive('heading') ? 'bg-[#1a73e8] text-white' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            P
          </button>
        </div>

        {/* Basic Styles */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-[#1a73e8] text-white' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-[#1a73e8] text-white' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded ${editor.isActive('underline') ? 'bg-[#1a73e8] text-white' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            <UnderlineIcon size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-1.5 rounded ${editor.isActive('highlight') ? 'bg-yellow-200 text-yellow-900' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            <Highlighter size={15} />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-[#1a73e8] text-white' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            <List size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-[#1a73e8] text-white' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            <ListOrdered size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded ${editor.isActive('blockquote') ? 'bg-[#1a73e8] text-white' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            <Quote size={15} />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#1a73e8] text-white' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            <AlignLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#1a73e8] text-white' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            <AlignCenter size={15} />
          </button>
        </div>

        {/* Media & Table Inserts */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="p-1.5 rounded text-slate-700 hover:bg-slate-200 flex items-center gap-1 text-xs font-semibold"
            title="Insert Cloudinary Image"
          >
            <ImageIcon size={15} className="text-[#1a73e8]" />
          </button>
          <button
            type="button"
            onClick={() => setIsYoutubeDialogOpen(true)}
            className="p-1.5 rounded text-slate-700 hover:bg-slate-200 flex items-center gap-1 text-xs font-semibold"
            title="Embed YouTube Video"
          >
            <YoutubeIcon size={15} className="text-red-600" />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
            className="p-1.5 rounded text-slate-700 hover:bg-slate-200"
            title="Insert Table"
          >
            <TableIcon size={15} />
          </button>
          <button
            type="button"
            onClick={handleInsertCtaButton}
            className="px-2 py-1 rounded bg-blue-50 text-[#1a73e8] border border-blue-200 text-xs font-bold hover:bg-blue-100 flex items-center gap-1"
            title="Insert Studio CTA"
          >
            <Sparkles size={13} /> CTA
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 ml-auto">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className="p-1.5 rounded text-slate-500 hover:bg-slate-200"
          >
            <Undo size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className="p-1.5 rounded text-slate-500 hover:bg-slate-200"
          >
            <Redo size={14} />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className={`p-2 sm:p-6 ${isFullScreen ? 'flex-1 overflow-y-auto' : ''}`}>
        {isHtmlMode ? (
          <div className="space-y-4">
            <textarea
              value={htmlSource}
              onChange={(e) => setHtmlSource(e.target.value)}
              className="w-full h-96 p-4 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#1a73e8] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleHtmlSourceSave}
              className="px-4 py-2 bg-[#1a73e8] text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Apply HTML Changes
            </button>
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Media Picker Modal */}
      {isMediaModalOpen && (
        <CmsMediaPickerModal
          onSelect={(url) => {
            handleInsertImage(url);
            setIsMediaModalOpen(false);
          }}
          onClose={() => setIsMediaModalOpen(false)}
        />
      )}

      {/* YouTube Dialog */}
      {isYoutubeDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Embed YouTube Video</h3>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsYoutubeDialogOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertYoutube}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Insert Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

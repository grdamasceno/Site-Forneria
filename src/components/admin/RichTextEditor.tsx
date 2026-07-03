"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useState } from "react";

/**
 * Convert whatever is stored in `conteudo` into HTML the editor can load.
 * Already-HTML content passes through; legacy plain text (one paragraph per
 * line) is escaped and wrapped in <p> so old posts still open cleanly.
 */
function toInitialHTML(raw?: string | null) {
  const s = (raw ?? "").trim();
  if (!s) return "";
  if (/<(p|br|strong|b|em|i|a|ul|ol|li|h[1-6])[\s>/]/i.test(s)) return s;
  const esc = (t: string) =>
    t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return s
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `<p>${esc(l)}</p>`)
    .join("");
}

function Btn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`h-8 min-w-8 rounded px-2 text-sm font-semibold transition ${
        active ? "bg-forneria-red text-white" : "bg-white text-forneria-black hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL do link:", prev ?? "https://");
    if (url === null) return; // cancelled
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 bg-gray-50 p-1.5">
      <Btn title="Negrito" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <strong>B</strong>
      </Btn>
      <Btn title="Itálico" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <em>I</em>
      </Btn>
      <Btn title="Título" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H
      </Btn>
      <span className="mx-1 h-5 w-px bg-gray-300" />
      <Btn title="Lista" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • Lista
      </Btn>
      <Btn title="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. Lista
      </Btn>
      <span className="mx-1 h-5 w-px bg-gray-300" />
      <Btn title="Inserir/editar link" active={editor.isActive("link")} onClick={setLink}>
        🔗 Link
      </Btn>
      <Btn title="Remover link" onClick={() => editor.chain().focus().unsetLink().run()}>
        ⛌ Link
      </Btn>
    </div>
  );
}

/**
 * Rich text editor for the admin. Emits HTML into a hidden input named `name`
 * so it submits with the surrounding <form> (no backend change needed).
 */
export default function RichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [html, setHtml] = useState(() => toInitialHTML(defaultValue));

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: toInitialHTML(defaultValue),
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "richtext min-h-[220px] max-h-[45vh] overflow-y-auto px-3 py-2 focus:outline-none",
      },
    },
  });

  return (
    <div className="overflow-hidden rounded-md border border-gray-300">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

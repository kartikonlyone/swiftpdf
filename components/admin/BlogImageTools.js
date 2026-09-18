"use client";

import { useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

/**
 * Image tooling for the blog editor:
 *  - Featured image: upload + preview, written into a hidden
 *    `featuredImageId` field the create/update server action reads.
 *  - Insert into content: uploads an image and inserts an <img> tag directly
 *    into the content textarea at the cursor position (the editor is a raw
 *    HTML textarea, not a rich-text editor, so this is a plain DOM
 *    insertion rather than an editor-API call).
 */
export default function BlogImageTools({ contentTextareaId = "content" }) {
  const [featuredImage, setFeaturedImage] = useState(null);

  function insertIntoContent(media) {
    const textarea = document.getElementById(contentTextareaId);
    const tag = `<img src="${media.url}" alt="${media.altText || ""}" loading="lazy" />`;
    if (!textarea) return;

    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const before = textarea.value.slice(0, start);
    const after = textarea.value.slice(end);
    textarea.value = `${before}\n${tag}\n${after}`;
    // Native textareas aren't React-controlled here, so dispatching an
    // input event keeps any other listeners (e.g. a character counter) in sync.
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
  }

  return (
    <div className="space-y-4 rounded-card border border-ink/10 p-4">
      <div>
        <p className="text-sm font-medium text-ink">Featured image</p>
        <input type="hidden" name="featuredImageId" value={featuredImage?.id || ""} />
        {featuredImage ? (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featuredImage.url} alt="" className="h-16 w-16 rounded object-cover" />
            <button type="button" onClick={() => setFeaturedImage(null)} className="text-sm text-red-600 hover:underline">
              Remove
            </button>
          </div>
        ) : (
          <div className="mt-2">
            <MediaUploader buttonLabel="Set featured image" onUploaded={(media) => setFeaturedImage(media)} />
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-ink">Insert image into content</p>
        <div className="mt-2">
          <MediaUploader buttonLabel="Insert image" onUploaded={insertIntoContent} />
        </div>
        <p className="mt-1 text-xs text-ink/45">Uploads and drops an &lt;img&gt; tag at your cursor position in the content box below.</p>
      </div>
    </div>
  );
}

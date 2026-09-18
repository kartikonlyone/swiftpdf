"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

export default function MediaLibraryUploadSection() {
  const router = useRouter();
  const [lastUploaded, setLastUploaded] = useState(null);

  function handleUploaded(media, isPermanentUrl) {
    setLastUploaded({ ...media, isPermanentUrl });
    router.refresh(); // pulls the new item into the grid below
  }

  return (
    <div className="mt-6 rounded-card border border-ink/10 bg-white p-5">
      <MediaUploader onUploaded={handleUploaded} buttonLabel="Upload image" />
      {lastUploaded && (
        <div className="mt-3 text-sm text-ink/60">
          <p>
            Uploaded — <span className="font-mono text-xs">{lastUploaded.url}</span>
          </p>
          {!lastUploaded.isPermanentUrl && (
            <p className="mt-1 text-amber-700">
              ⚠ STORAGE_PUBLIC_BASE_URL isn't set, so this URL is a temporary signed link
              (expires in 7 days). Set it in Settings before using this image in a published post.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

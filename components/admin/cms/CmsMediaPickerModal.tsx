'use client';

import React from 'react';
import CmsMediaModal from './CmsMediaModal';

interface CmsMediaPickerModalProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function CmsMediaPickerModal({ onSelect, onClose }: CmsMediaPickerModalProps) {
  return (
    <CmsMediaModal
      isOpen={true}
      onClose={onClose}
      onSelect={(media) => {
        if (media && media.url) {
          onSelect(media.url);
        }
      }}
    />
  );
}

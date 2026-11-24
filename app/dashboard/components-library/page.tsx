import React from 'react';
import type { Metadata } from 'next';
import ComponentsLibraryClient from './ComponentsLibraryClient';

export const metadata: Metadata = {
  title: '1,292+ Video Motion Graphics & Component Library | Itnavideo',
  description: 'Search, inspect, and preview all 1,292 broadcast-ready Remotion motion graphic components and visual assets.',
};

export default function ComponentsLibraryPage() {
  return <ComponentsLibraryClient />;
}


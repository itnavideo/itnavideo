import fs from 'fs';

function inspectStudio(filePath, searchTerms) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n================ ${filePath} ================`);
  searchTerms.forEach(term => {
    const reg = new RegExp(`.{0,40}${term}.{0,60}`, 'gi');
    const matches = content.match(reg) || [];
    console.log(`Term "${term}": ${matches.length} occurrences`);
    matches.slice(0, 2).forEach(m => console.log(`   -> ${m.trim()}`));
  });
}

inspectStudio('components/dashboard/BookSummaryStudio.tsx', ['bookTitle', 'author', 'chapter', 'key takeaway', 'Theme']);
inspectStudio('components/dashboard/ImageToVideoStudio.tsx', ['parallax', 'motion', 'Ken Burns', 'pan', 'zoom']);
inspectStudio('components/dashboard/YoutubeSubtitlesStudio.tsx', ['safe-zone', 'scrubber', 'placement', 'burn']);
inspectStudio('components/dashboard/WhiteboardStudio.tsx', ['hand', 'marker', 'doodle', 'stickman', 'color']);
inspectStudio('components/dashboard/CompareExplainerStudio.tsx', ['character', 'winner', 'verdict', 'versus', 'subject']);
inspectStudio('components/dashboard/LongVideoClipsStudio.tsx', ['hook', 'clips', 'duration', 'ratio']);
inspectStudio('components/dashboard/LongVideoPromoStudio.tsx', ['teaser', 'countdown', 'cta', 'promo']);
inspectStudio('components/dashboard/SplitScreenExplainerStudio.tsx', ['layout', 'top', 'bottom', 'camera', 'gameplay']);
inspectStudio('components/dashboard/AudioCleanStudio.tsx', ['noise', 'retake', 'master', 'pacing']);

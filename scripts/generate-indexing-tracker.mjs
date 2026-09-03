/**
 * Generate itnavideo-indexing-tracker.xlsx
 * Run: node scripts/generate-indexing-tracker.mjs
 */
import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, '..', 'itnavideo-indexing-tracker.xlsx');

const siteUrl = 'https://www.itnavideo.com';

// All pages organized by type
const pages = [
  // === Core Pages ===
  { title: 'Homepage', path: '/', type: 'Homepage', priority: 'High' },
  { title: 'Pricing — Simple Video Credits', path: '/pricing', type: 'Pricing', priority: 'High' },
  { title: 'Templates Gallery', path: '/templates', type: 'Template page', priority: 'High' },
  { title: 'Features', path: '/features', type: 'Features', priority: 'High' },
  { title: 'About Itnavideo', path: '/about', type: 'About', priority: 'Medium' },
  { title: 'Contact', path: '/contact', type: 'Contact', priority: 'Medium' },
  { title: 'Careers', path: '/careers', type: 'Careers', priority: 'Low' },
  { title: 'Privacy Policy', path: '/privacy', type: 'Legal page', priority: 'Low' },
  { title: 'Terms of Service', path: '/terms', type: 'Legal page', priority: 'Low' },

  // === Creator/Conversion Pages ===
  { title: 'Create a Reel', path: '/create', type: 'Conversion page', priority: 'High' },
  { title: 'Promote & Earn Free Credits', path: '/promote-and-earn', type: 'Creator rewards page', priority: 'High' },
  { title: 'AI Platform Facts', path: '/ai-platform-facts', type: 'Landing page', priority: 'Medium' },
  { title: 'Blog — AI Video Blog', path: '/blog', type: 'Blog index', priority: 'High' },

  // === Template-Specific Pages ===
  { title: 'Auto Caption Reel Template', path: '/templates/auto-caption-reel', type: 'Template page', priority: 'High' },
  { title: 'Video Simple Explainer Template', path: '/templates/video-simple-explainer', type: 'Template page', priority: 'High' },
  { title: 'Compare Explainer Template', path: '/templates/compare-explainer', type: 'Template page', priority: 'High' },
  { title: 'Cinematic Collage Template', path: '/templates/cinematic-collage', type: 'Template page', priority: 'High' },
  { title: 'Auto Draw Explainer Template', path: '/templates/auto-draw-explainer', type: 'Template page', priority: 'High' },
  { title: 'Long Video Promo Template', path: '/templates/long-video-promo', type: 'Template page', priority: 'High' },

  // === SEO Landing Pages ===
  { title: 'AI Reel Generator', path: '/ai-reel-generator', type: 'SEO landing page', priority: 'High' },
  { title: 'Instagram Reels Maker', path: '/instagram-reels-maker', type: 'SEO landing page', priority: 'High' },
  { title: 'YouTube Shorts Generator', path: '/youtube-shorts-generator', type: 'SEO landing page', priority: 'High' },
  { title: 'AI Explainer Video Generator', path: '/ai-explainer-video-generator', type: 'SEO landing page', priority: 'High' },
  { title: 'AI Subtitle Generator', path: '/ai-subtitle-generator', type: 'SEO landing page', priority: 'High' },
  { title: 'Add Subtitles to Video Online', path: '/add-subtitles-to-video', type: 'SEO landing page', priority: 'High' },
  { title: 'Compare Explainer Video Maker', path: '/compare-explainer-video-maker', type: 'SEO landing page', priority: 'High' },
  { title: 'Auto Caption Video Generator', path: '/auto-caption-video-generator', type: 'SEO landing page', priority: 'High' },
  { title: 'AI Shorts Generator', path: '/ai-shorts-generator', type: 'SEO landing page', priority: 'High' },
  { title: 'Audio to Reels Generator', path: '/audio-to-reels', type: 'SEO landing page', priority: 'High' },
  { title: 'Finance Reel Generator', path: '/finance-reel-generator', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Hinglish Explainer Video Maker', path: '/hinglish-explainer-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Faceless Explainer Video Maker', path: '/faceless-explainer-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Video to Reel Maker', path: '/video-to-reel-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Whiteboard Video Maker', path: '/whiteboard-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Reaction Video Maker', path: '/reaction-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Video Commentary Maker', path: '/video-commentary-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Split Screen Reel Maker', path: '/split-screen-reel-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Ecommerce Product Video Maker', path: '/ecommerce-product-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'News Reel Maker', path: '/news-reel-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Local Business Video Maker', path: '/local-business-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Top 5 List Video Maker', path: '/top-5-list-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Dynamic Creator Reel Maker', path: '/dynamic-creator-reel-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'YouTube Video Promo Maker', path: '/youtube-video-promo-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Study Notes Video Maker', path: '/study-notes-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Quote Video Maker', path: '/quote-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Testimonial Video Maker', path: '/testimonial-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Before After Video Maker', path: '/before-after-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Tutorial Video Maker', path: '/tutorial-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Poll Reel Maker', path: '/poll-reel-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Personal Brand Video Maker', path: '/personal-brand-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Event Video Maker', path: '/event-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Hiring Video Maker', path: '/hiring-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Flashcard Video Maker', path: '/flashcard-video-maker', type: 'SEO landing page', priority: 'Medium' },
  { title: 'Countdown Teaser Video Maker', path: '/countdown-teaser-video-maker', type: 'SEO landing page', priority: 'Medium' },

  // === Blog Posts ===
  { title: 'Itnavideo vs CapCut: AI Reel Workflow', path: '/blog/itnavideo-vs-capcut-ai-reel-workflow', type: 'Blog post', priority: 'High' },
];

async function main() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Itnavideo';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Indexing Tracker', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  // Define columns
  sheet.columns = [
    { header: 'No.', key: 'no', width: 5 },
    { header: 'Page Title', key: 'title', width: 42 },
    { header: 'URL', key: 'url', width: 55 },
    { header: 'Page Type', key: 'type', width: 20 },
    { header: 'Priority', key: 'priority', width: 10 },
    { header: 'Submitted to GSC?', key: 'submitted', width: 18 },
    { header: 'Submitted Date', key: 'submittedDate', width: 16 },
    { header: 'Indexed?', key: 'indexed', width: 10 },
    { header: 'Indexed Date', key: 'indexedDate', width: 16 },
    { header: 'Notes', key: 'notes', width: 30 },
  ];

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1a1a1a' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 22;

  // Add data rows
  pages.forEach((page, index) => {
    const row = sheet.addRow({
      no: index + 1,
      title: page.title,
      url: `${siteUrl}${page.path}`,
      type: page.type,
      priority: page.priority,
      submitted: 'No',
      submittedDate: '',
      indexed: 'No',
      indexedDate: '',
      notes: '',
    });

    // Priority color coding
    const priorityCell = row.getCell('priority');
    if (page.priority === 'High') {
      priorityCell.font = { bold: true, color: { argb: 'FF22c55e' } };
    } else if (page.priority === 'Medium') {
      priorityCell.font = { color: { argb: 'FFfbbf24' } };
    } else {
      priorityCell.font = { color: { argb: 'FF94a3b8' } };
    }

    // Make URL a hyperlink
    const urlCell = row.getCell('url');
    urlCell.value = {
      text: `${siteUrl}${page.path}`,
      hyperlink: `${siteUrl}${page.path}`,
    };
    urlCell.font = { color: { argb: 'FF60a5fa' }, underline: true };

    // Alternate row background
    if (index % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8FAFC' },
      };
    }
  });

  // Add borders to all cells
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
      if (!cell.alignment) cell.alignment = { vertical: 'middle' };
    });
  });

  // Add summary section at bottom
  const totalPages = pages.length;
  const highPriority = pages.filter(p => p.priority === 'High').length;
  const mediumPriority = pages.filter(p => p.priority === 'Medium').length;
  const lowPriority = pages.filter(p => p.priority === 'Low').length;

  sheet.addRow([]);
  const summaryRow = sheet.addRow(['', `Total: ${totalPages} pages | High: ${highPriority} | Medium: ${mediumPriority} | Low: ${lowPriority}`]);
  summaryRow.getCell(2).font = { bold: true, size: 10, color: { argb: 'FF64748B' } };

  sheet.addRow(['', 'Tip: Submit 5-6 high priority pages per day in Google Search Console.']);
  sheet.addRow(['', 'Sitemap URL: https://www.itnavideo.com/sitemap.xml']);

  await workbook.xlsx.writeFile(outputPath);
  console.log(`✅ Excel file created: ${outputPath}`);
  console.log(`   Total pages: ${totalPages}`);
  console.log(`   High priority: ${highPriority}`);
  console.log(`   Medium priority: ${mediumPriority}`);
  console.log(`   Low priority: ${lowPriority}`);
}

main().catch(console.error);

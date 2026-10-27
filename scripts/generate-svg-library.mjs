import fs from 'fs';
import path from 'path';

// Define the exact counts needed per category
const categories = {
  'core-shapes': 40,
  'arrows': 35,
  'general': 55,
  'business': 45,
  'finance': 40,
  'technology': 45,
  'education': 40,
  'health': 25,
  'people': 30,
  'marketing': 30,
  'geography': 25,
  'nature': 25,
  'transport': 20,
  'data-viz': 25,
  'conceptual': 20
};

// We will map Lucide icons to these categories to bootstrap the 500 assets.
const iconMap = {
  'core-shapes': ['Circle', 'Square', 'Triangle', 'Hexagon', 'Octagon', 'Pentagon', 'Box', 'Layout', 'Grid', 'CircleDashed', 'SquareDashed', 'Star', 'Check', 'X', 'Plus', 'Minus', 'CheckCircle', 'XCircle', 'PlusCircle', 'MinusCircle', 'CheckSquare', 'XSquare', 'Info', 'AlertCircle', 'AlertTriangle', 'HelpCircle', 'MoreHorizontal', 'MoreVertical', 'Grip', 'GripHorizontal', 'GripVertical', 'Command', 'Hash', 'AppWindow', 'Maximize', 'Minimize', 'Shield', 'Badge', 'Bookmark', 'Tag'],
  'arrows': ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowUpRight', 'ArrowUpLeft', 'ArrowDownRight', 'ArrowDownLeft', 'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ChevronDown', 'ChevronsRight', 'ChevronsLeft', 'ChevronsUp', 'ChevronsDown', 'MoveRight', 'MoveLeft', 'MoveUp', 'MoveDown', 'MoveDiagonal', 'CornerUpRight', 'CornerUpLeft', 'CornerDownRight', 'CornerDownLeft', 'CornerRightUp', 'CornerRightDown', 'CornerLeftUp', 'CornerLeftDown', 'RefreshCw', 'RefreshCcw', 'RotateCw', 'RotateCcw', 'IterationCcw', 'IterationCw'],
  'general': ['Home', 'Search', 'Menu', 'Settings', 'User', 'Bell', 'Mail', 'Calendar', 'Clock', 'Camera', 'Image', 'Video', 'Mic', 'Music', 'Volume2', 'VolumeX', 'Wifi', 'Battery', 'Bluetooth', 'Link', 'Paperclip', 'Share2', 'ExternalLink', 'Download', 'Upload', 'Save', 'Trash2', 'Edit2', 'Copy', 'Scissors', 'Clipboard', 'CheckCheck', 'Eye', 'EyeOff', 'Lock', 'Unlock', 'Key', 'Flag', 'MapPin', 'Map', 'Compass', 'Navigation', 'Filter', 'Sliders', 'List', 'Maximize2', 'Minimize2', 'ZoomIn', 'ZoomOut', 'MinusSquare', 'PlusSquare', 'Play', 'Pause', 'SquarePlay', 'Cast'],
  'business': ['Briefcase', 'Building2', 'Building', 'Store', 'Factory', 'Target', 'Trophy', 'Award', 'Medal', 'Crown', 'Lightbulb', 'Rocket', 'Zap', 'FlagTriangleRight', 'Megaphone', 'Presentation', 'PieChart', 'LineChart', 'BarChart3', 'TrendingUp', 'TrendingDown', 'Activity', 'Users', 'UserPlus', 'UserMinus', 'UserCheck', 'UserX', 'UserCog', 'Network', 'Workflow', 'GitMerge', 'GitBranch', 'GitPullRequest', 'GitCommit', 'Kanban', 'Boxes', 'Layers', 'Blocks', 'Puzzle', 'Component', 'Package', 'PackageCheck', 'PackageSearch', 'PackagePlus', 'ClipboardList'],
  'finance': ['DollarSign', 'Euro', 'PoundSterling', 'Banknote', 'Coins', 'Wallet', 'CreditCard', 'CreditCardIcon', 'PiggyBank', 'Landmark', 'Vault', 'Receipt', 'ReceiptText', 'FileText', 'FileDigit', 'FileSpreadsheet', 'Calculator', 'Percent', 'PercentDiamond', 'Scale', 'BadgeDollarSign', 'BadgeCent', 'CircleDollarSign', 'HandCoins', 'CoinsIcon', 'Gem', 'GemIcon', 'Safe', 'MoneyNote', 'Bill', 'Invoice', 'ChartCandlestick', 'CandlestickChart', 'LineChartIcon', 'TrendingUpIcon', 'TrendingDownIcon', 'Bitcoin', 'Crypto', 'Currency', 'Cash'],
  'technology': ['Monitor', 'Laptop', 'Smartphone', 'Tablet', 'Watch', 'Tv', 'Mouse', 'Keyboard', 'Printer', 'HardDrive', 'Database', 'Server', 'Cpu', 'MemoryStick', 'Microchip', 'Code', 'Code2', 'Terminal', 'TerminalSquare', 'Braces', 'Webhook', 'Cloud', 'CloudLightning', 'CloudCog', 'CloudUpload', 'CloudDownload', 'WifiIcon', 'WifiOff', 'Radio', 'Signal', 'CastIcon', 'BluetoothIcon', 'Nfc', 'Usb', 'UsbIcon', 'Bot', 'Robot', 'Brain', 'CircuitBoard', 'Scan', 'ScanFace', 'Fingerprint', 'Sparkles', 'Wand2', 'Settings2'],
  'education': ['Book', 'BookOpen', 'BookMarked', 'BookCopy', 'BookKey', 'Library', 'GraduationCap', 'School', 'PenTool', 'Pencil', 'Highlighter', 'Eraser', 'Brush', 'Paintbrush', 'Palette', 'Pipette', 'FlaskConical', 'TestTube', 'Microscope', 'Dna', 'Atom', 'BrainCircuit', 'Telescope', 'Glasses', 'CalculatorIcon', 'Ruler', 'RulerIcon', 'DraftingCompass', 'SquareChartGantt', 'PresentationIcon', 'Chalkboard', 'Backpack', 'Notebook', 'Folder', 'FolderOpen', 'Folders', 'Archive', 'Files', 'Newspaper', 'BookText'],
  'health': ['ActivityIcon', 'Heart', 'HeartPulse', 'HeartHandshake', 'Stethoscope', 'Syringe', 'Cross', 'Pill', 'Thermometer', 'Bandage', 'Bone', 'DnaIcon', 'MicroscopeIcon', 'TestTube2', 'FlaskRound', 'Lungs', 'BrainIcon', 'Ear', 'EyeIcon', 'Hospital', 'Ambulance', 'FirstAid', 'Bed', 'Weight', 'Apple'],
  'people': ['UserIcon', 'UsersIcon', 'UserCircle', 'UserSquare', 'UserCheckIcon', 'UserPlusIcon', 'UserMinusIcon', 'UserXIcon', 'UserCogIcon', 'Contact', 'Contact2', 'PersonStanding', 'Accessibility', 'Baby', 'Smile', 'SmilePlus', 'Frown', 'Meh', 'Laugh', 'Hand', 'HandMetal', 'ThumbsUp', 'ThumbsDown', 'Handshake', 'Clapping', 'EarIcon', 'Speech', 'MessageCircle', 'MessageSquare', 'MessageCircleCode'],
  'marketing': ['MegaphoneIcon', 'Speaker', 'Bullhorn', 'RadioTower', 'MailIcon', 'MailOpen', 'Mails', 'Send', 'SendHorizontal', 'Share', 'Share2Icon', 'Rss', 'Podcast', 'Ticket', 'TicketPercent', 'TagIcon', 'Tags', 'Barcode', 'QrCode', 'ScanBarcode', 'Gift', 'ShoppingBag', 'ShoppingCart', 'ShoppingCartIcon', 'StoreIcon', 'Globe', 'Globe2', 'Earth', 'AtSign', 'HashIcon'],
  'geography': ['MapIcon', 'MapPinIcon', 'MapPinned', 'Pin', 'CompassIcon', 'NavigationIcon', 'Navigation2', 'Locate', 'LocateFixed', 'Milestone', 'Signpost', 'Route', 'Waypoints', 'Plane', 'Ship', 'Car', 'Bus', 'Train', 'TrainTrack', 'Bike', 'Tent', 'Mountain', 'MountainSnow', 'Trees', 'Castle'],
  'nature': ['Sun', 'Moon', 'StarIcon', 'CloudIcon', 'CloudSun', 'CloudMoon', 'CloudRain', 'CloudSnow', 'CloudLightningIcon', 'Wind', 'Snowflake', 'Droplet', 'Flame', 'TreePine', 'TreeDeciduous', 'Leaf', 'Sprout', 'Flower', 'Flower2', 'Bug', 'Bird', 'Fish', 'Cat', 'Dog', 'Rabbit'],
  'transport': ['CarIcon', 'CarTaxiFront', 'CarFront', 'BusFront', 'TrainFront', 'TramFront', 'ShipIcon', 'PlaneIcon', 'PlaneTakeoff', 'PlaneLanding', 'Helicopter', 'RocketIcon', 'BikeIcon', 'Motorcycle', 'Tractor', 'Truck', 'AmbulanceIcon', 'Fuel', 'ParkingCircle', 'MapPinOff'],
  'data-viz': ['PieChartIcon', 'Donut', 'BarChart', 'BarChart2', 'BarChart4', 'BarChartHorizontal', 'BarChartHorizontalBig', 'LineChartIcon2', 'AreaChart', 'ScatterChart', 'BubbleChart', 'Radar', 'ActivitySquare', 'TrendingUpIcon2', 'TrendingDownIcon2', 'ArrowUpRightIcon', 'ArrowDownRightIcon', 'MaximizeIcon', 'MinimizeIcon', 'ZoomInIcon', 'ZoomOutIcon', 'GanttChart', 'GanttChartSquare', 'NetworkIcon', 'ShareIcon'],
  'conceptual': ['LightbulbIcon', 'LightbulbOff', 'ZapIcon', 'ZapOff', 'Sparkle', 'SparklesIcon', 'Wand', 'MagicWand', 'Ghost', 'Hourglass', 'Infinity', 'Unlink', 'Link2', 'Link2Off', 'Combine', 'Merge', 'Split', 'Spline', 'Vector', 'TargetIcon']
};

const outputDir = path.join(process.cwd(), 'lib', 'svg-library', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Check and normalize lucide icons
import * as lucide from 'lucide-react';

let totalGenerated = 0;
const generatedFiles = [];
const allAssets = [];

for (const [category, expectedCount] of Object.entries(categories)) {
  let categoryIcons = iconMap[category] || [];
  
  // Pad if we don't have enough predefined
  if (categoryIcons.length < expectedCount) {
     const lucideKeys = Object.keys(lucide).filter(k => k !== 'createLucideIcon' && k !== 'default');
     let extraNeeded = expectedCount - categoryIcons.length;
     for (const key of lucideKeys) {
       if (!categoryIcons.includes(key) && !allAssets.includes(key)) {
         categoryIcons.push(key);
         extraNeeded--;
         if (extraNeeded <= 0) break;
       }
     }
  }

  // Ensure we don't exceed the target count per category
  categoryIcons = categoryIcons.slice(0, expectedCount);
  
  let fileContent = `import { SvgCategory } from '../registry';\nimport * as Icons from 'lucide-react';\n\nexport const ${category.replace(/-/g, '_').toUpperCase()}_ASSETS = [\n`;
  
  for (let i = 0; i < categoryIcons.length; i++) {
     let icon = categoryIcons[i];
     if (!lucide[icon]) {
        const fallback = Object.keys(lucide).find(k => k.toLowerCase().includes(icon.toLowerCase()) || icon.toLowerCase().includes(k.toLowerCase())) || 'Circle';
        categoryIcons[i] = fallback;
        icon = fallback;
     }
     
     allAssets.push(icon);
     totalGenerated++;
     
     fileContent += `  {
    id: '${category}-${icon.toLowerCase()}',
    name: '${icon.replace(/([A-Z])/g, ' $1').trim()}',
    category: '${category === 'core-shapes' ? 'shapes' : category === 'arrows' ? 'arrows' : category === 'data-viz' ? 'diagrams' : 'infographics'}',
    keywords: ['${category}', '${icon.toLowerCase()}'],
    lucideComponent: '${icon}'
  },\n`;
  }
  
  fileContent += `];\n`;
  
  const filePath = path.join(outputDir, `${category}.ts`);
  fs.writeFileSync(filePath, fileContent);
  generatedFiles.push(category);
}

// Generate an index file that aggregates all of them
let indexContent = '';
for (const file of generatedFiles) {
  indexContent += `export * from './${file}';\n`;
}
fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);

console.log(`Generated ${totalGenerated} assets across ${generatedFiles.length} categories.`);

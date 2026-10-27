import { SvgCategory } from '../registry';
import * as Icons from 'lucide-react';

export const CORE_SHAPES_ASSETS = [
  {
    id: 'core-shapes-circle',
    name: 'Circle',
    category: 'shapes',
    keywords: ['core-shapes', 'circle'],
    lucideComponent: 'Circle'
  },
  {
    id: 'core-shapes-square',
    name: 'Square',
    category: 'shapes',
    keywords: ['core-shapes', 'square'],
    lucideComponent: 'Square'
  },
  {
    id: 'core-shapes-triangle',
    name: 'Triangle',
    category: 'shapes',
    keywords: ['core-shapes', 'triangle'],
    lucideComponent: 'Triangle'
  },
  {
    id: 'core-shapes-hexagon',
    name: 'Hexagon',
    category: 'shapes',
    keywords: ['core-shapes', 'hexagon'],
    lucideComponent: 'Hexagon'
  },
  {
    id: 'core-shapes-octagon',
    name: 'Octagon',
    category: 'shapes',
    keywords: ['core-shapes', 'octagon'],
    lucideComponent: 'Octagon'
  },
  {
    id: 'core-shapes-pentagon',
    name: 'Pentagon',
    category: 'shapes',
    keywords: ['core-shapes', 'pentagon'],
    lucideComponent: 'Pentagon'
  },
  {
    id: 'core-shapes-box',
    name: 'Box',
    category: 'shapes',
    keywords: ['core-shapes', 'box'],
    lucideComponent: 'Box'
  },
  {
    id: 'core-shapes-layout',
    name: 'Layout',
    category: 'shapes',
    keywords: ['core-shapes', 'layout'],
    lucideComponent: 'Layout'
  },
  {
    id: 'core-shapes-grid',
    name: 'Grid',
    category: 'shapes',
    keywords: ['core-shapes', 'grid'],
    lucideComponent: 'Grid'
  },
  {
    id: 'core-shapes-circledashed',
    name: 'Circle Dashed',
    category: 'shapes',
    keywords: ['core-shapes', 'circledashed'],
    lucideComponent: 'CircleDashed'
  },
  {
    id: 'core-shapes-squaredashed',
    name: 'Square Dashed',
    category: 'shapes',
    keywords: ['core-shapes', 'squaredashed'],
    lucideComponent: 'SquareDashed'
  },
  {
    id: 'core-shapes-star',
    name: 'Star',
    category: 'shapes',
    keywords: ['core-shapes', 'star'],
    lucideComponent: 'Star'
  },
  {
    id: 'core-shapes-check',
    name: 'Check',
    category: 'shapes',
    keywords: ['core-shapes', 'check'],
    lucideComponent: 'Check'
  },
  {
    id: 'core-shapes-x',
    name: 'X',
    category: 'shapes',
    keywords: ['core-shapes', 'x'],
    lucideComponent: 'X'
  },
  {
    id: 'core-shapes-plus',
    name: 'Plus',
    category: 'shapes',
    keywords: ['core-shapes', 'plus'],
    lucideComponent: 'Plus'
  },
  {
    id: 'core-shapes-minus',
    name: 'Minus',
    category: 'shapes',
    keywords: ['core-shapes', 'minus'],
    lucideComponent: 'Minus'
  },
  {
    id: 'core-shapes-checkcircle',
    name: 'Check Circle',
    category: 'shapes',
    keywords: ['core-shapes', 'checkcircle'],
    lucideComponent: 'CheckCircle'
  },
  {
    id: 'core-shapes-xcircle',
    name: 'X Circle',
    category: 'shapes',
    keywords: ['core-shapes', 'xcircle'],
    lucideComponent: 'XCircle'
  },
  {
    id: 'core-shapes-pluscircle',
    name: 'Plus Circle',
    category: 'shapes',
    keywords: ['core-shapes', 'pluscircle'],
    lucideComponent: 'PlusCircle'
  },
  {
    id: 'core-shapes-minuscircle',
    name: 'Minus Circle',
    category: 'shapes',
    keywords: ['core-shapes', 'minuscircle'],
    lucideComponent: 'MinusCircle'
  },
  {
    id: 'core-shapes-checksquare',
    name: 'Check Square',
    category: 'shapes',
    keywords: ['core-shapes', 'checksquare'],
    lucideComponent: 'CheckSquare'
  },
  {
    id: 'core-shapes-xsquare',
    name: 'X Square',
    category: 'shapes',
    keywords: ['core-shapes', 'xsquare'],
    lucideComponent: 'XSquare'
  },
  {
    id: 'core-shapes-info',
    name: 'Info',
    category: 'shapes',
    keywords: ['core-shapes', 'info'],
    lucideComponent: 'Info'
  },
  {
    id: 'core-shapes-alertcircle',
    name: 'Alert Circle',
    category: 'shapes',
    keywords: ['core-shapes', 'alertcircle'],
    lucideComponent: 'AlertCircle'
  },
  {
    id: 'core-shapes-alerttriangle',
    name: 'Alert Triangle',
    category: 'shapes',
    keywords: ['core-shapes', 'alerttriangle'],
    lucideComponent: 'AlertTriangle'
  },
  {
    id: 'core-shapes-helpcircle',
    name: 'Help Circle',
    category: 'shapes',
    keywords: ['core-shapes', 'helpcircle'],
    lucideComponent: 'HelpCircle'
  },
  {
    id: 'core-shapes-morehorizontal',
    name: 'More Horizontal',
    category: 'shapes',
    keywords: ['core-shapes', 'morehorizontal'],
    lucideComponent: 'MoreHorizontal'
  },
  {
    id: 'core-shapes-morevertical',
    name: 'More Vertical',
    category: 'shapes',
    keywords: ['core-shapes', 'morevertical'],
    lucideComponent: 'MoreVertical'
  },
  {
    id: 'core-shapes-grip',
    name: 'Grip',
    category: 'shapes',
    keywords: ['core-shapes', 'grip'],
    lucideComponent: 'Grip'
  },
  {
    id: 'core-shapes-griphorizontal',
    name: 'Grip Horizontal',
    category: 'shapes',
    keywords: ['core-shapes', 'griphorizontal'],
    lucideComponent: 'GripHorizontal'
  },
  {
    id: 'core-shapes-gripvertical',
    name: 'Grip Vertical',
    category: 'shapes',
    keywords: ['core-shapes', 'gripvertical'],
    lucideComponent: 'GripVertical'
  },
  {
    id: 'core-shapes-command',
    name: 'Command',
    category: 'shapes',
    keywords: ['core-shapes', 'command'],
    lucideComponent: 'Command'
  },
  {
    id: 'core-shapes-hash',
    name: 'Hash',
    category: 'shapes',
    keywords: ['core-shapes', 'hash'],
    lucideComponent: 'Hash'
  },
  {
    id: 'core-shapes-appwindow',
    name: 'App Window',
    category: 'shapes',
    keywords: ['core-shapes', 'appwindow'],
    lucideComponent: 'AppWindow'
  },
  {
    id: 'core-shapes-maximize',
    name: 'Maximize',
    category: 'shapes',
    keywords: ['core-shapes', 'maximize'],
    lucideComponent: 'Maximize'
  },
  {
    id: 'core-shapes-minimize',
    name: 'Minimize',
    category: 'shapes',
    keywords: ['core-shapes', 'minimize'],
    lucideComponent: 'Minimize'
  },
  {
    id: 'core-shapes-shield',
    name: 'Shield',
    category: 'shapes',
    keywords: ['core-shapes', 'shield'],
    lucideComponent: 'Shield'
  },
  {
    id: 'core-shapes-badge',
    name: 'Badge',
    category: 'shapes',
    keywords: ['core-shapes', 'badge'],
    lucideComponent: 'Badge'
  },
  {
    id: 'core-shapes-bookmark',
    name: 'Bookmark',
    category: 'shapes',
    keywords: ['core-shapes', 'bookmark'],
    lucideComponent: 'Bookmark'
  },
  {
    id: 'core-shapes-tag',
    name: 'Tag',
    category: 'shapes',
    keywords: ['core-shapes', 'tag'],
    lucideComponent: 'Tag'
  },
];

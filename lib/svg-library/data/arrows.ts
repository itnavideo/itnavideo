import { SvgCategory } from '../types';
import * as Icons from 'lucide-react';

export const ARROWS_ASSETS = [
  {
    id: 'arrows-arrowright',
    name: 'Arrow Right',
    category: 'arrows',
    keywords: ['arrows', 'arrowright'],
    lucideComponent: 'ArrowRight'
  },
  {
    id: 'arrows-arrowleft',
    name: 'Arrow Left',
    category: 'arrows',
    keywords: ['arrows', 'arrowleft'],
    lucideComponent: 'ArrowLeft'
  },
  {
    id: 'arrows-arrowup',
    name: 'Arrow Up',
    category: 'arrows',
    keywords: ['arrows', 'arrowup'],
    lucideComponent: 'ArrowUp'
  },
  {
    id: 'arrows-arrowdown',
    name: 'Arrow Down',
    category: 'arrows',
    keywords: ['arrows', 'arrowdown'],
    lucideComponent: 'ArrowDown'
  },
  {
    id: 'arrows-arrowupright',
    name: 'Arrow Up Right',
    category: 'arrows',
    keywords: ['arrows', 'arrowupright'],
    lucideComponent: 'ArrowUpRight'
  },
  {
    id: 'arrows-arrowupleft',
    name: 'Arrow Up Left',
    category: 'arrows',
    keywords: ['arrows', 'arrowupleft'],
    lucideComponent: 'ArrowUpLeft'
  },
  {
    id: 'arrows-arrowdownright',
    name: 'Arrow Down Right',
    category: 'arrows',
    keywords: ['arrows', 'arrowdownright'],
    lucideComponent: 'ArrowDownRight'
  },
  {
    id: 'arrows-arrowdownleft',
    name: 'Arrow Down Left',
    category: 'arrows',
    keywords: ['arrows', 'arrowdownleft'],
    lucideComponent: 'ArrowDownLeft'
  },
  {
    id: 'arrows-chevronright',
    name: 'Chevron Right',
    category: 'arrows',
    keywords: ['arrows', 'chevronright'],
    lucideComponent: 'ChevronRight'
  },
  {
    id: 'arrows-chevronleft',
    name: 'Chevron Left',
    category: 'arrows',
    keywords: ['arrows', 'chevronleft'],
    lucideComponent: 'ChevronLeft'
  },
  {
    id: 'arrows-chevronup',
    name: 'Chevron Up',
    category: 'arrows',
    keywords: ['arrows', 'chevronup'],
    lucideComponent: 'ChevronUp'
  },
  {
    id: 'arrows-chevrondown',
    name: 'Chevron Down',
    category: 'arrows',
    keywords: ['arrows', 'chevrondown'],
    lucideComponent: 'ChevronDown'
  },
  {
    id: 'arrows-chevronsright',
    name: 'Chevrons Right',
    category: 'arrows',
    keywords: ['arrows', 'chevronsright'],
    lucideComponent: 'ChevronsRight'
  },
  {
    id: 'arrows-chevronsleft',
    name: 'Chevrons Left',
    category: 'arrows',
    keywords: ['arrows', 'chevronsleft'],
    lucideComponent: 'ChevronsLeft'
  },
  {
    id: 'arrows-chevronsup',
    name: 'Chevrons Up',
    category: 'arrows',
    keywords: ['arrows', 'chevronsup'],
    lucideComponent: 'ChevronsUp'
  },
  {
    id: 'arrows-chevronsdown',
    name: 'Chevrons Down',
    category: 'arrows',
    keywords: ['arrows', 'chevronsdown'],
    lucideComponent: 'ChevronsDown'
  },
  {
    id: 'arrows-moveright',
    name: 'Move Right',
    category: 'arrows',
    keywords: ['arrows', 'moveright'],
    lucideComponent: 'MoveRight'
  },
  {
    id: 'arrows-moveleft',
    name: 'Move Left',
    category: 'arrows',
    keywords: ['arrows', 'moveleft'],
    lucideComponent: 'MoveLeft'
  },
  {
    id: 'arrows-moveup',
    name: 'Move Up',
    category: 'arrows',
    keywords: ['arrows', 'moveup'],
    lucideComponent: 'MoveUp'
  },
  {
    id: 'arrows-movedown',
    name: 'Move Down',
    category: 'arrows',
    keywords: ['arrows', 'movedown'],
    lucideComponent: 'MoveDown'
  },
  {
    id: 'arrows-movediagonal',
    name: 'Move Diagonal',
    category: 'arrows',
    keywords: ['arrows', 'movediagonal'],
    lucideComponent: 'MoveDiagonal'
  },
  {
    id: 'arrows-cornerupright',
    name: 'Corner Up Right',
    category: 'arrows',
    keywords: ['arrows', 'cornerupright'],
    lucideComponent: 'CornerUpRight'
  },
  {
    id: 'arrows-cornerupleft',
    name: 'Corner Up Left',
    category: 'arrows',
    keywords: ['arrows', 'cornerupleft'],
    lucideComponent: 'CornerUpLeft'
  },
  {
    id: 'arrows-cornerdownright',
    name: 'Corner Down Right',
    category: 'arrows',
    keywords: ['arrows', 'cornerdownright'],
    lucideComponent: 'CornerDownRight'
  },
  {
    id: 'arrows-cornerdownleft',
    name: 'Corner Down Left',
    category: 'arrows',
    keywords: ['arrows', 'cornerdownleft'],
    lucideComponent: 'CornerDownLeft'
  },
  {
    id: 'arrows-cornerrightup',
    name: 'Corner Right Up',
    category: 'arrows',
    keywords: ['arrows', 'cornerrightup'],
    lucideComponent: 'CornerRightUp'
  },
  {
    id: 'arrows-cornerrightdown',
    name: 'Corner Right Down',
    category: 'arrows',
    keywords: ['arrows', 'cornerrightdown'],
    lucideComponent: 'CornerRightDown'
  },
  {
    id: 'arrows-cornerleftup',
    name: 'Corner Left Up',
    category: 'arrows',
    keywords: ['arrows', 'cornerleftup'],
    lucideComponent: 'CornerLeftUp'
  },
  {
    id: 'arrows-cornerleftdown',
    name: 'Corner Left Down',
    category: 'arrows',
    keywords: ['arrows', 'cornerleftdown'],
    lucideComponent: 'CornerLeftDown'
  },
  {
    id: 'arrows-refreshcw',
    name: 'Refresh Cw',
    category: 'arrows',
    keywords: ['arrows', 'refreshcw'],
    lucideComponent: 'RefreshCw'
  },
  {
    id: 'arrows-refreshccw',
    name: 'Refresh Ccw',
    category: 'arrows',
    keywords: ['arrows', 'refreshccw'],
    lucideComponent: 'RefreshCcw'
  },
  {
    id: 'arrows-rotatecw',
    name: 'Rotate Cw',
    category: 'arrows',
    keywords: ['arrows', 'rotatecw'],
    lucideComponent: 'RotateCw'
  },
  {
    id: 'arrows-rotateccw',
    name: 'Rotate Ccw',
    category: 'arrows',
    keywords: ['arrows', 'rotateccw'],
    lucideComponent: 'RotateCcw'
  },
  {
    id: 'arrows-iterationccw',
    name: 'Iteration Ccw',
    category: 'arrows',
    keywords: ['arrows', 'iterationccw'],
    lucideComponent: 'IterationCcw'
  },
  {
    id: 'arrows-iterationcw',
    name: 'Iteration Cw',
    category: 'arrows',
    keywords: ['arrows', 'iterationcw'],
    lucideComponent: 'IterationCw'
  },
];

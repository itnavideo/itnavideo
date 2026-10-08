import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';
import fs from 'fs';

async function audit() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Navigating to dashboard/auto-caption...");
  await page.goto('http://localhost:3000/dashboard/auto-caption', { waitUntil: 'networkidle' });
  
  await page.waitForTimeout(3000); // Give it a moment to render completely

  await page.screenshot({ path: 'auto_caption_dashboard.png', fullPage: true });

  const uiInventory = await page.evaluate(() => {
    function walk(node, depth) {
      let result = "";
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent.trim();
        if (text) {
          result += "  ".repeat(depth) + "Text: " + text + "\n";
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        let tag = node.tagName.toLowerCase();
        
        // Skip script and style tags
        if (tag === 'script' || tag === 'style') return "";

        let classes = node.className;
        let id = node.id;
        let placeholder = node.placeholder || '';
        let type = node.type || '';
        
        let nodeInfo = `<${tag}`;
        if (id) nodeInfo += ` id="${id}"`;
        // if (classes) nodeInfo += ` class="${classes}"`; // Classes might be too noisy, omitting or truncating
        if (placeholder) nodeInfo += ` placeholder="${placeholder}"`;
        if (type) nodeInfo += ` type="${type}"`;
        if (tag === 'img') nodeInfo += ` alt="${node.alt}" src="${node.src}"`;
        nodeInfo += `>`;

        let hasInterestingProps = ['button', 'a', 'input', 'select', 'textarea', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img'].includes(tag) || id;
        
        // Only print interesting tags to keep the output manageable
        let childrenStr = "";
        for (let child of node.childNodes) {
          childrenStr += walk(child, depth + 1);
        }
        
        if (hasInterestingProps || childrenStr.includes('Text:') || childrenStr.trim() !== '') {
            if (hasInterestingProps) {
                result += "  ".repeat(depth) + nodeInfo + "\n";
            }
            result += childrenStr;
        }
      }
      return result;
    }
    return walk(document.body, 0);
  });

  fs.writeFileSync('ui_inventory.txt', uiInventory);
  console.log("UI Inventory saved to ui_inventory.txt");

  await browser.close();
}

audit().catch(console.error);

const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Hackathon work/rapidresq_frontend/src';

const replacements = [
  // Backgrounds
  { regex: /\bbg-white\b/g, replacement: 'bg-slate-800' },
  { regex: /\bbg-gray-50\b/g, replacement: 'bg-slate-900' },
  { regex: /\bbg-gray-100\b/g, replacement: 'bg-slate-700' },
  { regex: /\bbg-gray-200\b/g, replacement: 'bg-slate-600' },
  
  // Borders
  { regex: /\bborder-gray-100\b/g, replacement: 'border-slate-700' },
  { regex: /\bborder-gray-200\b/g, replacement: 'border-slate-700' },
  { regex: /\bborder-gray-300\b/g, replacement: 'border-slate-600' },
  
  // Text
  { regex: /\btext-gray-900\b/g, replacement: 'text-white' },
  { regex: /\btext-gray-800\b/g, replacement: 'text-slate-100' },
  { regex: /\btext-gray-700\b/g, replacement: 'text-slate-300' },
  { regex: /\btext-gray-600\b/g, replacement: 'text-slate-400' },
  { regex: /\btext-gray-500\b/g, replacement: 'text-slate-400' },
];

const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'indigo', 'purple', 'pink', 'slate'];

colors.forEach(color => {
  replacements.push(
    { regex: new RegExp(`\\bbg-${color}-50\\b`, 'g'), replacement: `bg-${color}-900/30` },
    { regex: new RegExp(`\\bbg-${color}-100\\b`, 'g'), replacement: `bg-${color}-900/50` },
    { regex: new RegExp(`\\bborder-${color}-100\\b`, 'g'), replacement: `border-${color}-800` },
    { regex: new RegExp(`\\bborder-${color}-200\\b`, 'g'), replacement: `border-${color}-700` },
    { regex: new RegExp(`\\bborder-${color}-300\\b`, 'g'), replacement: `border-${color}-600` },
    { regex: new RegExp(`\\btext-${color}-900\\b`, 'g'), replacement: `text-${color}-200` },
    { regex: new RegExp(`\\btext-${color}-800\\b`, 'g'), replacement: `text-${color}-300` },
    { regex: new RegExp(`\\btext-${color}-700\\b`, 'g'), replacement: `text-${color}-400` },
  );
});

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDirectory(srcDir);
console.log('Complete');

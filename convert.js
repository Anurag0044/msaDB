import fs from 'fs';
import path from 'path';

const htmlDir = 'e:/msaDB-js/msaDB-jsx/stitch_html';
const componentsDir = 'e:/msaDB-js/msaDB-jsx/src/pages';

if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
}

function convertHtmlToJsx(html) {
    // Extract everything inside body
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let bodyContent = bodyMatch ? bodyMatch[1] : html;

    // Remove comments
    bodyContent = bodyContent.replace(/<!--[\s\S]*?-->/g, '');

    // Replace class= with className=
    bodyContent = bodyContent.replace(/class=/g, 'className=');

    // Self-close tags (img, input, br, hr, etc.)
    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    voidElements.forEach(tag => {
        const regex = new RegExp(`(<${tag}\\b[^>]*?)(?<!/)>`, 'gi');
        bodyContent = bodyContent.replace(regex, '$1 />');
    });

    // Handle inline styles `style="..."`
    // Stitch mostly generates them as `style="font-variation-settings: 'FILL' 1;"`
    // We'll simplisticly replace `style="..."` with a generic or remove it, or convert to object.
    // For simplicity, let's just convert simple font-variation-settings to React style object.
    bodyContent = bodyContent.replace(/style="font-variation-settings: 'FILL' 1;"/g, "style={{fontVariationSettings: \"'FILL' 1\"}}");
    bodyContent = bodyContent.replace(/style="font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;"/g, "style={{fontVariationSettings: \"'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24\"}}");

    // Any other generic style="" will just be removed for safety if we can't parse it (wait, better to try to convert or leave untouched? Leaving a string causes React error).
    bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, css) => {
        if (!css.includes('font-variation-settings')) return match; // fallback: React doesn't like strings for style wait
        return match; 
    });

    // Let's replace any lingering simplistic `style="background-image: url('...');"`
    bodyContent = bodyContent.replace(/style="background-image:\s*url\('([^']+)'\);"/g, "style={{backgroundImage: `url('$1')`}}");
    
    // Catch anything else and warn or fix later
    bodyContent = bodyContent.replace(/for=/g, 'htmlFor=');
    bodyContent = bodyContent.replace(/tabindex=/g, 'tabIndex=');
    
    // href="#" -> to="#" (if we use Link, but let's just leave anchor tags for now, or change '#' to '#!')
    bodyContent = bodyContent.replace(/href="#"/g, 'href="#!"');

    // Replace `&` in text if not properly escaped, but Stitch usually escapes them.

    return bodyContent;
}

const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

let appImports = [];
let appRoutes = [];

files.forEach(file => {
    const componentName = file.replace('.html', '');
    const htmlContent = fs.readFileSync(path.join(htmlDir, file), 'utf8');
    const jsxContent = convertHtmlToJsx(htmlContent);

    const reactCode = `
import React from 'react';
import { Link } from 'react-router-dom';

export default function ${componentName}() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen">
      ${jsxContent}
    </div>
  );
}
`;

    fs.writeFileSync(path.join(componentsDir, `${componentName}.jsx`), reactCode.trim() + '\n');
    console.log(`Generated component ${componentName} from ${file}`);
    
    appImports.push(`import ${componentName} from './pages/${componentName}';`);
    let routePath = componentName === 'Home_Page' ? '/' : `/${componentName.toLowerCase()}`;
    appRoutes.push(`        <Route path="${routePath}" element={<${componentName} />} />`);
});

const appCode = `
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
${appImports.join('\n')}

// Simple navigation sidebar/header for dev mode
function DevNav() {
  return (
    <div className="fixed bottom-0 left-0 bg-black/80 text-white p-4 z-[9999] text-xs flex gap-4 overflow-x-auto w-full">
      <span className="font-bold">Pages:</span>
      ${files.map(f => {
          const name = f.replace('.html', '');
          const route = name === 'Home_Page' ? '/' : `/${name.toLowerCase()}`;
          return `<Link to="${route}" className="hover:text-primary transition-colors">${name}</Link>`;
      }).join('\n      ')}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
${appRoutes.join('\n')}
      </Routes>
      <DevNav />
    </Router>
  );
}

export default App;
`;

fs.writeFileSync('e:/msaDB-js/msaDB-jsx/src/App.jsx', appCode.trim() + '\n');
console.log('Generated App.jsx');

// Extract head tags into index.html
const indexHtmlTemplatePath = 'e:/msaDB-js/msaDB-jsx/index.html';
let indexHtml = fs.readFileSync(indexHtmlTemplatePath, 'utf8');
const headContent = `
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container-highest": "#192540",
                    "tertiary-fixed-dim": "#f77c9e",
                    "on-tertiary-fixed-variant": "#711036",
                    "primary-dim": "#8a4cfc",
                    "surface": "#060e20",
                    "surface-container": "#0f1930",
                    "secondary": "#34b5fa",
                    "on-primary": "#3c0089",
                    "background": "#060e20",
                    "on-tertiary-fixed": "#380016",
                    "primary-fixed": "#b28cff",
                    "on-secondary-fixed": "#003853",
                    "tertiary": "#ff97b2",
                    "tertiary-container": "#fe81a4",
                    "surface-container-high": "#141f38",
                    "tertiary-dim": "#f17799",
                    "outline": "#6d758c",
                    "surface-variant": "#192540",
                    "primary-container": "#b28cff",
                    "on-surface": "#dee5ff",
                    "primary": "#bd9dff",
                    "outline-variant": "#40485d",
                    "surface-container-low": "#091328",
                    "secondary-dim": "#17a8ec",
                    "on-secondary": "#003047",
                    "error-container": "#a70138",
                    "surface-container-lowest": "#000000",
                    "surface-tint": "#bd9dff",
                    "primary-fixed-dim": "#a67aff",
                    "on-surface-variant": "#a3aac4",
                    "on-tertiary": "#6a0a31",
                    "inverse-surface": "#faf8ff",
                    "error": "#ff6e84",
                    "on-tertiary-container": "#5a0027",
                    "on-secondary-fixed-variant": "#00567c",
                    "secondary-fixed-dim": "#81ccff",
                    "secondary-container": "#006591",
                    "on-primary-fixed-variant": "#390083",
                    "error-dim": "#d73357",
                    "on-error-container": "#ffb2b9",
                    "on-error": "#490013",
                    "on-primary-fixed": "#000000",
                    "tertiary-fixed": "#ff8eac",
                    "inverse-on-surface": "#4d556b",
                    "on-background": "#dee5ff",
                    "surface-dim": "#060e20",
                    "on-primary-container": "#2e006c",
                    "inverse-primary": "#742fe5",
                    "surface-bright": "#1f2b49",
                    "secondary-fixed": "#a4d8ff",
                    "on-secondary-container": "#f3f8ff"
            },
            "borderRadius": {
                    "DEFAULT": "1rem",
                    "lg": "2rem",
                    "xl": "3rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Plus Jakarta Sans"],
                    "body": ["Inter"],
                    "label": ["Inter"]
            }
          },
        },
      }
    </script>
    <style>
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .glass-card {
        background: rgba(25, 37, 64, 0.6);
        backdrop-filter: blur(20px);
        border-top: 1px solid rgba(189, 157, 255, 0.2);
      }
      /* Ensure links reset nicely */
      a { color: inherit; text-decoration: inherit; }
    </style>
`;
indexHtml = indexHtml.replace('</head>', headContent + '</head>');
// Also attach `dark` class to html if needed
indexHtml = indexHtml.replace('<html lang="en">', '<html lang="en" class="dark">');

fs.writeFileSync(indexHtmlTemplatePath, indexHtml);
console.log('Updated index.html with Tailwind config and fonts.');

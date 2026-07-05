import fs from 'fs';
import path from 'path';

const pagesDir = 'e:/msaDB-js/msaDB-jsx/src/pages';
const layoutPath = 'e:/msaDB-js/msaDB-jsx/src/components/Layout.jsx';

function fixDynamicLinks(content) {
    // Regex matches <Link ... to="/">...</Link> and groups the parts.
    // Group 1: `<Link `
    // Group 2: attributes before `to=`
    // Group 3: `to="..."`
    // Group 4: attributes after `to="..."`
    // Group 5: inner text/HTML
    // Group 6: `</Link>`
    
    return content.replace(/(<Link\s+)([^>]*?)(to="[^"]*")([^>]*>)([\s\S]*?)(<\/Link>)/g, (match, prefix, beforeAttrs, toAttr, afterAttrs, inner, suffix) => {
        let to = '/';
        const text = inner.toLowerCase();
        
        if (text.includes('browse') || text.includes('movies') || text.includes('anime')) to = '/browse_search';
        else if (text.includes('settings') || text.includes('account')) to = '/settings';
        else if (text.includes('profile')) to = '/user_profile';
        else if (text.includes('log in') || text.includes('login') || text.includes('log_in')) to = '/login';
        else if (text.includes('sign up') || text.includes('start your journey') || text.includes('join')) to = '/sign_up';
        
        return prefix + beforeAttrs + `to="${to}"` + afterAttrs + inner + suffix;
    });
}

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));
files.forEach(f => {
    const p = path.join(pagesDir, f);
    let content = fs.readFileSync(p, 'utf8');
    content = fixDynamicLinks(content);
    fs.writeFileSync(p, content);
});

let layout = fs.readFileSync(layoutPath, 'utf8');
layout = fixDynamicLinks(layout);
fs.writeFileSync(layoutPath, layout);

console.log("Fixed Links pass 2");

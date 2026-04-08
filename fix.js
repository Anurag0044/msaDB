import fs from 'fs';
import path from 'path';

const pagesDir = 'e:/msaDB-js/msaDB-jsx/src/pages';
const layoutPath = 'e:/msaDB-js/msaDB-jsx/src/components/Layout.jsx';

function fixLinks(content) {
    return content.replace(/<a\s+([^>]*?)href="[^"]*"([^>]*?)>/g, (match, before, after) => {
        let to = '/';
        // primitive heuristic for mapping 'to' routes based on internal text content. 
        // We'll replace it with a string that we can later tune. For now, let's just make it a generic `<Link>`
        // wait, we can't look ahead easily for the text. 
        
        // Actually, let's just turn it into a `<Link>` and give it a generic `to="/..."` based on class
        if(match.includes('Browse') || match.includes('Movies') || match.includes('Anime')) to = '/browse_search';
        else if (match.includes('Settings') || match.includes('Account')) to = '/settings';
        else if (match.includes('Profile') || match.includes('profile')) to = '/user_profile';
        else if (match.includes('Log In') || match.includes('Login')) to = '/login';
        else if (match.includes('Start your journey') || match.includes('Sign Up')) to = '/sign_up';
        
        return `<Link ${before}to="${to}"${after}>`;
    }).replace(/<\/a>/g, '</Link>');
}

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
    const p = path.join(pagesDir, f);
    let content = fs.readFileSync(p, 'utf8');

    // Add motion import if not there
    if (!content.includes("framer-motion")) {
        content = content.replace("import React", "import { motion } from 'framer-motion';\nimport React");
    }

    // Fix a tags
    content = fixLinks(content);
    
    // Animate the main container
    content = content.replace(/<main([^>]*)>/, '<motion.main$1 initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{duration: 0.5}}>');
    content = content.replace(/<\/main>/, '</motion.main>');
    
    fs.writeFileSync(p, content);
});

// Also fix layout
let layout = fs.readFileSync(layoutPath, 'utf8');
layout = fixLinks(layout);
fs.writeFileSync(layoutPath, layout);

console.log("Done fixing.");

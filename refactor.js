import fs from 'fs';
import path from 'path';

const dir = 'e:/msaDB-js/msaDB-jsx/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  let content = fs.readFileSync(path.join(dir, f), 'utf8');

  // Strip duplicate nav and footer
  content = content.replace(/<nav[\s\S]*?<\/nav>/g, '');
  content = content.replace(/<footer[\s\S]*?<\/footer>/g, '');

  // Add the Layout component wrapper where applicable
  if (!content.includes("import Layout")) {
    content = "import Layout from '../components/Layout';\n" + content;
    content = content.replace(/<div className="bg-surface[^>]*>/, '<Layout>');
    content = content.replace(/<\/div>\s*?\);\s*?}\s*$/, '</Layout>\n  );\n}\n');
  }

  // Also replace some button clicks with Links
  content = content.replace(/<button([^>]*)>([\s\S]*?)View Details([\s\S]*?)<\/button>/ig, '<Link to="/show_details" $1>$2View Details$3</Link>');
  content = content.replace(/<button([^>]*)>([\s\S]*?)Explore All([\s\S]*?)<\/button>/ig, '<Link to="/browse_search" $1>$2Explore All$3</Link>');
  content = content.replace(/<button([^>]*)>([\s\S]*?)Sign Up([\s\S]*?)<\/button>/ig, '<Link to="/sign_up" $1>$2Sign Up$3</Link>');
  content = content.replace(/<button([^>]*)>([\s\S]*?)Login([\s\S]*?)<\/button>/ig, '<Link to="/login" $1>$2Login$3</Link>');
  content = content.replace(/<button([^>]*)>([\s\S]*?)Add to Watchlist([\s\S]*?)<\/button>/ig, '<button $1 onClick={() => alert("Added to watchlist!")}>$2Add to Watchlist$3</button>');

  content = content.replace(/<main className="pt-0">/, '<main>');
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  fs.writeFileSync(path.join(dir, f), content);
});

console.log('Refactored all pages to use Layout component.');

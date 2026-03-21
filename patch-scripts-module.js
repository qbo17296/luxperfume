const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === 'dist' || file === '.git' || file === '.github') continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Replace <script src="/assets/js/..."> with <script type="module" src="/assets/js/...">
            // Ignore if already type="module"
            const newContent = content.replace(/<script (?!\s*type="module")([^>]*)src="(\/assets\/js\/.*?)"([^>]*)><\/script>/g, '<script type="module" $1src="$2"$3></script>');
            
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Added type="module" to ' + fullPath);
            }
        }
    }
}
processDir(__dirname);
console.log('Done module patch');

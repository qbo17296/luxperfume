const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Fix href="/..." -> href="/luxperfume/..." (excluding external links or already prefixed ones)
            const newContent = content.replace(/(href|src)=["']\/(?!luxperfume\/)(.*?)["']/g, '$1="/luxperfume/$2"');
            
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Fixed absolute paths in ' + fullPath);
            }
        }
    }
}
processDir(path.join(__dirname, 'dist'));
console.log('Post-build path fix complete');

const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'assets', 'js');
let mainJs = fs.readFileSync(path.join(jsDir, 'main.js'), 'utf8');
if (!mainJs.includes("import './cart.js';")) {
    fs.writeFileSync(path.join(jsDir, 'main.js'), "import './cart.js';\nimport './interactions.js';\n" + mainJs);
}

let shopJs = fs.readFileSync(path.join(jsDir, 'shop.js'), 'utf8');
if (!shopJs.includes("import './products.js';")) {
    fs.writeFileSync(path.join(jsDir, 'shop.js'), "import './products.js';\n" + shopJs);
}

// Remove script tags for interactions, cart, products from ALL HTML files
function cleanHtml(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === 'dist' || file === '.git') continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            cleanHtml(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/<script .*?src="[^"]*(interactions\.js|cart\.js|products\.js)".*?><\/script>/gi, '');
            fs.writeFileSync(fullPath, content);
        }
    }
}
cleanHtml(__dirname);
console.log('Fixed imports');

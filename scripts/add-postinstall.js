const fs = require('fs');
const path = './package.json';
const p = JSON.parse(fs.readFileSync(path, 'utf8'));
p.scripts = p.scripts || {};
if (!p.scripts['postinstall']) {
  p.scripts['postinstall'] = 'patch-package';
  fs.writeFileSync(path, JSON.stringify(p, null, 2) + '\n', 'utf8');
  console.log('postinstall added');
} else {
  console.log('postinstall already present:', p.scripts['postinstall']);
}

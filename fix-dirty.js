const fs = require('fs');
const files = ['admin-projects.js', 'admin-departments.js', 'admin-members.js', 'admin-content.js', 'admin-settings.js'];

files.forEach(f => {
  let content = fs.readFileSync('js/' + f, 'utf8');
  let newContent = content.replace(/(if *\(confirm\([^)]+\)\) *\{[^{]*)(renderSection\('[^']+'\);?)( *\})/g, "$1if(window.setDirty) window.setDirty(true); $2$3");
  
  if(content !== newContent) {
    fs.writeFileSync('js/' + f, newContent);
    console.log("Updated", f);
  }
});

const fs = require('fs');
let txt = fs.readFileSync('backend/data/ent_questions.json', 'utf8');

// The file has ] \n [ representing two adjacent arrays.
// Replace `]\n[` with `,` to merge the arrays.
txt = txt.replace(/\]\r?\n\[/g, ',');

fs.writeFileSync('backend/data/ent_questions.json', txt);
console.log('Fixed array boundaries');

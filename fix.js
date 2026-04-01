const fs = require('fs');
let txt = fs.readFileSync('backend/data/ent_questions.json', 'utf8');
txt = txt.replace(/\},\r?\n\s*\{(?!\s*")/g, '}{');
fs.writeFileSync('backend/data/ent_questions.json', txt);
console.log('Fixed math formatting');

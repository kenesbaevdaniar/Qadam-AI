const fs = require('fs');
let txt = fs.readFileSync('backend/data/ent_questions.json', 'utf8');

// The file has } \n [ \n { which is an invalid root structure.
// We map it back to the { block, questions } schema.
txt = txt.replace(/\}\r?\n\[\r?\n\s*\{/g, '},\n{\n  "block": "Дополнительные вопросы",\n  "questions": [\n    {');

// Fix the end if it's ] \n ]
txt = txt.replace(/\]\s*\]\s*$/g, ']\n}\n]');

fs.writeFileSync('backend/data/ent_questions.json', txt);
console.log('Fixed nested arrays');

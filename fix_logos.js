const fs = require('fs');
const path = require('path');

const dir = __dirname;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        let original = content;

        // 1. Footer text logos: <span class="dark:text-white">EDUPATH</span>
        content = content.replace(/<span class="dark:text-white">EDUPATH<\/span>/g, '<span class="dark:text-white">QADAM.</span>');

        // 2. Page titles: EduPath AI -> QADAM.AI
        content = content.replace(/EduPath AI/g, 'QADAM.AI');
        content = content.replace(/EduPath\b/g, 'QADAM.AI');
        
        // 3. Footer copyright text: EduPath AI -> QADAM.AI
        content = content.replace(/© 2025 EduPath AI/g, '© 2025 QADAM.AI');
        
        // 4. Footer brand text in footer <a> tags: EduPath
        content = content.replace(/>EduPath<\/a>/g, '>QADAM.AI</a>');
        content = content.replace(/>EduPath AI<\/a>/g, '>QADAM.AI</a>');
        
        // 5. The description text in footer: "Твой персональный ИИ-гид..."
        // Replace the old name if it appears in the footer description:
        content = content.replace(/EduPath AI\./g, 'QADAM.AI.');

        if (content !== original) {
            fs.writeFileSync(path.join(dir, file), content, 'utf8');
            console.log(`Updated footer/titles in ${file}`);
        }
    }
});

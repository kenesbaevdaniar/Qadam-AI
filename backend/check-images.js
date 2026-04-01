const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const University = require('./models/University');

async function checkImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const unis = await University.find({});
        console.log(`Found ${unis.length} universities.`);
        unis.forEach(u => {
            console.log(`- ${u.name}: imageUrl = "${u.imageUrl}"`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkImages();

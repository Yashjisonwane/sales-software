const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Categories
    const categories = [
        { name: 'Plumbing' },
        { name: 'Electrical' },
        { name: 'Cleaning' },
        { name: 'HVAC' },
        { name: 'Landscaping' },
        { name: 'Handyman' }
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat
        });
    }

    console.log('✅ Seeding completed! Database is ready!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

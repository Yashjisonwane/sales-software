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

    // 2. WORKER (Professional)
    const workerPassword = await bcrypt.hash('123', 10);
    const worker = await prisma.user.upsert({
        where: { email: 'worker@gmail.com' },
        update: {
            password: workerPassword
        },
        create: {
            name: 'Professional Worker',
            email: 'worker@gmail.com',
            phone: '9876543210',
            password: workerPassword,
            role: 'WORKER'
        }
    });

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

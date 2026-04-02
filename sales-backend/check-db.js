const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const users = await prisma.user.findMany({ select: { name: true, email: true, role: true } });
        console.log('Users found in DB:', users);
        await prisma.$disconnect();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}
check();

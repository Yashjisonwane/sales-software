const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

<<<<<<< HEAD
async function main() {
  try {
    const tables = await prisma.$queryRawUnsafe(`SHOW TABLES`);
    console.log('Tables in database:', JSON.stringify(tables, null, 2));
    
    for (const tableObj of tables) {
      const tableName = Object.values(tableObj)[0];
      const columns = await prisma.$queryRawUnsafe(`SHOW COLUMNS FROM \`${tableName}\``);
      console.log(`Columns in ${tableName}:`, JSON.stringify(columns, null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
=======
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
>>>>>>> adf8db8c7d6db8d79d01c12eac07be4b0251f65c

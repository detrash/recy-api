import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Define roles
  const roles = [
    { name: 'admin' },
    { name: 'recycler' },
    { name: 'wasteGenerator' },
    { name: 'partner' },
  ];

  // Insert roles into the database
  for (const role of roles) {
    await prisma.role.create({ data: role });
  }

  console.log('Roles have been seeded.');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

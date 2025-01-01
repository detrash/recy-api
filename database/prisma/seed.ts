import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { id: '1', name: 'admin' },
    { id: '2', name: 'recycler' },
    { id: '3', name: 'waste-generator' },
    { id: '4', name: 'partner' },
    { id: '5', name: 'auditor' },
    { id: '6', name: 'new-user' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id }, // Use upsert to avoid duplicates
      update: {}, // No update necessary
      create: { id: role.id, name: role.name },
    });
  }

  console.log('Sseeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

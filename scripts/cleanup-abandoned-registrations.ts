import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// How old (in hours) before we consider a pending registration abandoned?
const HOURS = parseInt(process.argv[2] || '1', 10);

async function main() {
  const cutoff = new Date(Date.now() - HOURS * 60 * 60 * 1000);
  const updated = await prisma.registration.updateMany({
    where: {
      status: 'PENDING_PAYMENT',
      createdAt: { lt: cutoff },
    },
    data: { status: 'ABANDONED' },
  });
  console.log(`Marked ${updated.count} registrations as ABANDONED (older than ${HOURS} hour(s))`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

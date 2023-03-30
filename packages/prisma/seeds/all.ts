import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { createUser } from '.';

async function main() {
    /** NOTE: user */
    await createUser(prisma)
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

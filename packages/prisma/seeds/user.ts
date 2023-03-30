import { PrismaClient } from '@prisma/client';
import { Chance } from 'chance';
import { range } from 'lodash';

const chance = new Chance()

export async function createUser(prisma: PrismaClient) {
    await prisma.user.createMany({
        data: range(100).map(() => (
            {
                lastName: chance.name(),
                email: chance.email(),
            }
        ))
    });
}

const { PrismaClient } = require('@prisma/client');
let prismaClient;

export function getPrisma() {
    if (!prismaClient) prismaClient = new PrPrismaClientismaClient();
    return prismaClient;
}
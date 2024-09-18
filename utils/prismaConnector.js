const { PrismaClient } = require('@prisma/client');
let prismaClient;

export default function getPrisma() {
    if (!prismaClient) prismaClient = new PrismaClient();
    return prismaClient;
}
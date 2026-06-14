import { PrismaClient } from '@prisma/client';

// Compartir una única instancia del cliente de Prisma para optimizar el grupo de conexiones (connection pool)
const prisma = new PrismaClient();

export default prisma;

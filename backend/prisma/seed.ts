import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const saltRounds = Number(process.env.BCRYPT_SALT || 10);
  const adminPassword = await bcrypt.hash("AdminPass123!", saltRounds);
  const userPassword = await bcrypt.hash("UserPass123!", saltRounds);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN"
    }
  });

  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@example.com",
      password: userPassword,
      role: "USER"
    }
  });

  const tests = [
    { name: "Complete Blood Count", rate: 250 },
    { name: "Lipid Profile", rate: 600 },
    { name: "Liver Function Test", rate: 550 }
  ];

  for (const t of tests) {
    await prisma.test.upsert({
      where: { name: t.name },
      update: {},
      create: t
    });
  }

  console.log("Seed completed");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

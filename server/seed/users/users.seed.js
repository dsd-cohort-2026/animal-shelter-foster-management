const prisma = require("../../connections/prisma-client");

const seedMany = async () => {
  const users = await prisma.user.createMany({
    data: [
      {
        first_name: "hello",
        last_name: "world",
        email: "this.is@an.email",
        phone: "123-456-7890",
        address: "citizen of the world",
        role: "USER",
      },
      {
        first_name: "goodbye",
        last_name: "world",
        email: "this.is@another.email",
        phone: "098-765-4321",
        address: "remote",
        role: "STAFF",
      },
      {
        first_name: "last name",
        last_name: "first",
        email: "google@gmail.com",
        phone: "555-555-5555",
        address: "google ln",
        role: "USER",
      },
    ],
    skipDuplicates: true,
  });
};

const main = async () => {
  try {
    await seedMany();
  } catch (seedUserError) {
    console.log("Error while deleting users: ", { seedUserError });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

main();

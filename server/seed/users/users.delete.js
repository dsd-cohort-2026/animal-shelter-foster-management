const prisma = require("../../connections/prisma-client");

const deleteAll = async () => {
  await prisma.user.deleteMany({});
};

const main = async () => {
  try {
    await deleteAll();
  } catch (deleteUserError) {
    console.log("Error while deleting users: ", { deleteUserError });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

main();

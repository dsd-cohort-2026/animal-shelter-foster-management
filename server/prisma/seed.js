const prisma = require('../../connections/prisma-client');

const USERS = [
  // 10 total users: 3 STAFF, 7 USER [1/7 implicit USER]
  {
    first_name: 'Bob',
    last_name: 'Jenkinson',
    email: 'b.jenkinson@gmail.com',
    phone: '123-456-7890',
    address: 'New York',
    role: 'STAFF',
  },
  {
    first_name: 'Midge',
    last_name: 'Weston',
    email: 'weston@gmail.com',
    phone: '098-765-4321',
    address: 'Wyoming',
    role: 'STAFF',
  },
  {
    first_name: 'Glenn',
    last_name: 'Pritcher',
    email: 'pritcher@hotmail.com',
    phone: '555-555-5555',
    address: 'California',
    role: 'STAFF',
  },
  {
    first_name: 'Sara',
    last_name: 'Dunmore',
    email: 's.dunmore@gmail.com',
    phone: '312-847-9021',
    address: 'Illinois',
    role: 'USER',
  },
  {
    first_name: 'Carlos',
    last_name: 'Vega',
    email: 'c.vega@yahoo.com',
    phone: '713-204-5678',
    address: 'Texas',
  },
  {
    first_name: 'Priya',
    last_name: 'Nair',
    email: 'p.nair@gmail.com',
    phone: '404-339-1122',
    address: 'Georgia',
    role: 'USER',
  },
  {
    first_name: 'Tommy',
    last_name: 'Halbert',
    email: 'thalbert@outlook.com',
    phone: '206-778-4490',
    address: 'Washington',
    role: 'USER',
  },
  {
    first_name: 'Dana',
    last_name: 'Osei',
    email: 'd.osei@gmail.com',
    phone: '617-552-8834',
    address: 'Massachusetts',
    role: 'USER',
  },
  {
    first_name: 'Kenji',
    last_name: 'Morrow',
    email: 'k.morrow@hotmail.com',
    phone: '503-491-7763',
    address: 'Oregon',
    role: 'USER',
  },
  {
    first_name: 'Lena',
    last_name: 'Hartwell',
    email: 'lhartwell@gmail.com',
    phone: '702-883-2215',
    address: 'Nevada',
    role: 'USER',
  },
];

const seedTheBase = async () => {
  await prisma.user.deleteMany({});
  const staffUser1 = await prisma.user.create(USERS[0]);
  const staffUser2 = await prisma.user.create(USERS[1]);
  const staffUser3 = await prisma.user.create(USERS[2]);
  const user1 = await prisma.user.create(USERS[3]);
  const user2 = await prisma.user.create(USERS[4]);
  const user3 = await prisma.user.create(USERS[5]);
  const user4 = await prisma.user.create(USERS[6]);
  const user5 = await prisma.user.create(USERS[7]);
  const user6 = await prisma.user.create(USERS[8]);
  const user7 = await prisma.user.create(USERS[9]);
};

const main = async () => {
  try {
    await seedTheBase();
  } catch (seedUserError) {
    console.log('Error while deleting users: ', { seedUserError });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

main();

const user1 = await prisma.user.create({
  data: {
    first_name: 'Bob',
    last_name: 'Jenkinson',
    email: 'b.jenkinson@gmail.com',
    phone: '123-456-7890',
    address: 'New York',
    role: 'STAFF',
  },
});

const user2 = await prisma.user.create({
  data: {
    first_name: 'Kenji',
    last_name: 'Morrow',
    email: 'k.morrow@hotmail.com',
    phone: '503-491-7763',
    address: 'Oregon',
    role: 'USER',
  },
});

const animal1 = await prisma.animal.create({
  data: {
    name: 'Drogo',
    chip_id: 123456,
    dob: new Date('November 9 2013'),
    sex: 'MALE',
    species: 'DOG',
    foster_status: 'ADOPTED',
    kennel_id: 2,
    altered: true,
    weight: 67.2,
    last_modified: new Date(),
    picture: 'happy-puppy.jpeg',
    animal_assignments: {
      create: {
        start_date: new Date(),
        end_date: new Date('March 31 2026'),
        status: 'ACTIVE',
        foster_user_id: user2.id,
        assigned_by_staff_id: user1.id,
      },
    },
    modified_by: { create: { staff_user_id: user1.id } },
  },
});

const item1 = await prisma.item.create({
  data: {
    category: 'FOOD',
    name: 'Dog Food 14 lb.',
    brand: 'Iams',
    description: 'Iams Dog Food 14 lb.',
    species: 'DOG',
    unit: 'LB',
    is_active: true,
    inventory: {
      create: {
        quantity: 20,
        expiration_date: new Date('July 16 2026'),
      },
    },
    medication: {
      create: {
        recommended_dose: '8 oz., 2 Times / Day',
        side_effects: 'drowsiness',
        administration_route: `i'm not sure what this means`,
      },
    },

    // food: { create: { life_stage: 'ADULT' } },

    // crate: {
    //   create: {
    //     size: 'LARGE',
    //     status: 'LOANED',
    //   },
    // },
  },
});

const inventoryTransaction1 = await prisma.inventorytransaction.create({
  data: {
    quantity: 5,
    status: 'COMPLETE',
    type: 'DISTRIBUTION',
    notes: '90 lbs. of food dispersed',
    foster_user_id: user2.id,
    created_by_staff_user_id: user1.id,
    item_id: item1.id,
    inventory_id: item1.inventory.id,
  },
});

const medicalLog1 = await prisma.medicallog.create({
  data: {
    category: 'MEDICAL',
    general_notes: "he's a good boy",
    behavioral_notes: 'refer to the general notes',
    quantity_administered: '30 capsules prescribed',
    dosed: '1 capsule / day',
    administered_at: new Date(),
    prescription: '30 capsules taken by mouth, 1 / day',
    documents: 'not really sure what will go here',

    foster_user_id: user2.id,
    animal_id: animal1,
    assignment_id: animal1.animal_assignments.id,
    medication_id: item1.medication.id,
  },
});

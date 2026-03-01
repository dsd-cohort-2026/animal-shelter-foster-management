const prisma = require('../connections/prisma-client');

const seedTheBase = async () => {
  // delete any pre-existing data
  // keep THIS specific order for deletion
  //    - deleting an an animal before an assignment leads to an error for an unreachable foreign key
  await prisma.animalAssignment.deleteMany({});
  await prisma.animalModification.deleteMany({});
  await prisma.inventoryTransaction.deleteMany({});
  await prisma.medicalLog.deleteMany({});
  await prisma.medication.deleteMany({});
  await prisma.food.deleteMany({});
  await prisma.crate.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.animal.deleteMany({});

  // leave users since theyre created via auth on the front-end
  // await prisma.user.deleteMany({});

  // get and filter staff vs reg users
  const users = await prisma.user.findMany();
  const [user1, user2] = users.filter((user) => user.role === 'USER');
  const [staff1] = users.filter((user) => user.role === 'STAFF');
  console.log({ user1, user2, staff1 });

  // wrap all seeding in $transaction ["atomic" -> all or nothing]
  const result = await prisma.$transaction(
    async (tx) => {
      const animal1 = await tx.animal.create({
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
              foster_user_id: user1.id,
              assigned_by_staff_id: staff1.id,
            },
          },
          modified_by: { create: { staff_user_id: staff1.id } },
        },
        include: { animal_assignments: true },
      });

      const animal2 = await tx.animal.create({
        data: {
          name: 'Penny',
          chip_id: 654321,
          dob: new Date('December 23 2015'),
          sex: 'FEMALE',
          species: 'DOG',
          foster_status: 'ADOPTED',
          kennel_id: 6,
          altered: true,
          weight: 48.9,
          last_modified: new Date(),
          picture: 'sorta-happy-puppy.jpeg',
          animal_assignments: {
            create: {
              start_date: new Date(),
              end_date: new Date('May 31 2031'),
              status: 'ACTIVE',
              foster_user_id: user2.id,
              assigned_by_staff_id: staff1.id,
            },
          },
          modified_by: { create: { staff_user_id: staff1.id } },
        },
        include: { animal_assignments: true },
      });

      const animal3 = await tx.animal.create({
        data: {
          name: 'Caramel',
          chip_id: 98765,
          dob: new Date('March 12 2020'),
          sex: 'MALE',
          species: 'CAT',
          foster_status: 'FOSTERED',
          kennel_id: 16,
          altered: true,
          weight: 18.6,
          last_modified: new Date(),
          picture: 'grumpy-cat.jpeg',
          // missing: end_date (optional)
          animal_assignments: {
            create: {
              start_date: new Date(),
              status: 'ACTIVE',
              foster_user_id: user2.id,
              assigned_by_staff_id: staff1.id,
            },
          },
          modified_by: { create: { staff_user_id: staff1.id } },
        },
        include: { animal_assignments: true },
      });

      const animal4 = await tx.animal.create({
        data: {
          name: 'George',
          chip_id: 123987,
          dob: new Date('September 19 2018'),
          sex: 'MALE',
          species: 'CAT',
          foster_status: 'FOSTERED',
          kennel_id: 100,
          altered: true,
          weight: 14.6,
          last_modified: new Date(),
          picture: 'grumpy-cat2.jpeg',
          animal_assignments: {
            create: {
              start_date: new Date(),
              end_date: new Date('October 21 2029'),
              status: 'ACTIVE',
              foster_user_id: user1.id,
              assigned_by_staff_id: staff1.id,
            },
          },
          modified_by: { create: { staff_user_id: staff1.id } },
        },
        include: { animal_assignments: true },
      });

      const animal5 = await tx.animal.create({
        data: {
          name: 'Tigger',
          chip_id: 12987,
          dob: new Date('January 19 2009'),
          sex: 'MALE',
          species: 'CAT',
          foster_status: 'FOSTERED',
          kennel_id: 10,
          altered: false,
          weight: 21.6,
          last_modified: new Date(),
          picture: 'unperturbed-cat.jpeg',
          animal_assignments: {
            create: {
              start_date: new Date(),
              end_date: new Date('February 21 2027'),
              status: 'ACTIVE',
              foster_user_id: user2.id,
              assigned_by_staff_id: staff1.id,
            },
          },
          modified_by: { create: { staff_user_id: staff1.id } },
        },
        include: { animal_assignments: true },
      });

      const animal6 = await tx.animal.create({
        data: {
          name: 'Winnie',
          chip_id: 12387,
          dob: new Date('May 6 2012'),
          sex: 'FEMALE',
          species: 'CAT',
          foster_status: 'FOSTERED',
          kennel_id: 20,
          altered: false,
          weight: 12.6,
          last_modified: new Date(),
          picture: 'lounging-cat.jpeg',
          animal_assignments: {
            create: {
              start_date: new Date(),
              end_date: new Date('December 1 2026'),
              status: 'ACTIVE',
              foster_user_id: user1.id,
              assigned_by_staff_id: staff1.id,
            },
          },
          modified_by: { create: { staff_user_id: staff1.id } },
        },
        include: { animal_assignments: true },
      });

      const animal7 = await tx.animal.create({
        data: {
          name: 'Belle',
          chip_id: 12397,
          dob: new Date('January 5 2016'),
          sex: 'FEMALE',
          species: 'DOG',
          foster_status: 'FOSTERED',
          kennel_id: 206,
          altered: true,
          weight: 65.3,
          last_modified: new Date(),
          picture: 'puffy-dog.jpeg',
          animal_assignments: {
            create: {
              start_date: new Date(),
              end_date: new Date('August 12 2028'),
              status: 'ACTIVE',
              foster_user_id: user1.id,
              assigned_by_staff_id: staff1.id,
            },
          },
          modified_by: { create: { staff_user_id: staff1.id } },
        },
        include: { animal_assignments: true },
      });

      const animal8 = await tx.animal.create({
        data: {
          name: 'Melky',
          chip_id: 12398,
          dob: new Date('November 12 2010'),
          sex: 'MALE',
          species: 'DOG',
          foster_status: 'FOSTERED',
          kennel_id: 8,
          altered: true,
          weight: 61.8,
          last_modified: new Date(),
          picture: 'bulky-dog.jpeg',
          animal_assignments: {
            create: {
              start_date: new Date(),
              end_date: new Date('September 2 2028'),
              status: 'ACTIVE',
              foster_user_id: user1.id,
              assigned_by_staff_id: staff1.id,
            },
          },
          modified_by: { create: { staff_user_id: staff1.id } },
        },
        include: { animal_assignments: true },
      });

      // no animal-assignment for animal9 and animal10
      const animal9 = await tx.animal.create({
        data: {
          name: 'Bojack',
          chip_id: 1238,
          dob: new Date('March 22 2022'),
          sex: 'MALE',
          species: 'DOG',
          foster_status: 'SHELTERED',
          kennel_id: 45,
          altered: true,
          weight: 77.8,
          last_modified: new Date(),
          picture: 'big-dog.jpeg',
          modified_by: { create: { staff_user_id: staff1.id } },
        },
        include: { animal_assignments: true },
      });

      const animal10 = await tx.animal.create({
        data: {
          name: 'Sasha',
          chip_id: 238,
          dob: new Date('May 2 2024'),
          sex: 'FEMALE',
          species: 'DOG',
          foster_status: 'SHELTERED',
          kennel_id: 5,
          altered: true,
          weight: 57.5,
          last_modified: new Date(),
          picture: 'puffy-dog2.jpeg',
          modified_by: { create: { staff_user_id: staff1.id } },
        },
        include: { animal_assignments: true },
      });

      const item1 = await tx.item.create({
        data: {
          category: 'FOOD',
          name: 'Wet Cat Food',
          brand: 'Fancy Feast',
          description: 'Fancy Feast Chicken Pate',
          species: 'CAT',
          unit: 'can',
          is_active: true,
          inventory: {
            create: {
              quantity: 40,
              expiration_date: new Date('November 11 2028'),
            },
          },
          food: { create: { life_stage: 'ADULT' } },
        },
        include: { inventory: true, medication: true },
      });

      const item2 = await tx.item.create({
        data: {
          category: 'FOOD',
          name: 'Dog Food 28 lb.',
          brand: 'Blue Buffalo',
          description: 'Blue Buffalo Life Protection Dog food 28 lb.',
          species: 'DOG',
          unit: 'LB',
          is_active: true,
          inventory: {
            create: {
              quantity: 12,
              expiration_date: new Date('August 11 2026'),
            },
          },
          food: { create: { life_stage: 'SENIOR' } },
        },
        include: { inventory: true, medication: true },
      });

      const item3 = await tx.item.create({
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
          food: { create: { life_stage: 'ADULT' } },
        },
        include: { inventory: true, medication: true },
      });

      const item4 = await tx.item.create({
        data: {
          category: 'FOOD',
          name: 'Cat Food 10 lb.',
          brand: 'Iams',
          description: 'Iams Proactive Health Indoor Cat Food 10 lb.',
          species: 'CAT',
          unit: 'LB',
          is_active: true,
          inventory: {
            create: {
              quantity: 8,
              expiration_date: new Date('May 13 2026'),
            },
          },
          food: { create: { life_stage: 'SENIOR' } },
        },
        include: { inventory: true, medication: true },
      });

      const item5 = await tx.item.create({
        data: {
          category: 'MEDICINE',
          name: 'Flea & Tick Treatment 3 ct.',
          brand: 'Frontline Plus',
          description: 'Frontline Plus Flea & Tick Treatment for Dogs 3 ct.',
          species: 'DOG',
          unit: 'CT',
          is_active: true,
          inventory: {
            create: {
              quantity: 45,
              expiration_date: new Date('January 10 2028'),
            },
          },
          medication: {
            create: {
              recommended_dose: '1 dose monthly (three month supply)',
              side_effects: 'skin irritation at application site; itching, lethargy',
              administration_route: 'topical',
            },
          },
        },
        include: { inventory: true, medication: true },
      });

      const item6 = await tx.item.create({
        data: {
          category: 'MEDICINE',
          name: 'Heartgard Plus Chewables 6 ct.',
          brand: 'Heartgard',
          description: 'Heartgard Plus Heartwork Prevention Chewables 6 ct.',
          species: 'DOG',
          unit: 'CT',
          is_active: true,
          inventory: {
            create: {
              quantity: 20,
              expiration_date: new Date('November 16 2028'),
            },
          },
          medication: {
            create: {
              recommended_dose: '1 chew monthly (six month supply)',
              side_effects: 'vomiting; diarrhea; decreased appetite',
              administration_route: 'oral',
            },
          },
        },
        include: { inventory: true, medication: true },
      });

      const item7 = await tx.item.create({
        data: {
          category: 'MEDICINE',
          name: 'Hairball Remedy Gel 4.4 oz.',
          brand: 'Lexatone',
          description: 'Lexatone Hairball Remedy Gel 4.4 oz.',
          species: 'CAT',
          unit: 'OZ',
          is_active: true,
          inventory: {
            create: {
              quantity: 5,
              expiration_date: new Date('January 20 2027'),
            },
          },
          medication: {
            create: {
              recommended_dose: 'gel administered as needed',
              side_effects: 'soft stool; lack of appetite',
              administration_route: 'oral',
            },
          },
        },
        include: { inventory: true, medication: true },
      });

      const item8 = await tx.item.create({
        data: {
          category: 'MEDICINE',
          name: 'Calming Diffuser Refill 1 ct.',
          brand: 'Feliway',
          description: 'Feliway Classic Calming Diffuser Refill 1 ct.',
          species: 'CAT',
          unit: 'CT',
          is_active: true,
          inventory: {
            create: {
              quantity: 8,
              expiration_date: new Date('January 16 2029'),
            },
          },
          medication: {
            create: {
              recommended_dose: 'plug in diffuser and use continuously; replace when empty',
              side_effects: 'mild sneezing',
              administration_route: 'inhalation',
            },
          },
        },
        include: { inventory: true, medication: true },
      });

      const item9 = await tx.item.create({
        data: {
          category: 'CRATE',
          name: 'Wire Dog Crate 42 in.',
          brand: 'Midwest',
          description: 'Midwest Double Door Wire Dog Crate 42 in.',
          species: 'DOG',
          unit: 'IN',
          is_active: true,
          inventory: {
            create: {
              quantity: 4,
            },
          },
          crate: {
            create: {
              size: 'LARGE',
              status: 'AVAILABLE',
            },
          },
        },
        include: { inventory: true, medication: true },
      });

      const item10 = await tx.item.create({
        data: {
          category: 'CRATE',
          name: 'Cat Carrier 19 in.',
          brand: 'Petmate',
          description: 'Petmate Two Door Top Load Cat Carrier 19 in.',
          species: 'CAT',
          unit: 'IN',
          is_active: true,
          inventory: {
            create: {
              quantity: 8,
            },
          },
          crate: {
            create: {
              size: 'SMALL',
              status: 'AVAILABLE',
            },
          },
        },
        include: { inventory: true, medication: true },
      });

      const inventoryTransaction1 = await tx.inventoryTransaction.create({
        data: {
          quantity: 5,
          status: 'COMPLETE',
          type: 'DISTRIBUTION',
          notes: '90 lbs. of food dispersed',
          foster_user: { connect: { id: user1.id } },
          staff_user: { connect: { id: staff1.id } },
          item: { connect: { id: item1.id } },
          inventory: { connect: { id: item1.inventory[0].id } },
        },
      });

      const inventoryTransaction2 = await tx.inventoryTransaction.create({
        data: {
          quantity: 5,
          status: 'COMPLETE',
          type: 'INTAKE',
          notes: 'no damages',
          staff_user: { connect: { id: staff1.id } },
          item: { connect: { id: item2.id } },
          inventory: { connect: { id: item2.inventory[0].id } },
        },
      });

      const inventoryTransaction3 = await tx.inventoryTransaction.create({
        data: {
          quantity: 500,
          status: 'COMPLETE',
          type: 'DISTRIBUTION',
          notes: 'paid in full',
          foster_user: { connect: { id: user2.id } },
          staff_user: { connect: { id: staff1.id } },
          item: { connect: { id: item3.id } },
          inventory: { connect: { id: item3.inventory[0].id } },
        },
      });

      const inventoryTransaction4 = await tx.inventoryTransaction.create({
        data: {
          quantity: 1,
          status: 'ACTIVE',
          type: 'LOAN',
          notes: 'no payment necessary',
          foster_user: { connect: { id: user1.id } },
          staff_user: { connect: { id: staff1.id } },
          item: { connect: { id: item4.id } },
          inventory: { connect: { id: item4.inventory[0].id } },
        },
      });

      const inventoryTransaction5 = await tx.inventoryTransaction.create({
        data: {
          quantity: 1,
          status: 'COMPLETE',
          type: 'LOAN',
          notes: 'no payment necessary',
          foster_user: { connect: { id: user2.id } },
          staff_user: { connect: { id: staff1.id } },
          item: { connect: { id: item5.id } },
          inventory: { connect: { id: item5.inventory[0].id } },
        },
      });

      const inventoryTransaction6 = await tx.inventoryTransaction.create({
        data: {
          quantity: 1,
          status: 'COMPLETE',
          type: 'DISTRIBUTION',
          notes: 'half paid',
          foster_user: { connect: { id: user2.id } },
          staff_user: { connect: { id: staff1.id } },
          item: { connect: { id: item6.id } },
          inventory: { connect: { id: item6.inventory[0].id } },
        },
      });

      const inventoryTransaction7 = await tx.inventoryTransaction.create({
        data: {
          quantity: 25,
          status: 'COMPLETE',
          type: 'INTAKE',
          notes: 'paid on receipt',
          staff_user: { connect: { id: staff1.id } },
          item: { connect: { id: item7.id } },
          inventory: { connect: { id: item7.inventory[0].id } },
        },
      });

      const inventoryTransaction8 = await tx.inventoryTransaction.create({
        data: {
          quantity: 1,
          status: 'COMPLETE',
          type: 'DISTRIBUTION',
          notes: 'paid',
          foster_user: { connect: { id: user1.id } },
          staff_user: { connect: { id: staff1.id } },
          item: { connect: { id: item8.id } },
          inventory: { connect: { id: item8.inventory[0].id } },
        },
      });

      const inventoryTransaction9 = await tx.inventoryTransaction.create({
        data: {
          quantity: 15,
          status: 'ACTIVE',
          type: 'LOAN',
          notes: 'no payment',
          foster_user: { connect: { id: user2.id } },
          staff_user: { connect: { id: staff1.id } },
          item: { connect: { id: item9.id } },
          inventory: { connect: { id: item9.inventory[0].id } },
        },
      });

      const inventoryTransaction10 = await tx.inventoryTransaction.create({
        data: {
          quantity: 5,
          status: 'COMPLETE',
          type: 'DISTRIBUTION',
          notes: 'paid in full',
          foster_user: { connect: { id: user1.id } },
          staff_user: { connect: { id: staff1.id } },
          item: { connect: { id: item10.id } },
          inventory: { connect: { id: item10.inventory[0].id } },
        },
      });

      const medicalLog1 = await tx.medicalLog.create({
        data: {
          category: 'MEDICAL',
          general_notes: "he's a good boy",
          behavior_notes: 'refer to the general notes',
          qty_administered: 30,
          dose: '1 capsule / day',
          administered_at: new Date(),
          prescription: '30 capsules taken by mouth, 1 / day',
          documents: 'not really sure what will go here',

          foster_user_id: user2.id,
          animal_id: animal1.id,
          assignment_id: animal1.animal_assignments[0].id,
          medication_id: item5.medication.id,
        },
      });

      const medicalLog2 = await tx.medicalLog.create({
        data: {
          category: 'MEDICAL',
          general_notes: 'Gave monthly preventative with food',
          behavior_notes: 'Slightly restless for 30 minutes after handling',
          qty_administered: 1,
          dose: '1 chew',
          administered_at: new Date(),
          prescription: 'Administer one chew by mouth once monthly with a meal',
          documents: 'not really sure what will go here',

          foster_user_id: user2.id,
          animal_id: animal1.id,
          assignment_id: animal1.animal_assignments[0].id,
          medication_id: item6.medication.id,
        },
      });

      const medicalLog3 = await tx.medicalLog.create({
        data: {
          category: 'MEDICAL',
          general_notes: 'Administered dose with meal.',
          qty_administered: 45,
          dose: '1 capsule / day',
          administered_at: new Date(),
          prescription: '30 capsules taken by mouth, 1 / day, with food',
          documents: 'not really sure what will go here',

          foster_user_id: user2.id,
          animal_id: animal2.id,
          assignment_id: animal1.animal_assignments[0].id,
          medication_id: item7.medication.id,
        },
      });

      const medicalLog4 = await tx.medicalLog.create({
        data: {
          category: 'BEHAVIORAL',
          general_notes: 'Lethargic and sleeping a lot',
          behavior_notes: 'refer to the general notes',
          qty_administered: 30,

          foster_user_id: user2.id,
          animal_id: animal4.id,
          assignment_id: animal1.animal_assignments[0].id,
        },
      });

      const medicalLog5 = await tx.medicalLog.create({
        data: {
          category: 'VETERINARY',
          general_notes: 'Gaining weight',
          behavior_notes: 'Less lethargic',
          documents: 'not really sure what will go here',

          foster_user_id: user2.id,
          animal_id: animal5.id,
          assignment_id: animal1.animal_assignments[0].id,
        },
      });

      const medicalLog6 = await tx.medicalLog.create({
        data: {
          category: 'MEDICAL',
          general_notes: "he's a good boy",
          behavior_notes: 'refer to the general notes',
          qty_administered: 15,
          dose: '1 capsule / day',
          administered_at: new Date(),
          prescription: '30 capsules taken by mouth, 1 / day',
          documents: 'not really sure what will go here',

          foster_user_id: user1.id,
          animal_id: animal1.id,
          assignment_id: animal1.animal_assignments[0].id,
          medication_id: item5.medication.id,
        },
      });

      const medicalLog7 = await tx.medicalLog.create({
        data: {
          category: 'MEDICAL',
          general_notes: "he's a good boy",
          behavior_notes: 'refer to the general notes',
          qty_administered: 250,
          dose: '1 capsule / day',
          administered_at: new Date(),
          prescription: '30 capsules taken by mouth, 1 / day',
          documents: 'not really sure what will go here',

          foster_user_id: user2.id,
          animal_id: animal5.id,
          assignment_id: animal5.animal_assignments[0].id,
          medication_id: item7.medication.id,
        },
      });

      const medicalLog8 = await tx.medicalLog.create({
        data: {
          category: 'BEHAVIORAL',
          general_notes: 'tempered demeanor',
          behavior_notes: 'laaaaaaaiiiiiddd back',

          animal_id: animal9.id,
        },
      });

      const medicalLog9 = await tx.medicalLog.create({
        data: {
          category: 'BEHAVIORAL',
          general_notes: "we've got a biter",
          behavior_notes: 'strong jaw',
          documents: 'not really sure what will go here',

          foster_user_id: user2.id,
          animal_id: animal1.id,
          assignment_id: animal1.animal_assignments[0].id,
        },
      });

      const medicalLog10 = await tx.medicalLog.create({
        data: {
          category: 'VETERINARY',
          general_notes: 'routine checkup, renwe prescription',
          behavior_notes: 'no notes',
          qty_administered: 60,
          dose: '1 capsule / day',
          administered_at: new Date(),
          prescription: '30 capsules taken by mouth, 1 / day',
          documents: 'not really sure what will go here',

          foster_user_id: user1.id,
          animal_id: animal4.id,
          assignment_id: animal4.animal_assignments[0].id,
          medication_id: item8.medication.id,
        },
      });
    },
    { timeout: 100000 },
  );
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

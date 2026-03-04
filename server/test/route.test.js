const prisma = require('../connections/prisma-client');
require('dotenv').config();

const getRandomRegularUser = async () => {
  const regularUsers = await prisma.user.findMany({ where: { role: 'USER' } });
  return regularUsers[Math.floor(Math.random() * regularUsers.length)];
};

const getRandomStaffUser = async () => {
  const staffUsers = await prisma.user.findMany({ where: { role: 'STAFF' } });
  return staffUsers[Math.floor(Math.random() * staffUsers.length)];
};

const getRandomAnimal = async () => {
  const animals = await prisma.animal.findMany({});
  return animals[Math.floor(Math.random() * animals.length)];
};

const getRandomAnimalAssignment = async () => {
  const assignments = await prisma.animalAssignment.findMany({});
  return assignments[Math.floor(Math.random() * assignments.length)];
};

const getRandomAnimalModification = async () => {
  const modifications = await prisma.animalModification.findMany({});
  return modifications[Math.floor(Math.random() * modifications.length)];
};

const getRandomInventory = async () => {
  const inventories = await prisma.inventory.findMany({});
  return inventories[Math.floor(Math.random() * inventories.length)];
};

const getRandomInventoryTransaction = async () => {
  const transactions = await prisma.inventoryTransaction.findMany({});
  return transactions[Math.floor(Math.random() * transactions.length)];
};

const getRandomItem = async () => {
  const items = await prisma.item.findMany({});
  return items[Math.floor(Math.random() * items.length)];
};

const getRandomCrate = async () => {
  const crates = await prisma.crate.findMany({});
  return crates[Math.floor(Math.random() * crates.length)];
};

const getRandomFood = async () => {
  const foods = await prisma.food.findMany({});
  return foods[Math.floor(Math.random() * foods.length)];
};

const getRandomMedication = async () => {
  const meds = await prisma.medication.findMany({});
  return meds[Math.floor(Math.random() * meds.length)];
};

const getRandomMedicalLog = async () => {
  const logs = await prisma.medicalLog.findMany({});
  return logs[Math.floor(Math.random() * logs.length)];
};

const getStaffUserToken = async () => {
  const response = await fetch(
    `https://tswvbykazoodrrqzfghs.supabase.co/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ email: 'another@test.com', password: 'password123' }),
    },
  );
  const data = await response.json();
  return data.access_token;
};

const getRegularUserToken = async () => {
  const response = await fetch(
    `https://tswvbykazoodrrqzfghs.supabase.co/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ email: 'testing@gmail.com', password: 'password123' }),
    },
  );
  const data = await response.json();
  return data.access_token;
};

const runTests = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    const USER_TOKEN = await getRegularUserToken();
    const staffUser = await getRandomStaffUser();
    const regularUser = await getRandomRegularUser();
    const animal = await getRandomAnimal();
    const PATH = `animals/${animal.id}/assign`;
    const METHOD = 'PATCH';

    const response = await fetch(`http://localhost:8080/api/${PATH}`, {
      method: METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
      body: JSON.stringify({
        start_date: '2026-02-12',
        end_date: '2026-12-12',
        status: 'ACTIVE',
        new_animal_status: 'FOSTERED',
        foster_user: regularUser.id,
        assigned_by_staff: staffUser.id,
      }),
    });
    const data = await response.json();
    console.log({ data });
  } catch (error) {
    console.log({ error });
  }
};

// Test: GET /api/animals with STAFF user (should see all animals)
const testGetAnimalsAsStaff = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    console.log('\n=== TEST: GET /api/animals as STAFF ===');
    const response = await fetch('http://localhost:8080/api/animals', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);
    if (response.status === 200 && Array.isArray(data)) {
      console.log('✓ STAFF can fetch all animals');
    } else {
      console.log('✗ STAFF fetch failed');
    }
  } catch (error) {
    console.log({ error });
  }
};

// Test: GET /api/animals with USER (should see only assigned animals)
const testGetAnimalsAsUser = async () => {
  try {
    const USER_TOKEN = await getRegularUserToken();
    console.log('\n=== TEST: GET /api/animals as USER ===');
    const response = await fetch('http://localhost:8080/api/animals', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);
    if (response.status === 200 && Array.isArray(data)) {
      console.log('✓ USER can fetch assigned animals');
    } else {
      console.log('✗ USER fetch failed');
    }
  } catch (error) {
    console.log({ error });
  }
};

// Test: GET /api/animals with filters (species, foster_status, sex)
const testGetAnimalsWithFilters = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    console.log('\n=== TEST: GET /api/animals with filters ===');
    const response = await fetch('http://localhost:8080/api/animals?species=DOG&foster_status=SHELTERED&sex=MALE', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);
    if (response.status === 200 && Array.isArray(data)) {
      console.log('✓ Filters work correctly');
    } else {
      console.log('✗ Filter test failed');
    }
  } catch (error) {
    console.log({ error });
  }
};

// Test: GET /api/animals with search filter
const testGetAnimalsWithSearch = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    console.log('\n=== TEST: GET /api/animals with search ===');
    const response = await fetch('http://localhost:8080/api/animals?search=buddy', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);
    if (response.status === 200 && Array.isArray(data)) {
      console.log('✓ Search filter works');
    } else {
      console.log('✗ Search test failed');
    }
  } catch (error) {
    console.log({ error });
  }
};

// Test: GET /api/animals with pagination
const testGetAnimalsWithPagination = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    console.log('\n=== TEST: GET /api/animals with pagination ===');
    const response = await fetch('http://localhost:8080/api/animals?page=1&limit=5', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response count: ${data.length}`);
    if (response.status === 200 && Array.isArray(data)) {
      console.log('✓ Pagination works');
    } else {
      console.log('✗ Pagination test failed');
    }
  } catch (error) {
    console.log({ error });
  }
};

// Test: GET /api/animals without token (should return 401)
const testGetAnimalsNoToken = async () => {
  try {
    console.log('\n=== TEST: GET /api/animals without token ===');
    const response = await fetch('http://localhost:8080/api/animals', {
      method: 'GET',
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);
    if (response.status === 401) {
      console.log('✓ 401 returned for missing token');
    } else {
      console.log('✗ Expected 401 status');
    }
  } catch (error) {
    console.log({ error });
  }
};

// Test: GET /api/animals with invalid query params (should return 400)
const testGetAnimalsInvalidQuery = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    console.log('\n=== TEST: GET /api/animals with invalid query ===');
    const response = await fetch('http://localhost:8080/api/animals?species=INVALID', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);
    if (response.status === 400) {
      console.log('✓ 400 returned for invalid query');
    } else {
      console.log('✗ Expected 400 status');
    }
  } catch (error) {
    console.log({ error });
  }
};

const runAllTests = async () => {
  console.log('Starting route tests...\n');
  await testGetAnimalsNoToken();
  await testGetAnimalsInvalidQuery();
  await testGetAnimalsAsStaff();
  await testGetAnimalsAsUser();
  await testGetAnimalsWithFilters();
  await testGetAnimalsWithSearch();
  await testGetAnimalsWithPagination();
  console.log('\n=== All tests completed ===');
};

runTests();
runAllTests();

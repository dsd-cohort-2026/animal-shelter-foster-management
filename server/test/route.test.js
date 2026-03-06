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
      body: JSON.stringify({ email: 'staff@user.com', password: 'staffpassword' }),
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
      body: JSON.stringify({ email: 'regular@user.com', password: 'regularpassword' }),
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
    const inventory = await prisma.inventory.findFirst({
      where: {
        inventory_transactions: { some: {} },
      },
      include: {
        inventory_transactions: { take: 1 },
      },
    });
    const transaction = inventory.inventory_transactions[0];
    const item = await getRandomItem();
    const animal = await getRandomAnimal();
    const PATH = `inventory/${inventory.id}`;
    const METHOD = 'PATCH';

    const response = await fetch(`http://localhost:8080/api/${PATH}`, {
      method: METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
      body: JSON.stringify({
        quantity: 47835623,
        expiration_date: '2026-12-30',
        item_id: item.id,
        foster_user: regularUser.id,
        type: 'INTAKE',
        status: 'COMPLETE',
        notes: 'transaction complete, paid in full',
        transaction_id: transaction.id,
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

const testGetMedicalLogsNoToken = async () => {
  try {
    console.log('\n=== TEST: GET /api/medical-logs without token ===');
    const response = await fetch('http://localhost:8080/api/medical-logs', {
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

const testGetMedicalLogsInvalidQuery = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    console.log('\n=== TEST: GET /api/medical-logs with invalid query ===');
    const response = await fetch('http://localhost:8080/api/medical-logs?foo=bar', {
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

const testGetMedicalLogsAsStaff = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    console.log('\n=== TEST: GET /api/medical-logs as STAFF ===');
    const response = await fetch('http://localhost:8080/api/medical-logs', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Number of logs returned: ${data.length}`);
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);
    if (response.status === 200 && Array.isArray(data)) {
      console.log('✓ STAFF can fetch all medical logs');
    } else {
      console.log('✗ STAFF fetch failed');
    }
  } catch (error) {
    console.log({ error });
  }
};

const testGetMedicalLogsAsUser = async () => {
  try {
    const USER_TOKEN = await getRegularUserToken();
    console.log('\n=== TEST: GET /api/medical-logs as USER ===');
    const response = await fetch('http://localhost:8080/api/medical-logs', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Number of logs returned: ${data.length}`);
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);
    if (response.status === 200 && Array.isArray(data)) {
      console.log('✓ USER can fetch their medical logs');
    } else {
      console.log('✗ USER fetch failed');
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
  await testGetMedicalLogsNoToken();
  await testGetMedicalLogsInvalidQuery();
  await testGetMedicalLogsAsStaff();
  await testGetMedicalLogsAsUser();
  console.log('\n=== All tests completed ===');
};

const userByIdTest = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    const USER_TOKEN = await getRegularUserToken();
    const user = await getRandomRegularUser();

    // happy path - 200
    console.log('\n=== TEST: GET /api/user/:id with STAFF token ===');
    let res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`
      }
    });
    let data = await res.json()
    console.log('Status: ', res.status)
    console.log('response', JSON.stringify(data, null, 2))

    // user token - 403
    console.log('\n=== TEST: GET /api/user/:id with USER token ===');
    res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`
      }
    });
    data = await res.json()
    console.log('Status: ', res.status)
    console.log('response', JSON.stringify(data, null, 2))

    // missing token - 401
    console.log('\n=== TEST: GET /api/user/:id with missing token ===');
    res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
      method: 'GET',
    });
    data = await res.json()
    console.log('Status: ', res.status)
    console.log('response', JSON.stringify(data, null, 2))

    // non-existent id - 404
    console.log('\n=== TEST: GET /api/user/:id with non-existent id ===');
    res = await fetch(`http://localhost:8080/api/users/81720ca2-4ce1-45bc-9ef1-5ff84176dff1`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    data = await res.json()
    console.log('Status: ', res.status)
    console.log('response', JSON.stringify(data, null, 2))

    // invalid id - 400
    console.log('\n=== TEST: GET /api/user/:id with invalid uuid ===');
    res = await fetch(`http://localhost:8080/api/users/123`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    data = await res.json()
    console.log('Status: ', res.status)
    console.log('response', JSON.stringify(data, null, 2))
  } catch (error) {
    console.log(error)
  }
}

runTests();
runAllTests();
userByIdTest();

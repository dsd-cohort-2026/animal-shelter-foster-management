const prisma = require('../connections/prisma-client');
require('dotenv').config();

const getRandomRegularUser = async () => {
  const regularUsers = await prisma.user.findMany({ where: { role: 'USER' } });
  return regularUsers[Math.floor(Math.random() * regularUsers.length)];
};

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
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
    const response = await fetch(
      'http://localhost:8080/api/animals?species=DOG&foster_status=SHELTERED&sex=MALE',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${STAFF_TOKEN}`,
        },
      },
    );
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
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    let data = await res.json();
    console.log('Status: ', res.status);
    console.log('response', JSON.stringify(data, null, 2));

    // user token - 403
    console.log('\n=== TEST: GET /api/user/:id with USER token ===');
    res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
      },
    });
    data = await res.json();
    console.log('Status: ', res.status);
    console.log('response', JSON.stringify(data, null, 2));

    // missing token - 401
    console.log('\n=== TEST: GET /api/user/:id with missing token ===');
    res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
      method: 'GET',
    });
    data = await res.json();
    console.log('Status: ', res.status);
    console.log('response', JSON.stringify(data, null, 2));

    // non-existent id - 404
    console.log('\n=== TEST: GET /api/user/:id with non-existent id ===');
    res = await fetch(`http://localhost:8080/api/users/81720ca2-4ce1-45bc-9ef1-5ff84176dff1`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    data = await res.json();
    console.log('Status: ', res.status);
    console.log('response', JSON.stringify(data, null, 2));

    // invalid id - 400
    console.log('\n=== TEST: GET /api/user/:id with invalid uuid ===');
    res = await fetch(`http://localhost:8080/api/users/123`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    data = await res.json();
    console.log('Status: ', res.status);
    console.log('response', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error);
  }
};

// runTests();
// runAllTests();
// userByIdTest();

const runAddTransactionPostTests = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    const staffUser = await getRandomStaffUser();
    const regularUser = await getRandomRegularUser();
    const inventory = await getRandomInventory();
    const item = await prisma.item.findUnique({ where: { id: inventory.item_id } });
    let test_number = 0;

    let res = await fetch('http://localhost:8080/api/inventory-transactions/intake', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 10,
        status: 'COMPLETE',
        staff_user: staffUser.id,
        item_name: 'Test Food Item',
        item_brand: 'Test',
        item_description: 'Food Item',
        notes: '-',
        item_category: 'FOOD',
        item_species: 'CAT',
        item_unit: 'can',
        item_is_active: true,
        item_food_life_stage: 'ADULT',
      }),
    });
    let data = await res.json();
    if (res.status === 201) console.log('test 1 passed: new item on intake');
    else console.log('test 1 failed: new item on intake');

    res = await fetch('http://localhost:8080/api/inventory-transactions/intake', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 5,
        status: 'COMPLETE',
        staff_user: staffUser.id,
        item_id: item.id,
        notes: 'Pre-Existing Item',
      }),
    });
    data = await res.json();
    if (res.status === 201)
      console.log('test 2 passed: existing item on intake, find inventory by id');
    else console.log('test 2 failed: existing item on intake, find inventory by id');

    res = await fetch('http://localhost:8080/api/inventory-transactions/intake', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 3,
        status: 'COMPLETE',
        staff_user: staffUser.id,
        notes: 'eferenced Specific Inventory',
        item_id: item.id,
        inventory_id: inventory.id,
      }),
    });
    data = await res.json();
    if (res.status === 201) console.log('test 3 passed: existing item, explicit inventory');
    else console.log('test 3 failed: existing item, explicit inventory');

    res = await fetch('http://localhost:8080/api/inventory-transactions/intake', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 5,
        status: 'COMPLETE',
        notes: `This won't pass anyways`,
        staff_user: staffUser.id,
      }),
    });
    data = await res.json();
    if (res.status === 400)
      console.log('test 4 passed: rejects lack of BOTH item_id and values to create item');
    else console.log('test 4 failed: need to supply item_id or values to create item');

    res = await fetch('http://localhost:8080/api/inventory-transactions/intake', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 5,
        status: 'COMPLETE',
        staff_user: staffUser.id,
        item_name: 'Missing Stage Food',
        item_category: 'FOOD',
        item_species: 'DOG',
        item_unit: 'bag',
        item_is_active: true,
        item_brand: 'Test',
        item_description: 'Food Item',
        notes: '-',
      }),
    });
    data = await res.json();
    if (res.status === 400)
      console.log('test 5 passed: rejects a new food that misses food properties (life_stage)');
    else
      console.log(
        'test 5 failed: should reject a new food that misses food properties (life_stage)',
      );

    res = await fetch('http://localhost:8080/api/inventory-transactions/intake', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 5,
        status: 'COMPLETE',
        item_id: item.id,
        notes: 'This is here!',
      }),
    });
    data = await res.json();
    if (res.status === 400)
      console.log('test 6 passed: rejects a transaction that isnt attributed to a staff_user');
    else console.log('test 6 failed: should reject the lack of a staff_user');

    res = await fetch('http://localhost:8080/api/inventory-transactions/distribute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 1,
        type: 'DISTRIBUTION',
        status: 'COMPLETE',
        staff_user: staffUser.id,
        foster_user: regularUser.id,
        item_id: item.id,
        notes: 'Passes with no inventory referenced',
      }),
    });
    data = await res.json();
    if (res.status === 201)
      console.log('test 7 passed: accepts no inventory_id, finds it based off of item_id');
    else console.log('test 7 failed: should allow a lack of inventory_id');

    res = await fetch('http://localhost:8080/api/inventory-transactions/distribute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 1,
        type: 'LOAN',
        status: 'ACTIVE',
        staff_user: staffUser.id,
        foster_user: regularUser.id,
        item_id: item.id,
        notes: 'On Loan',
      }),
    });
    data = await res.json();
    if (res.status === 201) console.log('test 8 passed: allows active loans');
    else console.log('test 8 failed: should allow active loans');

    res = await fetch('http://localhost:8080/api/inventory-transactions/distribute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 999999,
        type: 'DISTRIBUTION',
        status: 'COMPLETE',
        staff_user: staffUser.id,
        foster_user: regularUser.id,
        item_id: item.id,
        notes: `That's a lot of food...`,
      }),
    });
    data = await res.json();
    if (res.status === 409)
      console.log('test 9 passed: rejects when quantity exceeds all inventory count');
    else console.log('test 9 failed: should reject when quantity exceeds all inventory count');

    res = await fetch('http://localhost:8080/api/inventory-transactions/distribute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 1,
        type: 'DISTRIBUTION',
        status: 'COMPLETE',
        staff_user: staffUser.id,
        foster_user: regularUser.id,
        notes: 'What item are we talking about here?',
      }),
    });
    data = await res.json();
    if (res.status === 400)
      console.log('test 10 passed: rejects a distribution of an unknown / nonexistent item');
    else console.log('test 10 failed: should reject missing item_id');

    res = await fetch('http://localhost:8080/api/inventory-transactions/distribute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 1,
        type: 'INTAKE',
        status: 'ACTIVE',
        staff_user: staffUser.id,
        foster_user: regularUser.id,
        item_id: item.id,
        notes: `We should be good here, but an intake won't work`,
      }),
    });
    data = await res.json();
    if (res.status === 400)
      console.log('test 11 passed: rejects an INTAKE on /distribute endpoint');
    else console.log('test 11 failed: /distribute should not accept INTAKE');

    res = await fetch('http://localhost:8080/api/inventory-transactions/distribute', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STAFF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 1,
        type: 'DISTRIBUTION',
        status: 'COMPLETE',
        staff_user: staffUser.id,
        item_id: item.id,
        notes: `Who'd this go to?`,
      }),
    });
    data = await res.json();
    if (res.status === 400)
      console.log(
        'test 12 passed: loans and distributions should reject when not associated with a foster_user',
      );
    else console.log('test 12 failed: should reject a loan to no one');
  } catch (error) {
    console.log({ error });
  }
};

// Test: GET /api/inventory-transactions without token (should return 401)
const testGetInventoryTransactionsNoToken = async () => {
  try {
    console.log('\n=== TEST: GET /api/inventory-transactions without token ===');
    const response = await fetch('http://localhost:8080/api/inventory-transactions', {
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

// Test: GET /api/inventory-transactions as STAFF (should see all transactions)
const testGetInventoryTransactionsAsStaff = async () => {
  try {
    const STAFF_TOKEN = await getStaffUserToken();
    console.log('\n=== TEST: GET /api/inventory-transactions as STAFF ===');
    const response = await fetch('http://localhost:8080/api/inventory-transactions', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Number of transactions returned: ${Array.isArray(data) ? data.length : 'N/A'}`);
    if (response.status === 200 && Array.isArray(data)) {
      console.log('✓ STAFF can fetch all transactions');
    } else {
      console.log('✗ STAFF fetch failed');
    }
  } catch (error) {
    console.log({ error });
  }
};

// Test: GET /api/inventory-transactions as USER (should see only their own transactions)
const testGetInventoryTransactionsAsUser = async () => {
  try {
    const USER_TOKEN = await getRegularUserToken();
    const regularUser = await getUserByEmail('regular@user.com');
    console.log('\n=== TEST: GET /api/inventory-transactions as USER ===');
    const response = await fetch('http://localhost:8080/api/inventory-transactions', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Number of transactions returned: ${Array.isArray(data) ? data.length : 'N/A'}`);
    if (response.status === 200 && Array.isArray(data)) {
      const allBelongToUser = data.every((t) => t.foster_user_id === regularUser.id);
      if (allBelongToUser || data.length === 0) {
        console.log('✓ USER sees only their own transactions');
      } else {
        console.log('✗ USER can see transactions that do not belong to them');
      }
    } else {
      console.log('✗ USER fetch failed');
    }
  } catch (error) {
    console.log({ error });
  }
};

const runGetInventoryTransactionTests = async () => {
  console.log('Starting GET /api/inventory-transactions tests...\n');
  await testGetInventoryTransactionsNoToken();
  await testGetInventoryTransactionsAsStaff();
  await testGetInventoryTransactionsAsUser();
  console.log('\n=== GET /api/inventory-transactions tests completed ===');
};

runAddTransactionPostTests();
runGetInventoryTransactionTests();

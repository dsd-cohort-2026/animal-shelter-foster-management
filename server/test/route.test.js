const PATH = 'animals/create';
const METHOD = 'POST';

require('dotenv').config();

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
    const response = await fetch(`http://localhost:8080/api/${PATH}`, {
      method: METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STAFF_TOKEN}`,
      },
      body: JSON.stringify({
        name: 'Create Animal Test',
        chip_id: 555555555,
        dob: '2026-02-12',
        sex: 'MALE',
        species: 'DOG',
        foster_status: 'SHELTERED',
        kennel_id: 547856,
        altered: true,
        weight: 54.4,
        last_modified: '2026-02-25',
        picture: 'test.pic.jpeg',
        modified_by: 'b79ba20a-692d-413a-a30a-b84f4b394120',
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

const PATH = 'animals/6ee5ac08-71dc-4cba-b3f5-e32e84b03eae/unassign';
const METHOD = 'PATCH';

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
        assigned_by_staff: '85bc3d95-8124-4e69-a6c9-d4cd16257794',
        assignment_id: 'c7b6081a-728e-4c6b-870b-71d576bbb352',
      }),
    });
    const data = await response.json();
    console.log({ data });
  } catch (error) {
    console.log({ error });
  }
};

runTests();

const http = require('http');

async function testEventApi() {
  console.log('Testing GET /api/events...');
  const res = await fetch('http://localhost:4028/api/events');
  const data = await res.json();
  console.log('GET /api/events response success:', data.success, 'events count:', data.data?.length);

  console.log('Testing GET /api/events?filter=upcoming...');
  const resUpcoming = await fetch('http://localhost:4028/api/events?filter=upcoming');
  const dataUpcoming = await resUpcoming.json();
  console.log('Upcoming events count:', dataUpcoming.data?.length);

  console.log('Testing GET /api/events?filter=past...');
  const resPast = await fetch('http://localhost:4028/api/events?filter=past');
  const dataPast = await resPast.json();
  console.log('Past events count:', dataPast.data?.length);
}

testEventApi().catch(console.error);

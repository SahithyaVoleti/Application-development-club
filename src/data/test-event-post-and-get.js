const http = require('http');

async function verifyEventAddAndFetch() {
  console.log('--- Testing Add Event and Immediate Fetch ---');

  // 1. Post a new event
  const newEventData = {
    title: 'New AI & Cloud Workshop 2026',
    category: 'Workshop',
    description: 'Hands-on AI and cloud workshop organized for CSE students.',
    date: '2026-10-25',
    startTime: '10:00',
    endTime: '16:00',
    venue: 'CSE Seminar Hall 1',
    organizer: 'Dept. of CSE',
  };

  const resPost = await fetch('http://localhost:4028/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newEventData),
  });

  const dataPost = await resPost.json();
  console.log('POST /api/events response:', dataPost);
  if (!dataPost.success || !dataPost.data?.id) {
    throw new Error('Failed to create event!');
  }

  const createdId = dataPost.data.id;

  // 2. Fetch all events
  const resGet = await fetch('http://localhost:4028/api/events');
  const dataGet = await resGet.json();
  const foundInAll = dataGet.data?.find((e) => e.id === createdId);
  console.log('✅ Found in GET /api/events:', !!foundInAll, foundInAll?.title);

  // 3. Fetch upcoming events
  const resUpcoming = await fetch('http://localhost:4028/api/events?filter=upcoming');
  const dataUpcoming = await resUpcoming.json();
  const foundInUpcoming = dataUpcoming.data?.find((e) => e.id === createdId);
  console.log('✅ Found in GET /api/events?filter=upcoming:', !!foundInUpcoming, foundInUpcoming?.title);

  if (!foundInAll || !foundInUpcoming) {
    throw new Error('Event created but not found in GET /api/events!');
  }

  // 4. Delete the test event to leave database clean
  const resDel = await fetch(`http://localhost:4028/api/events/${createdId}`, { method: 'DELETE' });
  const dataDel = await resDel.json();
  console.log('✅ Deleted test event response:', dataDel);

  console.log('--- ALL EVENT ADD & FETCH TESTS PASSED 100% ---');
}

verifyEventAddAndFetch().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

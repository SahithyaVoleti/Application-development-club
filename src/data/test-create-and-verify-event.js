const fs = require('fs');
const path = require('path');
const { PersistentEventStore } = require('../lib/eventStore');

async function testEventCreation() {
  console.log('--- Testing Persistent Event Store ---');

  // 1. Create a test event
  const testEventData = {
    title: 'Automated Test Hackathon 2026',
    category: 'Hackathon',
    description: 'This is a test event created automatically to verify database persistence and real-time sync.',
    date: '2026-10-15',
    startTime: '10:00',
    endTime: '17:00',
    venue: 'CSE Main Lab, Block A',
    organizer: 'Dept. of CSE',
    registrationDeadline: '2026-10-14T23:59',
    capacity: 100,
    posterUrl: '/images/events/remote-event-10.png',
    eligibility: 'All CSE Students',
    rules: 'No cheating',
    requirements: 'Laptop',
    contactPerson: 'Admin Test',
    contactEmail: 'admin@vignan.ac.in',
    status: 'UPCOMING',
    isPublished: true,
  };

  const created = PersistentEventStore.createEvent(testEventData);
  console.log('✅ Created event with ID:', created.id);

  // 2. Fetch all events and verify
  const allEvents = PersistentEventStore.getAllEvents();
  const found = allEvents.find((e) => e.id === created.id);
  if (!found) {
    throw new Error('Created event not found in getAllEvents()!');
  }
  console.log('✅ Found created event in persistent store:', found.title);

  // 3. Verify it is in upcoming events
  const upcomingEvents = PersistentEventStore.getUpcomingEvents();
  const foundUpcoming = upcomingEvents.find((e) => e.id === created.id);
  if (!foundUpcoming) {
    throw new Error('Created event not found in getUpcomingEvents()!');
  }
  console.log('✅ Found created event in upcoming events list!');

  // 4. Update the event
  const updated = PersistentEventStore.updateEvent(created.id, {
    title: 'Automated Test Hackathon 2026 - UPDATED',
  });
  console.log('✅ Updated event title:', updated.title);

  // 5. Delete the test event to keep test clean
  const deleted = PersistentEventStore.deleteEvent(created.id);
  console.log('✅ Deleted test event:', deleted);

  console.log('--- ALL PERSISTENT EVENT STORE TESTS PASSED 100% ---');
}

testEventCreation().catch((e) => {
  console.error('❌ Test failed:', e);
  process.exit(1);
});

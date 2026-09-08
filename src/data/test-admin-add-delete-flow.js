const { PersistentEventStore } = require('../lib/eventStore');

async function testAddAndDeleteFlow() {
  console.log('--- Testing Admin Add & Delete Upcoming Event Control Flow ---');

  // 1. Admin Adds an Upcoming Event
  const newUpcomingEvent = PersistentEventStore.createEvent({
    title: 'Admin Control Test Event',
    category: 'Coding Competition',
    description: 'Upcoming event created to test admin add and delete feature.',
    date: '2026-11-20',
    startTime: '09:00',
    endTime: '17:00',
    venue: 'CSE Seminar Hall B',
    organizer: 'Dept of CSE Admin',
    registrationDeadline: '2026-11-18T23:59',
    capacity: 100,
    posterUrl: '/images/events/remote-event-10.png',
    status: 'UPCOMING',
    isPublished: true,
  });

  console.log('✅ Admin successfully added upcoming event:', newUpcomingEvent.id, newUpcomingEvent.title);

  // 2. Verify event appears in upcoming list
  let upcoming = PersistentEventStore.getUpcomingEvents();
  let exists = upcoming.some((e) => e.id === newUpcomingEvent.id);
  console.log('✅ Event present in Upcoming Events list:', exists);
  if (!exists) throw new Error('Added event failed to appear in upcoming list!');

  // 3. Admin Deletes the Upcoming Event
  const deleteResult = PersistentEventStore.deleteEvent(newUpcomingEvent.id);
  console.log('✅ Admin successfully deleted upcoming event:', deleteResult);

  // 4. Verify event is removed from upcoming list
  upcoming = PersistentEventStore.getUpcomingEvents();
  exists = upcoming.some((e) => e.id === newUpcomingEvent.id);
  console.log('✅ Event removed from Upcoming Events list:', !exists);
  if (exists) throw new Error('Deleted event still present in upcoming list!');

  console.log('--- ALL ADMIN ADD & DELETE CONTROL TESTS PASSED 100% ---');
}

testAddAndDeleteFlow().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

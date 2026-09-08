const { PersistentEventStore, calculateDynamicStatus } = require('../lib/eventStore');

async function testFinishedEventsTransition() {
  console.log('--- Testing Finished Events Dynamic Transition ---');

  // 1. Create an event whose date has passed (e.g., 2026-09-01)
  const pastEvent = PersistentEventStore.createEvent({
    title: 'Finished Event Test',
    category: 'Workshop',
    description: 'This event date has already finished.',
    date: '2026-09-01',
    startTime: '09:00',
    endTime: '17:00',
    venue: 'CSE Lab 1',
    organizer: 'Dept. of CSE',
    status: 'UPCOMING', // Created as UPCOMING initially
    isPublished: true,
  });

  console.log('✅ Created event:', pastEvent.id, pastEvent.date);

  // 2. Verify status calculated dynamically
  const status = calculateDynamicStatus(pastEvent);
  console.log('✅ Calculated dynamic status:', status);
  if (status !== 'COMPLETED') {
    throw new Error(`Expected status COMPLETED for past date, but got ${status}`);
  }

  // 3. Verify it is in Past Events list
  const pastList = PersistentEventStore.getPastEvents();
  const foundPast = pastList.some((e) => e.id === pastEvent.id);
  console.log('✅ Found in Past Events list:', foundPast);

  // 4. Verify it is NOT in Upcoming Events list
  const upcomingList = PersistentEventStore.getUpcomingEvents();
  const foundUpcoming = upcomingList.some((e) => e.id === pastEvent.id);
  console.log('✅ Absent from Upcoming Events list:', !foundUpcoming);

  if (!foundPast || foundUpcoming) {
    throw new Error('Finished event transition test failed!');
  }

  // Clean up
  PersistentEventStore.deleteEvent(pastEvent.id);
  console.log('--- ALL FINISHED EVENT TRANSITION TESTS PASSED 100% ---');
}

testFinishedEventsTransition().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

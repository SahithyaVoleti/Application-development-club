import { PrismaClient, EventStatus, AttendanceStatus, Role } from '@prisma/client';
import { MOCK_EVENTS, MOCK_REGISTRATIONS, GALLERY_IMAGES } from '../src/lib/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PostgreSQL database...');

  // 1. Seed Default Admin & Student Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@appdevhub.com' },
    update: {
      role: Role.ADMIN,
      name: 'Application Hub Admin',
    },
    create: {
      name: 'Application Hub Admin',
      email: 'admin@appdevhub.com',
      passwordHash: '$2a$10$e8qU7w7p.wJ3g6hYvY9k1.0hWk2Qz6.p5v5l1s5.wJ3g6hYvY9k1.', // Default Admin hashed
      role: Role.ADMIN,
      studentId: 'ADMIN-001',
      department: 'CSE',
      phone: '+91 9876543210',
      college: 'VFSTR / Vignan University',
    },
  });

  console.log('Admin user created/updated:', adminUser.email);

  // 2. Seed Events
  for (const event of MOCK_EVENTS) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {
        title: event.title,
        category: event.category,
        branches: event.branches || [],
        description: event.description,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        venue: event.venue,
        organizer: event.organizer,
        registrationDeadline: event.registrationDeadline,
        capacity: event.capacity,
        posterUrl: event.posterUrl,
        eligibility: event.eligibility,
        rules: event.rules,
        requirements: event.requirements,
        contactPerson: event.contactPerson,
        contactEmail: event.contactEmail,
        status: event.status as EventStatus,
        allocatedBudget: (event as any).allocatedBudget || 50000,
        isPublished: true,
      },
      create: {
        id: event.id,
        title: event.title,
        category: event.category,
        branches: event.branches || [],
        description: event.description,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        venue: event.venue,
        organizer: event.organizer,
        registrationDeadline: event.registrationDeadline,
        capacity: event.capacity,
        posterUrl: event.posterUrl,
        eligibility: event.eligibility,
        rules: event.rules,
        requirements: event.requirements,
        contactPerson: event.contactPerson,
        contactEmail: event.contactEmail,
        status: event.status as EventStatus,
        allocatedBudget: (event as any).allocatedBudget || 50000,
        isPublished: true,
        createdAt: new Date(event.createdAt),
      },
    });
  }

  // 3. Seed Registrations
  for (const reg of MOCK_REGISTRATIONS) {
    await prisma.registration.upsert({
      where: { registrationId: reg.registrationId },
      update: {
        eventId: reg.eventId,
        studentId: reg.studentId,
        studentName: reg.studentName,
        email: reg.email,
        mobile: reg.mobile,
        department: reg.department,
        year: reg.year,
        section: reg.section,
        gender: reg.gender,
        skills: reg.skills,
        attendanceStatus: reg.attendanceStatus as AttendanceStatus,
      },
      create: {
        id: reg.id,
        eventId: reg.eventId,
        studentId: reg.studentId,
        studentName: reg.studentName,
        email: reg.email,
        mobile: reg.mobile,
        department: reg.department,
        year: reg.year,
        section: reg.section,
        gender: reg.gender,
        skills: reg.skills,
        registrationId: reg.registrationId,
        registrationDate: new Date(reg.registrationDate),
        attendanceStatus: reg.attendanceStatus as AttendanceStatus,
      },
    });
  }

  // 4. Seed Gallery Images
  for (const img of GALLERY_IMAGES) {
    await prisma.galleryImage.upsert({
      where: { id: img.id },
      update: {
        eventId: img.eventId,
        imageUrl: img.imageUrl,
        caption: img.caption,
      },
      create: {
        id: img.id,
        eventId: img.eventId,
        imageUrl: img.imageUrl,
        caption: img.caption,
      },
    });
  }

  console.log('PostgreSQL database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

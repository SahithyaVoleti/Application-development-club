const {
  createUser,
  findUserByEmail,
  approveAdminRequest,
  rejectAdminRequest,
  getAllAdminRequests,
} = require('../src/lib/userStore');
const { generateApprovalActionToken, verifyApprovalActionToken } = require('../src/lib/auth');

async function testFullSyncFlow() {
  console.log('--- Starting End-to-End Approval Sync Test ---');

  // 1. Register a test admin
  const testEmail = `test.faculty.${Date.now()}@vignan.ac.in`;
  const newAdmin = await createUser({
    name: 'Dr. Test Faculty Member',
    email: testEmail,
    phone: '+91 9988776655',
    staffId: 'FAC-CSE-099',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    passwordHash: '$2b$10$dummyhash',
    role: 'ADMIN',
    status: 'PENDING_APPROVAL',
    otpVerified: false,
  });

  console.log('1. Created Pending Admin:', newAdmin.id, newAdmin.name, newAdmin.status);
  if (newAdmin.status !== 'PENDING_APPROVAL') {
    throw new Error('Expected status to be PENDING_APPROVAL');
  }

  // 2. Generate signed approval action token for Super Admin email link
  const superAdminEmail = 'sahithyalakshmivoleti@gmail.com';
  const token = generateApprovalActionToken(newAdmin.id, newAdmin.email, 'approve', superAdminEmail);
  console.log('2. Generated Signed Token:', token ? 'SUCCESS' : 'FAILED');

  const verifiedPayload = verifyApprovalActionToken(token);
  console.log('   Token Payload Verified:', verifiedPayload.adminId === newAdmin.id && verifiedPayload.action === 'approve');

  // 3. Test Email Approval Pathway (using backend approveAdminRequest)
  const approvalResult = await approveAdminRequest(newAdmin.id, `Super Admin (${superAdminEmail})`);
  console.log('3. Approved via Backend logic:', approvalResult.user?.status, '| alreadyProcessed:', approvalResult.alreadyProcessed);

  if (approvalResult.user?.status !== 'APPROVED') {
    throw new Error('Expected status to be APPROVED');
  }

  // 4. Test Duplicate Approval Guard
  const duplicateResult = await approveAdminRequest(newAdmin.id, `Super Admin (${superAdminEmail})`);
  console.log('4. Duplicate Approval Guard Check:', duplicateResult.alreadyProcessed === true ? 'PASSED (alreadyProcessed: true)' : 'FAILED');

  // 5. Verify Dashboard Fetch (getAllAdminRequests) reflects the update
  const allAdmins = await getAllAdminRequests();
  const updatedInList = allAdmins.find(a => a.id === newAdmin.id);
  console.log('5. Dashboard Fetch Synchronization:', updatedInList?.name, '--> Status:', updatedInList?.status);

  // Clean up test admin
  const { deleteUser } = require('../src/lib/userStore');
  await deleteUser(newAdmin.id);
  console.log('6. Cleanup:', 'Test admin removed.');

  console.log('✔ END-TO-END APPROVAL SYNC TEST COMPLETED SUCCESSFULLY!');
}

testFullSyncFlow().catch(err => {
  console.error('✖ TEST FAILED:', err);
  process.exit(1);
});

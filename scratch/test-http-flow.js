const crypto = require('crypto');

function generateSuperAdminToken() {
  const SECRET_KEY = process.env.AUTH_SECRET || 'super-secret-adhub-jwt-key-2026';
  const data = JSON.stringify({
    id: 'user-super-admin-001',
    name: 'Sahithya Voleti (Super Admin)',
    email: 'sahithyalakshmivoleti@gmail.com',
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  return Buffer.from(`${data}.${signature}`).toString('base64');
}

async function testHttpFlow() {
  console.log('--- Testing Real HTTP Registration & Super Admin Dashboard Synchronization ---');

  const superAdminToken = generateSuperAdminToken();

  // 1. Submit Admin Registration
  const timestamp = Date.now();
  const testEmail = `dr.varun.${timestamp}@vignan.ac.in`;
  const testStaffId = `FAC-CSE-${timestamp.toString().slice(-4)}`;
  const regRes = await fetch('http://localhost:4028/api/auth/register-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr. M. Varun Kumar',
      email: testEmail,
      phone: '+91 9876543211',
      staffId: testStaffId,
      department: 'Computer Science & Engineering',
      designation: 'Faculty Coordinator',
      password: 'VarunPassword@2026',
      confirmPassword: 'VarunPassword@2026',
    }),
  });

  const regData = await regRes.json();
  console.log('1. Registration API Result:', regData);

  if (!regData.success) {
    throw new Error(`Registration failed: ${regData.error || regData.message}`);
  }

  // 2. Super Admin fetches Dashboard Admins List
  const fetchRes = await fetch('http://localhost:4028/api/super-admin/admins', {
    headers: { Authorization: `Bearer ${superAdminToken}` },
  });

  const fetchJson = await fetchRes.json();
  console.log('2. Super Admin Dashboard Fetch Success:', fetchJson.success);

  const pendingList = (fetchJson.admins || []).filter(
    u => u.role === 'ADMIN' && (u.status === 'PENDING' || u.status === 'PENDING_APPROVAL' || u.status === 'PENDING_OTP')
  );

  console.log('3. Pending Admin Accounts Count in Database:', pendingList.length);
  const foundUser = pendingList.find(u => u.email.toLowerCase() === testEmail.toLowerCase());

  if (foundUser) {
    console.log('✔ Registered Admin Found in Dashboard Pending List!');
    console.log('   ID:', foundUser.id);
    console.log('   Name:', foundUser.name);
    console.log('   Email:', foundUser.email);
    console.log('   Staff ID:', foundUser.staffId);
    console.log('   Department:', foundUser.department);
    console.log('   Status:', foundUser.status);
  } else {
    throw new Error('Registered Admin NOT found in pending list!');
  }

  // 3. Super Admin approves Admin from Dashboard API
  const approveRes = await fetch(`http://localhost:4028/api/super-admin/admins/${encodeURIComponent(foundUser.id)}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${superAdminToken}` },
  });
  const approveJson = await approveRes.json();
  console.log('4. Dashboard Approval Action Result:', approveJson);

  // 4. Verify updated status in Dashboard List
  const fetchRes2 = await fetch('http://localhost:4028/api/super-admin/admins', {
    headers: { Authorization: `Bearer ${superAdminToken}` },
  });
  const fetchJson2 = await fetchRes2.json();

  const approvedUser = (fetchJson2.admins || []).find(u => u.id === foundUser.id);
  console.log('5. Status after Approval:', approvedUser?.status);

  if (approvedUser?.status === 'APPROVED') {
    console.log('✔ END-TO-END HTTP REGISTRATION & APPROVAL SYNC VERIFIED PERFECTLY!');
  } else {
    throw new Error('Status was not updated to APPROVED!');
  }
}

testHttpFlow().catch(err => {
  console.error('✖ HTTP Test Failed:', err.message);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');

const constantsContent = fs.readFileSync(path.join(__dirname, '../src/lib/constants.ts'), 'utf8');

// Extract SUPER_ADMIN_EMAILS array from file content
const emailsMatch = constantsContent.match(/SUPER_ADMIN_EMAILS: readonly string\[\] = \[([\s\S]*?)\]/);
let emails = [];
if (emailsMatch && emailsMatch[1]) {
  emails = emailsMatch[1]
    .split(',')
    .map(s => s.replace(/['"\s]/g, ''))
    .filter(Boolean);
}

function isSuperAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  return emails.includes(clean);
}

console.log('====================================================');
console.log('      SUPER ADMIN AUTHORIZATION VERIFICATION        ');
console.log('====================================================\n');

console.log('Configured Central SUPER_ADMIN_EMAILS:');
console.log(emails);
console.log('');

// Test Case A: sahithyalakshmivoleti@gmail.com
const caseA = 'sahithyalakshmivoleti@gmail.com';
console.log(`Case A [${caseA}]:`, isSuperAdminEmail(caseA) ? 'PASS (SUPER_ADMIN)' : 'FAIL');

// Test Case B: uvr_cse@vignan.ac.in
const caseB = 'uvr_cse@vignan.ac.in';
console.log(`Case B [${caseB}]:`, isSuperAdminEmail(caseB) ? 'PASS (SUPER_ADMIN)' : 'FAIL');

// Test Case C: deepakchowdaryedara@gmail.com
const caseC = 'deepakchowdaryedara@gmail.com';
console.log(`Case C [${caseC}]:`, isSuperAdminEmail(caseC) ? 'PASS (SUPER_ADMIN)' : 'FAIL');

// Test Case D: sahithyavoleti14@gmail.com (NOT Super Admin)
const caseD = 'sahithyavoleti14@gmail.com';
console.log(`Case D [${caseD}]:`, !isSuperAdminEmail(caseD) ? 'PASS (NOT SUPER_ADMIN)' : 'FAIL');

// Test Case E: Verify EXACT count of Super Admins is 3
console.log('\nChecking Super Admin List Count...');
console.log(`Total Super Admins: ${emails.length}`);
if (emails.length === 3) {
  console.log('PASS: Exactly 3 Super Admins configured.');
} else {
  console.log('FAIL: Expected 3 Super Admins.');
}

console.log('\n====================================================');

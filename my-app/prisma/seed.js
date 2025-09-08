// /prisma/seed.js

const { PrismaClient, Resource } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // --- 1. Define and Create the Super Admin Role ---
  // We use `upsert` to avoid creating duplicate roles on subsequent seed runs.
  console.log('Creating Super Admin role...');
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {}, // No updates needed if it already exists
    create: {
      name: 'Super Admin',
      description: 'Has unrestricted access to the entire system.',
    },
  });
  console.log(`✅ Super Admin role created/found with ID: ${superAdminRole.id}`);

  // --- 2. Grant Full Permissions to the Super Admin Role ---
  // Loop through every resource defined in the enum and grant full permissions.
  console.log('Granting all permissions to Super Admin role...');
  const allResources = Object.values(Resource); // Gets all enum values as an array

  for (const resource of allResources) {
    await prisma.rolePermission.upsert({
      where: {
        // This unique identifier is based on the @@unique([roleId, resource]) in your schema
        roleId_resource: {
          roleId: superAdminRole.id,
          resource: resource,
        },
      },
      update: {
        // Ensure permissions are always true if the seed is re-run
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        canApprove: true,
      },
      create: {
        roleId: superAdminRole.id,
        resource: resource,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        canApprove: true,
      },
    });
    console.log(`   - Granted full access to ${resource}`);
  }
  console.log('✅ All permissions granted.');

  // --- 3. Create the Super Admin User ---
  // Ensure you have set these environment variables in your .env file
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      '❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file.'
    );
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  console.log(`Creating Super Admin user with email: ${adminEmail}...`);
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      roleId: superAdminRole.id, // Ensure the user is always linked to the super admin role
    },
    create: {
      name: 'Administrator',
      email: adminEmail,
      password: hashedPassword,
      roleId: superAdminRole.id,
    },
  });
  console.log(`✅ Super Admin user created/found with ID: ${adminUser.id}`);

  console.log('🌱 Seed process finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma Client connection
    await prisma.$disconnect();
  });
#!/usr/bin/env node

/**
 * QuietoraLabs Admin Operator Setup & Confirmation Script
 *
 * This script confirms the operator's email in auth.users and assigns the 'admin'
 * role in public.user_roles.
 *
 * Usage:
 *   node scripts/setup-admin.js operator@quietoralabs.com
 *   or with DATABASE_URL set in .env:
 *   npm run setup:admin
 */

import postgres from "postgres";

const targetEmail = process.argv[2] || "operator@quietoralabs.com";
const dbUrl = process.env.DATABASE_URL;

console.log("==================================================");
console.log("       QuietoraLabs Operator Account Setup        ");
console.log("==================================================");
console.log(`Target Email: ${targetEmail}\n`);

if (!dbUrl) {
  console.log("No DATABASE_URL set in your environment.");
  console.log("To confirm this account and grant the admin role, run this SQL in your database:\n");
  console.log("--------------------------------------------------");
  console.log(`-- 1. Confirm the email in Supabase auth:`);
  console.log(`UPDATE auth.users`);
  console.log(`SET email_confirmed_at = COALESCE(email_confirmed_at, now())`);
  console.log(`WHERE email = '${targetEmail}';\n`);
  console.log(`-- 2. Assign the admin role in user_roles:`);
  console.log(`INSERT INTO public.user_roles (user_id, role)`);
  console.log(`SELECT id, 'admin'::public.app_role`);
  console.log(`FROM auth.users`);
  console.log(`WHERE email = '${targetEmail}'`);
  console.log(`ON CONFLICT (user_id, role) DO NOTHING;`);
  console.log("--------------------------------------------------\n");
  process.exit(0);
}

async function run() {
  const sql = postgres(dbUrl);
  try {
    console.log(`Connecting to database...`);

    // 1. Confirm email
    const confirmRes = await sql`
      UPDATE auth.users
      SET email_confirmed_at = COALESCE(email_confirmed_at, now())
      WHERE email = ${targetEmail}
      RETURNING id, email, email_confirmed_at;
    `;

    if (confirmRes.length === 0) {
      console.log(`⚠️ User with email '${targetEmail}' was not found in auth.users.`);
      console.log(`Please register this email on http://localhost:8080/admin first, then run this script.`);
      process.exit(1);
    }

    const userId = confirmRes[0].id;
    console.log(`✓ Email confirmed for User ID: ${userId}`);

    // 2. Grant admin role
    await sql`
      INSERT INTO public.user_roles (user_id, role)
      VALUES (${userId}, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    `;
    console.log(`✓ Admin role granted to: ${targetEmail} (${userId})`);
    console.log(`\n🎉 Success! You can now log in at http://localhost:8080/admin`);
  } catch (err) {
    console.error("Setup error:", err.message);
  } finally {
    await sql.end();
  }
}

run();

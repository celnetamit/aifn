import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const emails = ['amit.rai@celnet.in', 'puneet.mehrotra@celnet.in'];
  
  for (const email of emails) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      await prisma.user.update({
        where: { email },
        data: { role: 'admin' }
      });
      console.log(`Updated existing user to admin: ${email}`);
    } else {
      // Need to create them if they don't exist
      // Using a dummy password since they will likely use Google Auth
      await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0], // Placeholder name
          role: 'admin',
          passwordHash: 'SOCIAL_LOGIN_ONLY_' + Math.random().toString(36).substring(7),
          preferredLocale: 'en'
        }
      });
      console.log(`Created new admin user: ${email}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

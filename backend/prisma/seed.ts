import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

declare const process: {
  exit(code?: number): never;
};

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@restaupilot.com';
  const adminPassword = 'Admin123!';

  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'RestauPilot',
        role: Role.ADMIN,
      },
    });

    console.log('✅ Utilisateur admin créé avec succès');
  } else {
    console.log('ℹ️ L\'utilisateur admin existe déjà');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la création de l\'admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
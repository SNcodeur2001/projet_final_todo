# TODO - Project Setup and Seeder Implementation

## Completed Tasks

- [x] Create root README.md with project overview, setup instructions for frontend and backend, usage guide, and API details.
- [x] Update prisma/schema.prisma to add seed generator configuration.
- [x] Create prisma/seed.ts with sample data seeding logic (admin user, 2 regular users, 3 tasks with permissions and action history).
- [x] Update tsconfig.json to exclude prisma/ directory from compilation and add ignoreDeprecations.
- [x] Update package.json to add "db:seed" script for running the seeder.

## Next Steps (for user to verify)

- [ ] In backend directory (`projet_yallah_bakhna/`), run `npm run db:migrate` to apply database schema.
- [ ] Run `npm run db:seed` to populate the database with sample data.
- [ ] Start backend with `npm run dev` (runs on localhost:3000).
- [ ] In frontend directory (`yallah-bakhna-frontend/`), run `npm run dev` (runs on localhost:5173).
- [ ] Test login with seeded admin: admin@example.com / admin123.
- [ ] Verify tasks, permissions, and history are populated.

#!/bin/bash

# Initialize Database for AI for Nurses India
echo "🚀 Starting PostgreSQL via Docker..."
docker-compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "🛠️ Generating Prisma Client..."
npx prisma generate

echo "📤 Pushing schema to database..."
npx prisma db push

echo "🌱 Seeding initial data (Packages, Tracks, etc.)..."
npx prisma db seed

echo "✅ Database is ready!"

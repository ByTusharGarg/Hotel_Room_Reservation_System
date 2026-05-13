# Hotel Room Reservation System

A full-stack web application built with **Next.js**, **Sequelize**, and **PostgreSQL** to dynamically optimize and manage room reservations for a 10-floor hotel. 

## Features
- **Visual Dashboard**: A 10-floor dynamic grid highlighting available, occupied, and recently booked rooms.
- **Dynamic Booking**: Book between 1 and 5 rooms at a time. The system calculates and assigns rooms using an algorithm that strictly minimizes walking travel time across floors and hallways.
- **Random Occupancy Generator**: Easily populate the hotel with simulated guests to test the system's travel-time optimization algorithm under constrained conditions.
- **Global Reset**: Instantly reset all 97 rooms back to available status.

## Travel Time Rules & Optimization
As per the requirement constraints, the reservation algorithm follows these rules:
1. Moving horizontally on the same floor takes 1 minute per room.
2. The lift is located on the left.
3. Moving vertically takes 2 minutes per floor.
4. **Primary Priority**: Group rooms on the same floor closest to each other.
5. **Secondary Priority**: When a booking spans multiple floors, the system determines all possible room permutations and selects the subset that minimizes the *bounding travel time* (the time taken to route from the lowest-indexed room to the highest-indexed room).
6. **Tie-Breaking**: If multiple multi-floor subsets result in the exact same bounding time, the system will select the subset that minimizes the *sequential walk-through time*.

## Technology Stack
- **Frontend**: Next.js App Router, React, Tailwind CSS.
- **Backend**: Next.js API Routes.
- **Database**: PostgreSQL integrated with Sequelize ORM.

## Local Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory and add your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgres://user:password@localhost:5432/hotel"
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **View the Application**
   Open your browser to [http://localhost:3000](http://localhost:3000). The database tables will automatically initialize and seed the 97 rooms upon the first API request.

## Live Deployment
This project is Next.js-ready and can be directly deployed to services like Vercel or Netlify.
The Sequelize configuration expects a `DATABASE_URL` environment variable and is pre-configured to use `ssl: { require: true, rejectUnauthorized: false }` when running in a production environment, which ensures compatibility with hosted database providers like Vercel Postgres, Supabase, or AWS RDS.

# Hotel Room Reservation System

A full-stack web application built with **Next.js**, **Sequelize**, and **SQLite** to dynamically optimize and manage room reservations for a 10-floor hotel. 

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
- **Database**: SQLite integrated with Sequelize ORM. (Self-contained, no external database server required).

## Local Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Development Server**
   ```bash
   npm run dev
   ```

3. **View the Application**
   Open your browser to [http://localhost:3000](http://localhost:3000). The database (`hotel.sqlite`) will automatically initialize and seed the 97 rooms upon the first API request.

## Live Deployment
This project is Next.js-ready and can be directly deployed to services like Vercel or Netlify.
Since SQLite operates as a local file, ensure your deployment environment persists the `.sqlite` file, or consider swapping the Sequelize dialect to Postgres if deploying on a serverless platform without persistent block storage.

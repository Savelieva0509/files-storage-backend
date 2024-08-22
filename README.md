# Files Storage Backend

This repository contains the backend for a file storage service that allows users to upload, list, and retrieve files using Supabase for storage and MongoDB for metadata storage.

# Features

- Upload files to Supabase storage
- List all uploaded files
- Validate file size (1KB - 7GB)
- Pagination
- Error loading file if it already exists in the database


### Prerequisites

Make sure you have the following software installed on your machine:

- Node.js 
- Express.js
- MongoDB, Compass
- Supabase account

### Installation

1. Clone this repository to your local machine.
2. Install dependencies using npm install.
3. Create a `.env` file in the root directory and provide the following environment variables (PORT, DB_HOST)
4. To start the backend server, run the following command:
- `npm start` &mdash; server start in production mode
- `npm run start:dev` &mdash; server start in development mode

The server will start running on port 3001 by default. You can change the port by modifying the `PORT` variable in the `.env` file.

### API Endpoints

- BASE_URL: https://files-storage-backend.onrender.com
- BASE LINK: mongodb+srv://savelieva0509:W5SEVhhJ3axtppS9@atlascluster.aapbtpy.mongodb.net/files_reader?retryWrites=true&w=majority&appName=AtlasCluster

The following API endpoints are available:

- `GET /api/files`: Get all files
- `POST /api/files`: Create a new file
- `PATCH /api/files/:id`: Update download counter


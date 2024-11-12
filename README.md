# Agile Management System

A web-based project management system designed to facilitate Agile methodology for student projects, featuring sprint planning, task management, and collaboration tools. This tool aims to enhance project tracking, learning, and collaboration within software engineering courses.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tools & Technologies](#tools--technologies)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
The **Agile Management System** is intended to provide a platform for students to manage projects using Agile principles. It benefits:
- **Mmebers**: Works on tasks, sprints, and projects.
- **Project Manager**: Oversee project progress and adherence to Agile practices.
- **Scrum Master**: Manages tasks,creates sprints, permissions, and configurations.

The system employs Agile development for its iterative approach, flexibility, continuous feedback, risk management, and faster delivery of functional parts.

## Features
- **User Management**: Register, authenticate, and manage user roles (member, project manager, scrum master).
- **Project Management**: Create and manage multiple projects with task assignments and sprint planning.
- **Collaboration Tools**: Message boards and discussions for team communication.
- **Sprint Boards**: Visual progress tracking for Agile sprints.
- **Recommendations**: Automated work breakdown and sprint planning suggestions.

## Tools & Technologies
- **Backend**: Node.js
- **Frontend**: React.js
- **Database**: MySQL
- **Development Tools**: Visual Studio Code, GitHub for version control

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Miku7676/Agile_Management_System.git
   cd Agile_Management_System
2. **Install Dependencies**:
   ```bash
     npm install
3. **Environment Setup:**:
       Configure environment variables in a .env file with database credentials, API keys, etc.
4. **Database Setup:**:
     - Ensure the database is running and configured with necessary schemas.
     - Run migration scripts if applicable.

## Running The Application

To start the backend and frontend, follow these steps:

**Run the Backend**: Navigate to the backend directory and use nodemon to run the server.
    Copy code
    ```bash
    cd backend
    nodemon server.js

**Run the Frontend**: In a new terminal, navigate to the frontend directory and start the React application.
    
    Copy code
    ```bash
    cd frontend
    npm start
    
**Access the Application**:
- Backend should be running on the designated port (e.g., `http://localhost:5000`).
- Frontend can be accessed at `http://localhost:3000`.

## Usage
- **User Login**:
   Register or log in.
**Project and Task Management**: 
  Create projects, add tasks, and organize them into sprints.
**Tracking Progress**: 
  Use the sprint board to monitor task progression.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

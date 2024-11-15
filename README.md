# Agile Management System

A web-based project management system designed to facilitate Agile methodology for student projects, featuring sprint planning, task management, and collaboration tools. This tool aims to enhance project tracking, learning, and collaboration within software engineering courses.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tools & Technologies](#tools--technologies)
- [Contributing](#contributing)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
The **Agile Management System** is intended to provide a platform for students to manage projects using Agile principles. It benefits:
- **Members**: Works on tasks, sprints, and projects.
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

## Contributing

We welcome contributions to improve the Agile Management System! Whether it’s fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute
1. **Fork the Repository**:  
   Click the “Fork” button on the top right corner of the repository page to create your own copy of the repository.

2. **Clone Your Fork**:  
   Clone the forked repository to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Agile_Management_System.git
   ```
3. **Dependencies and Database setup**
   **Install Dependencies**:
   ```bash
     cd frontend && npm install
     cd ../backend && npm install
   ```
   **Environment Setup:** Configure environment variables in a .env file with database credentials, API keys, etc.  
   **Database Setup:**
      - Ensure the database is running and configured with necessary schemas.
      - Run migration scripts if applicable.
5. **Create a New Branch**:  
   Always create a new branch to work on a feature or fix:
   ```bash
   git checkout -b your-branch-name
   ```

6. **Make Changes**:  
   Implement your changes or improvements. Be sure to write clear and concise commit messages.

7. **Run Tests** (If Applicable):  
   If your change includes code, make sure to run any available tests to ensure everything works as expected.

8. **Commit Your Changes**:  
   Commit your changes with a meaningful message:
   ```bash
   git commit -am 'Add new feature or fix bug'
   ```

9. **Push Your Changes**:  
   Push the changes to your fork:
   ```bash
   git push origin your-branch-name
   ```

10. **Open a Pull Request**:  
   Go to the original repository and open a pull request (PR) from your branch. In your PR description, explain the changes and why they are needed.
## Running The Application

To start the backend and frontend, follow these steps:

**Run the Backend**: Navigate to the backend directory and use nodemon to run the server.
 ```bash
 cd backend
 nodemon server.js
 ```
**Run the Frontend**: In a new terminal, navigate to the frontend directory and start the React application.
 ```bash
 cd frontend
 npm start
 ```
    
**Access the Application**:
- Backend should be running on the designated port (e.g., `http://localhost:5000`).
- Frontend can be accessed at `http://localhost:3000`.

## Reporting Issues
If you encounter any bugs or have suggestions for improvements, please feel free to [open an issue](https://github.com/Miku7676/Agile_Management_System/issues).

## Usage
- **User Login**: Register or log in.
- **Project and Task Management**: Create projects, add tasks, and organize them into sprints.  
- **Tracking Progress**: Use the sprint board to monitor task progression.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.




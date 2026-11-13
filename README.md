# QA Test Manager

## About the Project

I built this project to understand how a real-world web application works behind the user interface, particularly how the frontend, backend, and database communicate with each other.

As I was learning software testing and automation, I wanted to go beyond testing individual APIs and web applications. I wanted to understand what happens behind the scenes when a user performs an action, how that action reaches the backend, how data is processed, and how the results are stored.

This project gave me an opportunity to explore those concepts by building a simple QA Test Case Manager and running its components using Docker.

## What Does It Do?

QA Test Manager is a simple web application for managing software test cases.

Users can:

- Create and manage test cases.
- Update test case details and execution status.
- Assign priorities to test cases.
- Search and filter test cases.
- View dashboard statistics for test execution.

The application stores test case information in a PostgreSQL database rather than relying on browser storage.

## What I Wanted to Learn

The main objective wasn't just to build another CRUD application. It was to understand the infrastructure and communication behind it.

Through this project, I explored:

**1. Frontend and Backend Communication**

- How a frontend sends HTTP requests to a backend.
- How REST API endpoints handle GET, POST, PUT, and DELETE requests.
- How the backend processes requests and returns responses.

**2. Database Integration**

- How a backend connects to PostgreSQL.
- How application data is inserted, retrieved, updated, and deleted.
- Why persistent database storage matters.

**3. Docker and Containerization**

- What Docker images and containers are.
- How to write Dockerfiles for different application components.
- How Docker Compose manages multiple services.
- How containers communicate through an internal network.

**4. Infrastructure and Deployment Concepts**

- How port mapping makes containerized services accessible from a host machine.
- How environment variables configure application services.
- How Docker volumes preserve database data.
- How database initialization scripts automate the initial setup.

## Technologies Used

- HTML, CSS, JavaScript
- Node.js and Express.js
- PostgreSQL
- Docker and Docker Compose
- Nginx
- REST API

## What I Learned

Building this project helped me understand that an application is more than the code running in its frontend.

I gained practical experience connecting multiple services, troubleshooting communication issues, managing persistent data, and containerizing an application.

I also learned that getting an application to run locally is only one part of the process. Making it portable, secure, and accessible to other users introduces additional infrastructure and deployment considerations.

## Current Status

The application currently runs locally using Docker Compose. Database initialization has been automated and tested using a fresh PostgreSQL volume.

Further improvements, including deployment and security configuration, are planned as part of my continued learning.
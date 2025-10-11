## PlayPal
This repository contains the source code for a PlayPal - a progressive web application (PWA) built with a microservice architecture. The goal is to create a scalable and maintainable application by separating concerns into independent services.

This README serves as a guide for setting up the project, running the services, and effectively using the Gemini code assistant to accelerate development.

### 🚀 Tech Stack
- Frontend: Next.js (React Framework)

- Backend Microservices: Nest.js (Node.js Framework)

- Database: (To be decided: PostgreSQL, MongoDB, etc.)

- Communication: (To be decided: REST APIs, gRPC, RabbitMQ)

- Containerization: Docker

### Architecture
The application follows a microservice architecture, where each service is responsible for a specific domain or functionality. The image shows the architecture used for PlayPal:

![Architecture Diagram](./docs/img/playpal_poc_architecture.png)

In RED is everything provided by Exoscale. BLUE is for SaaS Services used. YELLOW are all self deployed 3rd party services.

### 📂 Project Structure
The project is organized into a monorepo structure, with each microservice and the frontend application residing in its own subdirectory.
```
/
├── frontend/             # Next.js PWA Frontend
├── services/
│   ├── user-service/     # Handles user authentication, profiles, etc.
│   ├── matching-service/ # Handles the core matching logic.
│   ├── notification-service/ # Manages push notifications, emails, etc.
│   └── ...               # Future microservices will be added here
├── docker-compose.yml    # For orchestrating all services
└── README.md             # You are here!
```

### 📋 Prerequisites
Before you begin, ensure you have the following installed on your local machine:

- Node.js (v18 or later recommended)

- pnpm (or npm/yarn)

- Docker and Docker Compose

### ⚙️ Getting Started
Clone the repository:

```
git clone <your-repository-url>
cd <your-repository-name>
```

Install dependencies for all services:
Navigate into each service's directory and run the installation command.

Frontend:
```
cd frontend
pnpm install
cd ..
```

User Service:
```
cd services/user-service
pnpm install
cd ../..
```

(Repeat for matching-service, notification-service, etc.)

▶️ Running the Application
You can run each service individually or use Docker Compose to launch the entire stack.

Method 1: Running Services Individually (for development)
Open multiple terminal tabs, one for each service you want to run.

**Run Frontend:**
```
cd frontend
pnpm dev
```

The frontend will be available at http://localhost:3000.

**Run a Backend Microservice (e.g., user-service):**

```
cd services/user-service
pnpm start:dev
```

The user-service will be available at http://localhost:3001 (or its configured port).

Method 2: Using Docker Compose (for a production-like environment)
From the root directory, run:

```
docker-compose up --build
````

This command will build Docker images for each service and start them as containers.

### 🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature-name).

Make your changes.

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/your-feature-name).

Open a pull request.

### 📄 License
This project is licensed under the MIT License.
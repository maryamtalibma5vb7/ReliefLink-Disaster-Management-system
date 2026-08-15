# 🚨 Relief Link – Disaster Management System

## 📌 Introduction

**Relief Link** is a comprehensive disaster management system designed to improve the efficiency, security, and coordination of emergency response operations. The system provides a centralized platform for managing disasters, emergency resources, shelters, food supplies, ambulances, resource allocation, reporting, and analytics.

The main purpose of Relief Link is to replace slow and manual disaster management processes with a **secure, automated, and real-time digital solution**. It enables authorized users to manage disaster information, monitor available resources, allocate resources efficiently, and generate reports for better decision-making.

The system follows a modern full-stack architecture using **React.js, Node.js, Express.js, and Microsoft SQL Server**, with JWT-based authentication and role-based access control.

---

## 🎯 Problem Statement

Traditional disaster management systems often rely on manual processes for resource allocation, reporting, and emergency coordination. These approaches can result in:

* Delayed resource allocation
* Poor resource tracking
* Manual data entry and reporting
* Limited visibility of emergency resources
* Security and access-control issues
* Difficulty monitoring disaster response activities

**Relief Link** addresses these challenges by providing an integrated platform for real-time resource management, automated allocation, reporting, analytics, and activity tracking.

---

## 🔍 Existing Systems vs Relief Link

| Feature             | Existing Systems | Relief Link |
| ------------------- | ---------------- | ----------- |
| Manual Allocation   | Yes              | No          |
| Real-Time Dashboard | Limited          | Yes         |
| Role-Based Login    | Limited          | Yes         |
| Automated Reports   | No               | Yes         |
| Resource Tracking   | Partial          | Complete    |
| Activity Logging    | Limited          | Yes         |
| Analytics           | Limited          | Yes         |

---

## 🎯 Objectives and Goals

The main objectives of Relief Link are to:

* Manage disaster information efficiently
* Track emergency resources in real time
* Automate resource allocation
* Provide secure authentication and authorization
* Monitor ambulances, shelters, and food supplies
* Maintain allocation history
* Generate reports and analytics
* Maintain activity logs for auditing
* Improve emergency response and decision-making

---

## 📦 Project Scope

The system covers the following major areas:

* Disaster Management
* Ambulance Management
* Shelter Management
* Food Supply Tracking
* Emergency Resource Allocation
* Dashboard Analytics
* Reporting
* User Authentication
* Activity Logging

---

## 🏗️ System Architecture (ERD Daigram)

<img width="582" height="774" alt="image" src="https://github.com/user-attachments/assets/4e491e77-65b5-4304-9747-0adae66e9ca5" />

---

# 💻 Frontend Architecture

The frontend of Relief Link is developed using **React.js and Bootstrap 5**. It provides a responsive and user-friendly interface for managing disaster response operations.

### Main Components

* **Dashboard** – Displays statistics, charts, and resource information.
* **Disaster Module** – Handles disaster CRUD operations.
* **Resource Module** – Manages ambulances, food supplies, and shelters.
* **Allocation Module** – Allows users to allocate resources to disasters.
* **Reports Module** – Generates reports and exportable files.
* **Authentication Module** – Handles login and signup functionality.

### Frontend Features

* Single Page Application (SPA)
* Responsive User Interface
* Role-Based Interface
* Axios API Communication
* Recharts Data Visualization
* CRUD Operations
* Dashboard Analytics
* Report Export

---

# ⚙️ Backend Architecture

The backend is developed using **Node.js and Express.js** and follows a REST API architecture.

### Main Responsibilities

* Handle API requests and responses
* Process business logic
* Manage authentication and authorization
* Communicate with SQL Server
* Perform CRUD operations
* Manage resource allocation
* Generate reporting data
* Handle application errors

### Backend Modules

```text
authController
       │
       ├── Login
       └── Signup

disasterController
       │
       └── Disaster Management

resourceController
       │
       └── Resource Management

allocationController
       │
       └── Resource Allocation

reportController
       │
       └── Dashboard & Reports
```

### Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Protected Routes
* Role-Based Authorization
* Error Handling Middleware

---

# 🗄️ Database Architecture

Relief Link uses **Microsoft SQL Server** as its relational database management system.

### Main Database Tables

* `Users`
* `Disasters`
* `DisasterTypes`
* `Ambulances`
* `FoodSupplies`
* `Shelters`
* `Allocations`
* `ActivityLogs`

### Database Features

* Primary Keys
* Foreign Keys
* Constraints
* Relationships
* Stored Procedures
* Views
* Triggers
* Functions
* Indexes

### Important SQL Components

| SQL Component                | Purpose                                  |
| ---------------------------- | ---------------------------------------- |
| `sp_AllocateReliefResources` | Handles resource allocation transactions |
| `vw_DashboardStats`          | Provides dashboard analytics             |
| `vw_AllocationReport`        | Provides reporting data                  |
| Triggers                     | Automate database actions                |
| Functions                    | Perform reusable database calculations   |
| Indexes                      | Improve query performance                |

---

# 🔄 System Workflow

### Step 1 – User Authentication

The user logs into the system using their email and password. The backend verifies the credentials and generates a JWT token for authenticated access.

### Step 2 – Disaster Management

Authorized users can add, update, view, and delete disaster records through the frontend interface.

### Step 3 – Resource Management

The system maintains information about:

* Ambulances
* Food Supplies
* Shelters

Resource availability and status can be monitored through the system.

### Step 4 – Resource Allocation

Users allocate available resources to specific disasters. The backend communicates with SQL Server stored procedures to:

* Check resource availability
* Deduct available inventory
* Update resource status
* Create allocation records
* Maintain allocation history

### Step 5 – Dashboard & Reporting

The frontend retrieves analytical information from SQL views and APIs. The information is presented through:

* Charts
* Statistics
* Tables
* Reports
* Exportable files

### Step 6 – Activity Logging

Important system activities are recorded in the `ActivityLogs` table for monitoring, auditing, and accountability.

---

# 🛠️ Tools and Technologies

| Category          | Technology                                   |
| ----------------- | -------------------------------------------- |
| Frontend          | React.js, HTML, CSS, Bootstrap 5, JavaScript |
| Backend           | Node.js, Express.js                          |
| Database          | Microsoft SQL Server                         |
| Authentication    | JWT, bcrypt                                  |
| API Communication | Axios                                        |
| Charts            | Recharts                                     |
| Reporting         | jsPDF, XLSX                                  |
| Architecture      | REST API                                     |

---

# ✨ Project Features

## Functional Requirements

* User Login and Signup
* Role-Based Authentication
* Disaster CRUD Operations
* Resource Management
* Resource Allocation
* Dashboard Analytics
* Automated Reporting
* Report Export
* Activity Logging
* Database Management

## Non-Functional Requirements

* Security
* Performance
* Scalability
* Reliability
* Maintainability
* Responsive UI
* Data Integrity

---

# 🧠 Implemented Concepts

The project demonstrates practical implementation of several software development concepts:

* React Components
* Single Page Application
* REST APIs
* CRUD Operations
* JWT Authentication
* Password Hashing
* Role-Based Authorization
* SQL Stored Procedures
* SQL Views
* SQL Triggers
* SQL Functions
* Database Relationships
* Primary and Foreign Keys
* Transaction Management
* Activity Logging
* Data Visualization
* Report Generation

---

# 📸 Output

## 🔐 Login

<img width="624" height="307" alt="image" src="https://github.com/user-attachments/assets/09cc4cfb-117f-4863-a8df-aead5892c5ce" />

## 📝 Signup

<img width="612" height="282" alt="image" src="https://github.com/user-attachments/assets/b3e1726a-9ec1-4560-9484-08ac2e4e5dac" />

<img width="344" height="201" alt="image" src="https://github.com/user-attachments/assets/1516eb01-55e5-4656-b3b5-5ab43bf17a23" />

## 📊 Dashboard

<img width="624" height="295" alt="image" src="https://github.com/user-attachments/assets/c404e4b5-f22f-4f21-bd45-5306ae68771c" />

## 🚨 Disasters

<img width="624" height="297" alt="image" src="https://github.com/user-attachments/assets/e824693c-070d-47cc-bddd-0761729ba45a" />

## 🚑 Resources

<img width="612" height="205" alt="image" src="https://github.com/user-attachments/assets/78873c5d-44bf-4f4c-94a4-d451b9b2ac10" />

## 📦 Allocation

<img width="624" height="289" alt="image" src="https://github.com/user-attachments/assets/707324ff-2cc9-4e67-9bd4-0518e70e3acc" />

## 📑 Reports

<img width="612" height="282" alt="image" src="https://github.com/user-attachments/assets/521a8482-70b8-45bd-a06e-2ce0e526bfbc" />

# 🗃️ Database 

## Users

<img width="624" height="153" alt="image" src="https://github.com/user-attachments/assets/3eea95a7-26b8-420e-ac4b-dc5a3861a692" />


## Allocations

<img width="624" height="114" alt="image" src="https://github.com/user-attachments/assets/07cb3e22-9d9a-454a-852a-0cc6ce0e31f7" />


## Activity Logs

<img width="534" height="205" alt="image" src="https://github.com/user-attachments/assets/3e32d12b-a754-416a-84f6-db5eaba18120" />


## Ambulances


<img width="625" height="189" alt="image" src="https://github.com/user-attachments/assets/4f575b21-fc40-44c2-8dee-e40e17aa04e5" />


## Disasters

<img width="624" height="149" alt="image" src="https://github.com/user-attachments/assets/16036c2b-6b44-43da-8868-fe8b3b916d5e" />


## Disaster Types

<img width="506" height="244" alt="image" src="https://github.com/user-attachments/assets/773f78a6-874e-403c-8a58-24b97783964f" />

## Food Supplies

<img width="625" height="181" alt="image" src="https://github.com/user-attachments/assets/26f9151b-2edc-4e23-ad60-5da9e97e76fc" />


## Shelters
<img width="625" height="157" alt="image" src="https://github.com/user-attachments/assets/709763e5-e8cc-4255-b938-fffb166e68cd" />

# 🔌 Database Connection
The backend connects to **Microsoft SQL Server** to store and retrieve application data.
<img width="626" height="101" alt="image" src="https://github.com/user-attachments/assets/17dab1e9-bab7-400f-8de4-547d959c4bd4" />

The database connection is used for:

* User authentication
* Disaster management
* Resource management
* Resource allocation
* Dashboard analytics
* Reporting
* Activity logging

> **Security Note:** Database credentials and JWT secrets should be stored in environment variables and should **never be committed to GitHub**.

Example:

```env
DB_SERVER=your_server
DB_DATABASE=your_database
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_secret
```

---

# 📁 Suggested Project Structure

```text
Relief-Link/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── disasterController.js
│   │   ├── resourceController.js
│   │   ├── allocationController.js
│   │   └── reportController.js
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── database/
│   ├── tables/
│   ├── procedures/
│   ├── views/
│   ├── triggers/
│   └── functions/
│
├── screenshots/
│
└── README.md
```

---

# 🚀 Future Work

Future improvements for Relief Link may include:

* 📱 Mobile Application Support
* 🤖 AI-Based Disaster Prediction
* 📍 GPS-Based Live Resource Tracking
* ☁️ Cloud Deployment
* 📧 SMS and Email Notifications
* 🛰️ Real-Time Emergency Monitoring
* 🗺️ Interactive Disaster Maps
* 📊 Advanced Predictive Analytics

---

# ✅ Conclusion

**Relief Link** provides a secure, centralized, and efficient solution for disaster management and emergency resource coordination. By integrating React.js, Node.js, Express.js, and Microsoft SQL Server, the system simplifies disaster management, resource tracking, allocation, reporting, and analytics.

The implementation of **JWT authentication, role-based access, stored procedures, database views, triggers, REST APIs, and activity logging** makes the system more reliable, secure, and scalable. Relief Link can serve as a strong foundation for future disaster-response solutions with AI prediction, GPS tracking, cloud deployment, and mobile application support.

---

# 📚 References

1. Microsoft. **SQL Server Documentation**. Microsoft Learn.
2. React Documentation. Meta Platforms, Inc.
3. Node.js Documentation. OpenJS Foundation.
4. Express.js Documentation.
5. JSON Web Token (JWT) Documentation.
6. Bootstrap Documentation.
7. Recharts Documentation.
8. jsPDF Documentation.
9. SheetJS / XLSX Documentation.

---

## 👩‍💻 Project

**Relief Link – Disaster Management System**

**Technologies:** React.js | Node.js | Express.js | Microsoft SQL Server | JWT | Bootstrap | Recharts

> ⭐ If you find this project useful, consider giving the repository a star.

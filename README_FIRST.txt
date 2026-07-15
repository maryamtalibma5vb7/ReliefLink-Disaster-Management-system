ReliefLink - Disaster Management Resource Allocation DBMS
=========================================================

Project purpose:
ReliefLink is a full-stack database-driven website for allocating ambulances, food supplies and shelters during disaster situations such as floods, earthquakes, fires, heatwaves and cyclones.

Included modules:
1. Login and signup with JWT token support.
2. SQL Server database script with tables, relationships, constraints, views, stored procedure, function, trigger and indexes.
3. Dashboard with disaster/resource statistics and recent allocation report.
4. Disaster CRUD module.
5. Resource module for ambulances, food supplies and shelters.
6. Allocation module using stored procedure transaction logic.
7. Reports module using SQL Server views and activity logs.

Default login:
Email: admin@relieflink.com
Password: admin123

Database connection already set in backend/.env:
DB_SERVER="DESKTOP-1NHQSUD\\SQLEXPRESS01"
DB_NAME=ReliefLinkDB
PORT=5000
JWT_SECRET=ReliefLink@2026SecureKey#Aventen
DB_TRUSTED_CONNECTION=true

If your instance name contains a backslash, wrap it in quotes and escape it with a second backslash in backend/.env.
If Windows trusted authentication fails, create a SQL login and add DB_USER and DB_PASSWORD to backend/.env.

How to run:
1. Open SQL Server Management Studio.
2. Run database/ReliefLink_Database.sql completely.
3. Open terminal in backend folder and run:
   npm install
   npm start
4. Open another terminal in frontend folder and run:
   npm install
   npm start
5. Open http://localhost:3000

Important SQL Server note:
This backend uses Windows Authentication by default for your SQL Server Express instance. Install ODBC Driver 17 for SQL Server if it is not already installed. If Windows authentication does not work on your machine, create a SQL Server login and add DB_USER and DB_PASSWORD in backend/.env.

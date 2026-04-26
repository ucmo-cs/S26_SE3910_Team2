# Backend Setup and Run Guide

This guide explains how to run the backend in this repository with minimal setup.

## Prerequisites

Install these first:

- Java 17 (required by the backend Gradle build)
- MySQL 8+
- MySQL Workbench
- Git (optional, for cloning)

Verify Java:

```powershell
java -version
```

You should see Java 17 in the output.

## Backend Location

The Spring Boot backend lives in:

```text
backend
```

## 1) Configure MySQL

Create the database:

```sql
CREATE DATABASE appointment_setting;
```

### If you are using MySQL Workbench

1. Open MySQL Workbench and connect to your local MySQL server.
2. In the left panel under `SCHEMAS`, confirm `appointment_setting` exists.
3. If it does not exist, click `+` (Create a new schema), enter `appointment_setting`, and apply.
4. Keep the same username/password in Workbench and in `application.properties`.

The backend is currently configured in `backend/src/main/resources/application.properties` with:

- URL: `jdbc:mysql://localhost:3306/appointment_setting`
- Username: `root`
- Password: empty (you put your own password)

If your local credentials are different, update these values before running.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/appointment_setting
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

> **Note for Windows users:** If Java 17 and Java 21 are both installed, set JAVA_HOME before running:
>
> ```powershell
> $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
> $env:Path = "$env:JAVA_HOME\bin;" + [System.Environment]::GetEnvironmentVariable("Path","Machine")
> ```

## 2) Start the Backend

From the repository root, run:

### Windows (PowerShell)

```powershell
Set-Location .\backend
cmd /c gradlew.bat bootRun
```

### macOS/Linux

```bash
cd backend
./gradlew bootRun
```

Notes:

- The Gradle wrapper is included, so no global Gradle install is needed.
- First run may take longer while dependencies download.

## 3) Confirm It Is Running

By default, Spring Boot runs on port 8080.

Quick checks:

- Topics endpoint: `http://localhost:8080/api/topics`
- Branches by topic: `http://localhost:8080/api/branches?topicId=1`
- Availability: `http://localhost:8080/api/availability?branchId=1&date=2026-04-01`

You should receive JSON responses.

## What To Do Next (After Updating application.properties)

1. Save `application.properties`.
2. Start backend from `backend`:

```powershell
cmd /c gradlew.bat bootRun
```

3. Wait for startup to complete (Spring Boot started message).
4. Open `http://localhost:8080/api/topics` in your browser or Postman.
5. If JSON is returned, backend setup is complete.

## Seed Data Behavior

On startup, the backend seeds initial topics and branches if tables are empty. Because `spring.jpa.hibernate.ddl-auto=update` is enabled, tables are created/updated automatically.

## Common Issues

1. `Access is denied` when running `gradlew.bat`
	- Use `cmd /c gradlew.bat bootRun` from PowerShell.
2. MySQL connection failures
	- Confirm MySQL is running.
	- Confirm database `appointment_setting` exists.
	- Confirm username/password in `application.properties` are correct.
3. Port 8080 already in use
	- Stop the process using 8080 or set `server.port` in `application.properties`.

## Optional: Run Tests

From `backend`:

```powershell
cmd /c gradlew.bat test
```

or on macOS/Linux:

```bash
./gradlew test
```

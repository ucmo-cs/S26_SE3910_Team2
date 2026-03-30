# Backend Setup and Run Guide

This guide explains how to run the backend in this repository with minimal setup.

## Prerequisites

Install these first:

- Java 17 (required by the backend Gradle build)
- MySQL 8+
- Git (optional, for cloning)

Verify Java:

```powershell
java -version
```

You should see Java 17 in the output.

## Backend Location

The Spring Boot backend lives in:

```text
app/backend
```

## 1) Configure MySQL

Create the database:

```sql
CREATE DATABASE appointment_setting;
```

The backend is currently configured in `app/backend/src/main/resources/application.properties` with:

- URL: `jdbc:mysql://localhost:3306/appointment_setting`
- Username: `root`
- Password: empty

If your local credentials are different, update these values before running.

## 2) Start the Backend

From the repository root, run:

### Windows (PowerShell)

```powershell
Set-Location .\app\backend
cmd /c gradlew.bat bootRun
```

### macOS/Linux

```bash
cd app/backend
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

From `app/backend`:

```powershell
cmd /c gradlew.bat test
```

or on macOS/Linux:

```bash
./gradlew test
```

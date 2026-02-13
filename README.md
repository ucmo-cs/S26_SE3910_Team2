# S26_SE3910_Team2
**Bank Appointment Booking System**
Overview

This project is a full-stack web application that allows customers to schedule appointments with representatives at a local bank branch.

Users can select a reason for their visit, choose a branch that supports that service, pick an available 30-minute time slot, and confirm their booking. Once an appointment is scheduled, the system reserves the time slot and prevents double booking.

The application is built using Java and Spring Boot for the backend and ReactJS for the frontend. It follows a three-tier architecture with separate web, application, and database layers.

**Architecture**

This application follows a three-tier architecture:

Client (React Frontend)
  - Web Server (HTTP)
  - Application Server (Spring Boot REST API)
  - Database Server

Frontend
  - Built with ReactJS
  - Communicates with backend via REST APIs
  - Handles user interaction and appointment workflow

Backend
  - Built with Java and Spring Boot
  - RESTful API design
  - MVC architecture

Business logic and validation
  - JPA/Hibernate for database access

Database
  - MySQL (stores topics, branches, relationships, and appointments)

**Features**

1. Topic Selection
  Appointment reasons are stored in the database
  Users select a topic before proceeding
  
    Example topics: Loans, Credit Cards, Account Opening, Mortgage Consultation

2. Branch Filtering: Each branch supports specific topics, dynamic filtering based on selection, and the branch topic is sotred in database

3. Date and Time Selection: Time slots are 30 minutes long, only available (unbooked) slots are displayed, booking conflicts are prevented at the database level

4. Appointment Booking: Users enter name and email, appointment is saved to the database, selected time slot becomes unavailable, confirmation page is displayed

**Stretch Goals**
  Email confirmation after booking (Spring Boot Mail)
  Dynamic business hours by branch and day of week
  Appointment cancellation and rescheduling
  Admin dashboard

Tech Stack:
**Frontend**
ReactJS
Axios
HTML5 / CSS3

**Backend**
Java 17+
Spring Boot
Spring Web
Spring Data JPA
Hibernate
RESTful APIs
MVC architecture

**Database**
MySQL / PostgreSQL
H2 (development)

**Testing & Tools**
JUnit
Postman
Maven
Git

**API Endpoints**
Get Topics
GET /api/topics

**Get Branches by Topic**
GET /api/branches?topicId={id}

**Get Available Time Slots**
GET /api/appointments/available?branchId={id}&date=YYYY-MM-DD

**Create Appointment**
POST /api/appointments

Database Schema (Simplified)
Topic
id
name
description
Branch
id
name
address
Branch_Topic
branch_id
topic_id
Appointment
id
name
email
branch_id
topic_id
appointment_datetime
status
Business Rules



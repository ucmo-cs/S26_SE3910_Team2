# Bank Appointment Booking System

Overview
This project is a full-stack web application that allows customers to schedule appointments with representatives at commerce bank branch.

**Users can:**
  - Select a reason for their visit
  - Choose a branch that supports that service
  - Pick an available 30-minute time slot
  - Confirm their booking

Once an appointment is scheduled, the system reserves the time slot and prevents double booking.

The application is built using Java + Spring Boot for the backend and ReactJS for the frontend. It follows a three-tier architecture with separate web, application, and database layers.

## **Architecture:**
This application follows a three-tier architecture:
  - Client (React Frontend)
  - Web Server (HTTP Layer)
  - Application Server (Spring Boot REST API)

**Frontend:** Built with ReactJS, communicates with backend via REST APIs, handles user interaction and appointment workflow, performs client-side validation

**Backend:** Built with Java 17+ and Spring Boot, Implements RESTful API design, Uses MVC architecture, Handles business logic and validation, Uses JPA/Hibernate for database access

**Database:** MySQL store topics, branches, branch–topic relationships, appointments

## **Features:**
1. Topic Selection
   - Appointment reasons are stored in the database
   - Users must select a topic before proceeding
Example Topics: Loans, Credit Cards, Account Opening, Mortagage Consultation 

2. Branch Filtering
    - Each branch supports specific topics
    - Branch list is dynamically filtered based on selected topic
    - Branch-topic relationship is stored in the database

3. Date and Time Selection
    - Time slots are 30 minutes long
    - Only available (unbooked) slots are displayed
    - Booking conflicts are prevented at the database level

4. Appointment Booking
    - Users enter name and email
    - Appointment is saved to the database
    - Selected time slot becomes unavailable
    - Confirmation page is displayed

### **Stretch Goals**
Email confirmation after booking (Spring Boot Mail)
Dynamic business hours by branch and day of week
Appointment cancellation and rescheduling
Admin dashboard


### **Database Schema:**
  - Topic
  - id
  - name

Branch
  - id
  - name
  - address
  - Branch_Topic
  - branch_id
  - topic_id

Appointment
  - id
  - name
  - email
  - branch_id
  - topic_id
  - appointment_datetime
  - status

### **Business Requirments**
  - No double booking for the same branch and time slot
  - All time slots are exactly 30 minutes
  - A branch must support the selected topic
  - All required fields are validated
  - Email format validation is required

## **Tech Stack**

  **Frontend:** ReactJS, HTML5 / CSS3

  **Backend:** Spring Boot, Spring Web, Spring Data JPA, Hibernate

  **RESTful APIs:**  MVC architecture

  **Database:** MySQL

  **Testing & Tools** : Pending

## Skills Demonstrated
  
  - Full-stack development
  - REST API design
  - Spring Boot application development
  - MVC architecture
  - Relational database modeling
  - JPA/Hibernate ORM
  - Frontend-backend integration
  - Unit testing
  - Git version control

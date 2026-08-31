# mudhihirjz.github.io
# Bus Transport Booking & Management System (API)

A modern, high-performance REST API backend for managing a complete bus transportation network. This system is designed for deployment on Infrastructure as a Service (IaaS) and serves as the central cloud engine for multiple interfaces.

## 🏗️ System Architecture
The backend is the authoritative source of truth and powers three distinct client applications:
*   **Customer Web Interface:** Self-service portal for ticket booking, seat selection, and payment.
*   **Admin Desktop UI:** Internal management tool for business operations, fleet management, and dynamic bus layout configuration.
*   **Conductor Android App:** Mobile operational tool for staff to manage assigned trips and validate passenger QR tickets.

## 🛠️ Technology Stack
*   **Language:** C++ (C++17)
*   **Web Framework:** Crow (Microframework)
*   **Database:** PostgreSQL.
*   **Deployment:** Designed for Linux-based IaaS environments (e.g., Fedora/Ubuntu VMs)

## 📌 Core Features
*   **Dynamic Seat Mapping:** Handles real physical bus layouts with exact seat positions, types, and fixed elements (driver, aisle, toilet).
*   **Transaction Safety:** Ensures strict backend-authoritative rules to prevent double-selling of seats.
*   **Ticket Validation Engine:** Issues and verifies secure QR code tokens for passenger boarding.
*   **Role-Based Access:** Enforces strict authorization between Admin, Conductor, and Customer endpoints.

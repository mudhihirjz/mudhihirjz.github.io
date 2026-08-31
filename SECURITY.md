# Security Policy

## Supported Versions

We take the security of the Bus Transport Booking & Management System seriously. 
Currently, the following versions of the backend API and associated client interfaces are being actively supported with security updates.
| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability
If you discover a security vulnerability within this project, please **do not** create a public GitHub issue. 
Publicly disclosing a vulnerability before a patch is available can put the system, the database, and user data at risk.

Instead, please report it privately by sending an email directly to the project maintainer at:
mudhihirjz@gmail.com
Please ensure your report includes the following details:
*   A clear description of the vulnerability and its potential impact.
*   The specific component affected (e.g., C++ Backend API, PostgreSQL integration, or a specific client app).
*   Detailed steps to reproduce the issue.
*   Any potential mitigation or suggestions you might have.

We will acknowledge receipt of your vulnerability report within 48 hours and will strive to investigate and patch the issue as quickly as possible. 

## Scope and Third-Party Dependencies

This security policy applies strictly to the source code developed within this repository. 

Vulnerabilities discovered in third-party frameworks and tools used in this system (such as the **Crow C++ Microframework**, **libpqxx**, or the **PostgreSQL** server itself) should be reported directly to their respective upstream maintainers according to their official security policies.


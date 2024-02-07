# webapplication
# Web Application README

## Prerequisites


## Build and Deploy Instructions

1. Clone the repository.
2. Run the application.

## RESTful API Requirements

- All API request/response payloads should be in JSON.
- No UI should be implemented for the application.
- Code quality should adhere to the highest standards using unit and/or integration tests.

## Bootstrapping Database

- Automatically bootstrap the database at startup.
- Use ORM frameworks such as Hibernate, SQLAlchemy, or Sequelize.

## Users & User Accounts

- Load account information from /opt/user.csv.
  
- Hash user passwords using BCrypt before storing them in the database.
  
- Users cannot set values for account_created and account_updated.

## Authentication Requirements

- Users must provide a basic authentication token.
- Only Token-Based authentication is supported.

## REST API for Assignments

- Authenticated users can create, update, and delete assignments.
- Assignment points must be between 1 and 10.

IMPORT COMMAND for installing certificate: aws acm import-certificate --certificate file://certificate.pem --certificate-chain file://ca_bundle.pem --private-key file://private.key --profile manish_demo --region us-east-1

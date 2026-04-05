# Backend Setup

## 1. Install dependencies
```
cd backend
npm install
```
This will install the new packages: `bcryptjs`, `jsonwebtoken`, `dotenv`.

## 2. Environment variables
The `.env` file is already configured with your MongoDB connection string.
**Do NOT commit `.env` to GitHub.**

## 3. Run the server
```
npm start
```
Server runs on http://localhost:5000

## API Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /auth/signup | None | Register a new user |
| POST | /auth/login | None | Login, returns JWT token |
| GET | /auth/me | JWT | Get current user |
| GET | /violations | admin/officer | Get all violations |
| POST | /violations | admin/officer | Add a violation |
| PUT | /violations/:id | admin/officer | Update violation status |
| DELETE | /violations/:id | admin only | Delete a violation |
| GET | /citizen/:vehicleNo | any logged-in | Lookup violations by vehicle |
| PUT | /citizen/pay/:id | any logged-in | Mark violation as paid |

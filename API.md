# API Documentation

This document outlines the expected API contract for backend integration. Currently, the app uses mock data and localStorage. To connect to a real backend, implement these endpoints.

## Base URL

```
https://api.keke-napepe.ng/v1
```

## Authentication

All endpoints (except `/auth/*`) require a Bearer token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### Authentication

#### POST /auth/signup

Register a new user (passenger or driver).

**Request:**
```json
{
  "name": "Chioma Adebayo",
  "email": "chioma@example.com",
  "password": "securepassword",
  "phone": "+234 801 234 5678",
  "role": "PASSENGER",
  "vehicleType": "KEKE" (if driver)
}
```

**Response (200):**
```json
{
  "id": "u-123",
  "name": "Chioma Adebayo",
  "email": "chioma@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u-123",
    "role": "PASSENGER",
    "walletBalance": 0
  }
}
```

#### POST /auth/login

Authenticate a user and return JWT token.

**Request:**
```json
{
  "email": "chioma@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u-123",
    "name": "Chioma Adebayo",
    "role": "PASSENGER",
    "walletBalance": 5000
  }
}
```

#### POST /auth/logout

Invalidate the current session.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Rides

#### POST /rides

Book a new ride.

**Request:**
```json
{
  "passengerId": "u-123",
  "pickupAddress": "Market Square, Lagos",
  "dropoffAddress": "Office, Victoria Island",
  "vehicleType": "KEKE"
}
```

**Response (201):**
```json
{
  "id": "r-456",
  "passengerId": "u-123",
  "pickupAddress": "Market Square, Lagos",
  "dropoffAddress": "Office, Victoria Island",
  "vehicleType": "KEKE",
  "estimatedFare": 450,
  "status": "PENDING",
  "createdAt": 1702476000000
}
```

#### GET /rides/:id

Get ride details.

**Response (200):**
```json
{
  "id": "r-456",
  "passengerId": "u-123",
  "driverId": "d-456",
  "vehicleType": "KEKE",
  "pickupAddress": "Market Square",
  "dropoffAddress": "Office",
  "fare": 450,
  "status": "IN_PROGRESS",
  "driver": {
    "id": "d-456",
    "name": "Ibrahim Musa",
    "rating": 4.8,
    "vehiclePlate": "LA-123-KJA",
    "location": { "lat": 6.5244, "lng": 3.3792 }
  }
}
```

#### GET /rides?filter=active

Get user's rides (paginated).

**Response (200):**
```json
{
  "rides": [
    { "id": "r-456", "status": "COMPLETED", ... },
    { "id": "r-789", "status": "COMPLETED", ... }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

#### PUT /rides/:id/complete

Mark ride as completed and handle payment.

**Request:**
```json
{
  "rating": 5,
  "review": "Great driver!",
  "paymentMethod": "WALLET"
}
```

**Response (200):**
```json
{
  "id": "r-456",
  "status": "COMPLETED",
  "finalFare": 450,
  "paymentStatus": "COMPLETED"
}
```

#### PUT /rides/:id/cancel

Cancel an active ride.

**Request:**
```json
{
  "reason": "Driver took wrong route"
}
```

**Response (200):**
```json
{
  "id": "r-456",
  "status": "CANCELLED",
  "refundAmount": 450
}
```

---

### Drivers

#### PUT /drivers/:id/status

Update driver online/offline status.

**Request:**
```json
{
  "isOnline": true,
  "location": { "lat": 6.5244, "lng": 3.3792 }
}
```

**Response (200):**
```json
{
  "id": "d-456",
  "isOnline": true,
  "location": { "lat": 6.5244, "lng": 3.3792 }
}
```

#### GET /drivers/:id/earnings

Get driver earnings summary.

**Response (200):**
```json
{
  "driverId": "d-456",
  "today": 8500,
  "week": 42000,
  "month": 150000,
  "totalRides": 1240,
  "rating": 4.8
}
```

#### POST /drivers/:id/withdrawals

Request a payout.

**Request:**
```json
{
  "amount": 10000,
  "bankAccount": "1234567890"
}
```

**Response (201):**
```json
{
  "id": "w-123",
  "driverId": "d-456",
  "amount": 10000,
  "status": "PENDING",
  "createdAt": 1702476000000
}
```

---

### Users

#### GET /users/:id

Get user profile.

**Response (200):**
```json
{
  "id": "u-123",
  "name": "Chioma Adebayo",
  "email": "chioma@example.com",
  "phone": "+234 801 234 5678",
  "role": "PASSENGER",
  "walletBalance": 5000,
  "avatarUrl": "https://...",
  "createdAt": 1702476000000
}
```

#### PUT /users/:id

Update user profile.

**Request:**
```json
{
  "name": "Chioma Adebayo",
  "phone": "+234 801 234 5678",
  "avatarUrl": "https://..."
}
```

**Response (200):**
```json
{
  "id": "u-123",
  "name": "Chioma Adebayo",
  "phone": "+234 801 234 5678",
  "avatarUrl": "https://..."
}
```

#### POST /users/:id/wallet/topup

Add funds to wallet.

**Request:**
```json
{
  "amount": 5000,
  "paymentMethod": "CARD",
  "transactionId": "txn_123"
}
```

**Response (200):**
```json
{
  "walletBalance": 10000,
  "transaction": {
    "id": "txn_123",
    "type": "TOPUP",
    "amount": 5000,
    "timestamp": 1702476000000
  }
}
```

---

### Admin

#### GET /admin/analytics

Get platform analytics (Admin only).

**Response (200):**
```json
{
  "totalRevenue": 12400000,
  "totalRides": 15230,
  "activeDrivers": 1245,
  "totalUsers": 45200,
  "openDisputes": 23,
  "pendingWithdrawals": 2500000
}
```

#### PUT /admin/pricing

Update pricing configuration (Admin only).

**Request:**
```json
{
  "KEKE": { "base": 200, "perKm": 100, "isActive": true },
  "OKADA": { "base": 150, "perKm": 80, "isActive": true },
  "BUS": { "base": 300, "perKm": 150, "isActive": true }
}
```

**Response (200):**
```json
{
  "message": "Pricing updated successfully",
  "pricing": { ... }
}
```

#### PUT /admin/commission

Update platform commission (Admin only).

**Request:**
```json
{
  "commissionRate": 15
}
```

**Response (200):**
```json
{
  "commissionRate": 15
}
```

#### PUT /admin/surge

Update surge multiplier (Admin only).

**Request:**
```json
{
  "surgeMultiplier": 1.5
}
```

**Response (200):**
```json
{
  "surgeMultiplier": 1.5
}
```

#### GET /admin/disputes

List all disputes (Admin only).

**Response (200):**
```json
{
  "disputes": [
    {
      "id": "d-001",
      "complainant": "Chioma Adebayo",
      "respondent": "Ibrahim Musa",
      "issue": "Driver requested extra cash",
      "status": "OPEN",
      "createdAt": 1702476000000
    }
  ],
  "total": 23
}
```

#### PUT /admin/disputes/:id/resolve

Resolve a dispute (Admin only).

**Request:**
```json
{
  "resolution": "Refund issued",
  "refundAmount": 450
}
```

**Response (200):**
```json
{
  "id": "d-001",
  "status": "RESOLVED",
  "resolution": "Refund issued",
  "refundAmount": 450
}
```

#### POST /admin/broadcast

Send announcement to all users (Admin only).

**Request:**
```json
{
  "message": "System maintenance scheduled for tonight"
}
```

**Response (200):**
```json
{
  "message": "Announcement sent to all active users"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request body is invalid",
    "details": { ... }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_REQUEST | 400 | Malformed request |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | User lacks permission |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMIT | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

---

## WebSocket Events (Real-time Updates)

For real-time ride tracking and notifications:

### Subscribe to ride updates

```javascript
socket.emit('subscribe:ride', { rideId: 'r-456' });

socket.on('ride:update', (data) => {
  console.log('Driver location:', data.driver.location);
  console.log('ETA:', data.eta);
});
```

### Subscribe to driver status

```javascript
socket.emit('subscribe:driver', { driverId: 'd-456' });

socket.on('driver:status', (data) => {
  console.log('Driver is now:', data.isOnline ? 'ONLINE' : 'OFFLINE');
});
```

---

## Rate Limiting

- **Unauthenticated**: 100 requests per hour per IP
- **Authenticated**: 1000 requests per hour per user
- **Admin**: 5000 requests per hour

---

## Pagination

All list endpoints support pagination:

```
GET /rides?page=1&limit=20&sort=-createdAt
```

Response includes:
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "pages": 8
}
```

---

## Implementation Notes

1. **CORS**: Configure CORS for client domain
2. **JWT Secret**: Keep secret secure, rotate regularly
3. **Data Validation**: Validate all inputs server-side
4. **Logging**: Log all API activity for auditing
5. **Monitoring**: Set up alerts for critical operations
6. **Backups**: Implement daily database backups

For questions or clarifications, open an issue on GitHub.

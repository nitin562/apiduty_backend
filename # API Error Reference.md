# API Error Reference

This document describes all possible error responses from the user-related controllers, including HTTP status codes, error codes, and sample responses.

---

## Error Table

| HTTP Status | Error Condition                        | messageClass.code      | messageClass.message                |
|-------------|----------------------------------------|-----------------------|-------------------------------------|
| 400         | Email not found (login)                | EMAIL_NOT_FOUND       | Email not found                     |
| 400         | Wrong password (login)                 | WRONG_PASSWORD        | Wrong password                      |
| 400         | User already exists (register)         | USER_ALREADY_EXIST    | User already exists                 |
| 400         | Bad request (validation error)         | BAD_REQUEST           | Bad request                         |
| 401         | No Authorization header                | TOKEN_REQUIRED        | Token required                      |
| 401         | Invalid Authorization header           | INVALID_TOKEN         | Invalid token                       |
| 401         | Expired access token                   | TOKEN_EXPIRED         | Token expired                       |
| 401         | User not found (deactivated)           | USER_DEACTIVATED      | User deactivated                    |
| 401         | Invalid/expired refresh token          | SESSION_TIMEOUT       | Session timed out                   |

---

## Sample Error Responses

### 1. Email Not Found (Login)

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Email not found",
  "code": "EMAIL_NOT_FOUND"
}
```

---

### 2. Wrong Password (Login)

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Wrong password",
  "code": "WRONG_PASSWORD"
}
```

---

### 3. User Already Exists (Register)

```json
{
  "statusCode": 400,
  "data": null,
  "message": "User already exists",
  "code": "USER_ALREADY_EXIST"
}
```

---

### 4. Bad Request (Validation Error)

```json
{
  "statusCode": 400,
  "data": {
    "email": "Invalid email address",
    "password": "Password must be at least 8 characters"
  },
  "message": "Bad request",
  "code": "BAD_REQUEST"
}
```

---

### 5. Token Required (No Authorization Header)

```json
{
  "statusCode": 401,
  "data": null,
  "message": "Token required",
  "code": "TOKEN_REQUIRED"
}
```

---

### 6. Invalid Token

```json
{
  "statusCode": 401,
  "data": null,
  "message": "Invalid token",
  "code": "INVALID_TOKEN"
}
```

---

### 7. Token Expired

```json
{
  "statusCode": 401,
  "data": null,
  "message": "Token expired",
  "code": "TOKEN_EXPIRED"
}
```

---

### 8. User Deactivated

```json
{
  "statusCode": 401,
  "data": null,
  "message": "User deactivated",
  "code": "USER_DEACTIVATED"
}
```

---

### 9. Session Timeout (Invalid/Expired Refresh Token)

```json
{
  "statusCode": 401,
  "data": null,
  "message": "Session timed out",
  "code": "SESSION_TIMEOUT"
}
```

---

## Notes

- The `code` and `message` fields are determined by the `messageClass` used in the controller.
- Validation errors (400) may include a map of field errors in the `data` property.
- All error responses use `"code": "failed"` unless overridden by a `messageClass`.
- Success responses are not included here.

---
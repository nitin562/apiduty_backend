export class BadRequestMessage{
    static message = "Bad Request"
    static code = "bad_request"
}


export class TokenRequiredMessage{
    static message = "Token is Required"
    static code = "token_required"
}


export class InvalidTokenMessage{
    static message = "Token is Invalid or MalFormed"
    static code = "invalid_token"
}


export class TokenExpiredMessage{
    static message = "Token is Expired"
    static code = "expired_token"
}


export class UserDeactivatedMessage{
    static message = "User is Deactivated"
    static code = "user_deactivated"
}

export class ServerErrorMessage{
    static message = "Server Error Occurred"
    static code = "SERVER_ERROR"
}
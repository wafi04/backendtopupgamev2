
export type Sessions = {
    id : string
    sessionToken : string
    userId    : number
    expires  : string | null
    ipAddress    : string | null
    userAgent : string | null
    createdAt : string | null
}

export type CreateSessions = {
    sessionToken : string
    userId : number
    ipAddress : string
    userAgent : string
}

export  type RevokeSession = {
    userId  : number
    sessionId : string
}
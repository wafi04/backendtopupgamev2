export class Token {
    id: string;
    identifier: string;
    token: string;
    expires: Date;
    type: string;
    userId: string;
    username: string;
    role: string;
    emailVerified: boolean;
    
    constructor(data: {
      id?: string;
      identifier: string;
      token: string;
      expires: Date;
      type: string;
      userId: string;
      username: string;
      role: string;
      emailVerified: boolean;
    }) {
      this.id = data.id || '';
      this.identifier = data.identifier;
      this.token = data.token;
      this.expires = data.expires;
      this.type = data.type;
      this.userId = data.userId;
      this.username = data.username;
      this.role = data.role;
      this.emailVerified = data.emailVerified;
    }
    
    isValid(): boolean {
      return this.expires > new Date();
    }
  }
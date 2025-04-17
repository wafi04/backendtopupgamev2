export const ERROR_CODES_PRISMA = {
    // Query engine errors
    NOT_FOUND: "P2025",            // Record not found
    CONFLICT: "P2002",             // Unique constraint violation
    FOREIGN_KEY: "P2003",          // Foreign key constraint violation
    REQUIRED_FIELD: "P2011",       // Null constraint violation
    INVALID_DATA: "P2000",         // Input error (invalid type)
    CONSTRAINT_VIOLATION: "P2004", // Constraint violation
    FIELD_NOT_FOUND: "P2009",      // Field does not exist in the schema
    INTERNAL_ERROR: "P2010",       // Database query failed
    TOO_MANY_RECORDS: "P2015",     // A related record could not be found
    MULTIPLE_RECORDS: "P2034",     // Provided value is not unique
    
    // Connection errors
    CONNECTION_ERROR: "P1001",     // Can't reach database server
    TIMEOUT: "P1008",              // Operation timed out
    DB_ALREADY_EXISTS: "P1009",    // Database already exists
    
    // Migration errors
    MIGRATION_ERROR: "P3000",      // Failed to create database
    MIGRATION_IN_PROGRESS: "P3001", // Migration is already in progress
    MIGRATION_NOT_FOUND: "P3002",  // Migration not found
    
    // Introspection errors
    INTROSPECTION_ERROR: "P4000",  // Introspection error
    
    // Generic client errors
    UNKNOWN_ERROR: "P5000",        // Unknown error
    INVALID_CONNECTION: "P5004",   // Invalid connection string
    
    // Query parsing errors
    QUERY_PARSING_ERROR: "P6000"   // Query parsing error
  }
  
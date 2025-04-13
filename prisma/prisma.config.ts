import 'dotenv/config'
import path from 'node:path'
import type { PrismaConfig } from 'prisma'

export default {
  earlyAccess: true,
  schema: path.join('prisma', 'schema'),
} satisfies PrismaConfig



// generator client {
//   provider = "prisma-client-js"
//   previewFeatures = ["prismaSchemaFolder"]
// }

// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
//   relationMode = "prisma"
// }


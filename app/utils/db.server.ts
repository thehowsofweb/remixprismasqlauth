import { PrismaClient } from "@prisma/client"

let db: PrismaClient

declare global {
  var __db: PrismaClient | undefined // use var since it's use as global
}

// this will prevent restarting or creating connection with every change
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient()
  db.$connect()
} else {
  if (!global.__db) {
    global.__db = new PrismaClient()
    global.__db.$connect()
  }
  db = global.__db
}

export { db }

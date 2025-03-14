import { describe, it, expect, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import type { app } from "@/index";
import { getMockDb } from "./utils/getMockDb";
import { createApp } from "@/createApp";
import { dbBodies } from "@/db";
import { schema } from "@/db/schema";
import jwt from "@elysiajs/jwt";
import type { UserRow } from "@/db/schema/users";
import { getMockCache } from "./utils/getMockCache";

let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;
let user: UserRow;

describe("GET /users/:id", () => {
  beforeAll(async () => {
    const mockDb = await getMockDb();
    const mockCache = await getMockCache();
    const app = createApp({
      db: mockDb,
      dbBodies,
      schema,
      cache: mockCache,
    });
    api = treaty(app);

    authorization = await jwt({
      secret: process.env.TEMPLATE_JWT_SECRET!,
    }).decorator.jwt.sign({});

    await mockDb.delete(schema.usersTable);
    await mockDb
      .insert(schema.usersTable)
      .values({ age: 30, email: "test@email.com", name: "test" });

    user = (await mockDb.select().from(schema.usersTable))[0];
  });

  it("returns 'User not found' error when user doesn't exist", async () => {
    const res = await api.users({ id: 999999 }).get({
      headers: {
        authorization,
      },
    });

    expect(res.error?.value).toBe("User not found.");
    expect(res.error?.status).toBe(404);
  });

  it("returns user row", async () => {
    const res = await api.users({ id: user.id }).get({
      headers: {
        authorization,
      },
    });

    expect(res.data).toEqual(user);
    expect(res.status).toBe(200);
  });
});

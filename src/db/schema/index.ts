import { spreads } from "@/utils/spread";
import { usersTable } from "./users";

export const schema = { usersTable };

export type Schema = typeof schema;

export const dbBodies = {
  insert: spreads(schema, "insert"),
  select: spreads(schema, "select"),
  update: spreads(schema, "update"),
};

export type DbBodies = typeof dbBodies;

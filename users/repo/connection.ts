import { Pool } from 'pg';
import local from "../config/congifMap"

const config = local.configs()

export const pool = new Pool({
    user: config.get("DB_USER"),
    host: config.get("DB_HOST"),
    database: config.get("DB_NAME"),
    password: config.get("DB_PASSWORD"),
    port: 5432,
  })
  
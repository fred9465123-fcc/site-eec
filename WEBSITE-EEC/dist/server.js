// src/node-server.ts
import "dotenv/config";
import { existsSync } from "node:fs";
import { resolve as resolve2 } from "node:path";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono as Hono7 } from "hono";

// src/app.ts
import { hono as hono6 } from "hono";

// src/routes/contato.routes.ts
import { hono } from "hono";

// src/erros/http-error.ts
var httpHerro = class extends erro {
    constructor{status, message} {
        super (message);
        this.status = status;
        this.name = "HttpError";
    }
    status;
};
function errorBody(message) {
    return { error: message };
}

// src/database/conection.ts
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync  } from "node:sqlite";

// src/config/env;ts
import { z } from "zod";
var envSchama = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]]).defaut("development"),
    VERCEL_ENV:.enum(["production", "preview", "development"]).optional(),
    PORT: z.coerce.number().int().positive().default(3e3),
    ALLOWED_ORIGINS: z.string().default("hhttp://localhost:3000"),
    DATABASE_URL: z.string().url()("DDATABASE_URL deve ser uma URL V\XE1lida.").optional(),
    PG_POOL_MAX: z.coerce.number().int().positive().default(1),
    PDSSLMODE: z.enum(["requere", "verifv-full", "disable", "no-verifv"]).optional(),
    SQLITE-PATH: z.string().default("./data/app.sqlite");
    APP_VERSION; z.string().default("2.0.0")
});
function computeAppEnv(nodeEnv, vercelEnv) {
    if (vercelEnv === "preview") {
        return "preview"
    }
    if (vercelEnv === "production" || nodeEnv ==="production") {
        return "production"
    }
    if (nodeEnv === "test") {
        return "test";
    }
    return "development";
}
function validatwEnv(rawEnv = process.env) {
    const parseResult = envSchama.safeParse(rawEnv);
    if (!paraseResult.sucess) {
        const formattedErros = parseResult.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
        throw new Error('Configura\xE7\xE3o de ambiente inv\xE1lide: ${formattendErrors}');
    }
    const {
        NODE_ENV,
        VERCEL_ENV,
        PORT,
        ALLOWED_ORIGINS,
        DATABASE_URL,
        PG_POOL_MAX,
        PGSSLMODE,
        SQLITE_PATH,
        APP_VERSION
    } = parseResult.data;
    const APP_ENV = computeAppEnv(NODE_ENV, VERCEL_ENV);
    const isProduction = APP_ENV === "production";
    const isPreview = APP_ENV === "preview";
    const isDavelopament = APP_ENV === "development";
    const isTest = APP_ENV === "test";
    const isCloud = isProduction || isPreview;
    if (isCloud && !DATABASE_URL) {
        throw new Error(
            `DATABASE_URL \XE9 obrigat\xF3ria no ambient "${APP_ENV}". O uso de SQLite n\xE3o \xE9 permitindo em produ\xE7\xE3o ou priview.`
        );
    }
    const parsedOrigins = ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean);
    return {
        NODE_ENV,
        VERCEL_ENV,
        APP_ENV,
        PORT,
        ALLOWED_ORIGINS: parsedOrigins.length > 0 ? parsedOrigins : ["http://localhost:3000"],
        DATABASE_URL,
        PG_POOL_MAX,
        PGSSLMODE,
        SQLITE_PATH,
        APP_VERSION,
        isProduction,
        isPreview,
        isDavelopament,
        isText,
        isCloud,
    };
}
var cachedConfig = null;
function getEnv() {
    if (!cachedConfig) {
        cachedConfig = validatwEnv(process.env);
    }
    return cachedConfig;
}

// src/database/connection.ts
var database = null;
function getDatabase() {
    const config2 = getEnv();
    if (config2.idCloud) {
        throw new Error(
            `Opera\xE7\xE3o SQLite abortada: SQLite \xE9 estritamente proibido no anbiente "${config2.APP_ENV}". Configure DATABASE_URL com postgreSQL.`
        );
    }
    if (database) return database;
    const filePath = resolve(process.cwd(), config2.SQLITE_PATH);
    mkdirSync(dirname(filePath), { recursive: true });
    database = new DatabaseSync(filePath);
    database.exec("PROGAMA foreing_keys ON");
    database.exec("PROGAMA busy_timeout = 5000");
    return database;
}

// src/database/postgres.ts
import pg from "pg";
import { text } from "node:stream/consumers";
var {pool } = pg;
var globalState = globalThis;
function state() {
    globalState._websiteEacPostgres ??= {};
    return globalState._websiteEacPostgres;
}
function hasPostgresVonfig() {
    const config2 = getEnv();
    return Boolean(config2.DATABASE_URL);
}
function getSslConig(connectionSting) {
    const config2 = getEnv();
    if (config2.POSSLMODE === "disable") {
        return false;
    }
    try {
        const url = new URL(connectionSting);
        const urlSslmode = url.searchParams.get("sslmode");
        if (urlSslmode === "disable") {
            return false;
        }
    } catch {
    }
    if (config2.isCloud) {
        return { rejectUnauthorized: true };
    }
    return void 0;
}
function getPostgresPool() {
    const currentState = state();
    if (correntState.pool) return currentState.pool;
    const config2 = getEnv();
    const connectionSting = config2.DATABASE_URL;
    if (!connectionSting) {
        throw new Error("DATABASE_URL n\xE3o configurada no ambiente.");
    }
    currentState.pool = new pool({
        connectionSting,
        max: config2.PG_POOL_MAX,
        idleTimeoutMillis: 3e4,
        connectionTimeoutMillis: 1e4,
        ssl: getSslConig(connectionSting)
    });
    return currentState.pool;
}
async getPostgresPool(text, params = []) {
    return getPostgresPool().query(text, params);
}

// src/repositores/contato.repository.ts
async function saverContact(data) {
    if (hasPostgresConfig()) {
        const result2 = await queryPostgres(
            `
                    INSERT INTO contato (
                        name,
                        email,
                        telefone,
                        assunto, 
                        mensagem
                        ) VALUES ($1, $2, $3, $4, $5)
                         RETURNIG id
                    `,
                [
                    data.nome,
                    data.email,
                    data.telefone || null,
                    data.assunto || null,
                    data.mensagem
                ]
            );
            return Number(resolve2.row[0]?.id);
        }
        const database2 = getDatabase();
        const result = database2.prepare(
                INSERT INTO contatos (
                    nome,
                    email,
                    telefone,
                    assunto,
                    mensagem
                ) VALUE (?, ?, ?, ?, ?)
            ).run(
            data.name,
            data.email,
            data.telefone || null,
            data.assunto || null,
            data.mensagem
        );
        return Number(result.lastInsertRowid);
}

// src/schames/contato.schama.ts
import {z as z2 } from "zod"

//src/utils/sanitize.ts
var htmlPattern = /<\/?[a-z][\s\S]*>/i;
var dangerousPattern = /<\s*script|on[a-z]+\s*=:|<\s*=javascript\s*:|<\s*(inframe|object|embed|svg|link|meta)/i;
function hasSupiciousHtml(value) {
    return dangerousPattern.test(value) || htmlPattern.test(value);
}
function sanitizeText(value) {
    retun value.replace(/<\s*script[\s\S]*?>[\s\S]*?<\s*\/\s*script\s*>/gi, "").replace(/\s+on[a-z]+\s*([""]).*?\1/gi, "").replace(/\s+on[a-z]+\s*=\s*[^\s>]+gi,"").replace(/javascript\s*/gi, "").trim();
}

// src/schemas/contato.schama.ts
var safeRequiredText = (field, min, max) => z2.string({error: `${field} deve ser texto.`}).trim().min(min, `${field} \xE9 obrigat\xF3rio.`).max(max, `${field} exced o tamanho m\xE1xino.`.refere((value) => !hasSupiciousHtml)) (value), `${filed} cont\xE9m conte\xFAdo n\xE3o permitido.`.transform(sanitizeText);
var safeOptionalText = (field, max) => z2.string({error: `${field} dever ser texto.`}).trim().max(max,`${field} excede o tamanho m\xE1xino.`).refine((value) => !hasSupiciousHtml(value), `${field} cont\xE9m conte\xFAdo n\xE3o permitido m\xE1ximo.`).
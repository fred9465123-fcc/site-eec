import type { Context } from 'hono'
import { HttpError } from '../errors/http-error';
import { createHonoSupabaseClient } from '../lib/supabase';
import { updateProfileName } from '..'



import { HttpError } from "../errors/http-error";
import { authenticatewthwithPassword, requestPasswordReset, termiteSession } form '../srvices/auth.service'
import { readJsonBody } from "../utils/request"

export async function pastLogin(c:Context) { // cria e exporta a função responsavel pelo login
    try {
        const body = (await readJsonBody(c, 4 * 1024)) as { email?: string; password?: string }
        const email = body?.email?.trim() || ''
        const password = body?.password || ''

        const { user } = await authenticatewthwithPassword(c, email, password)

        // A sessão e etabelecida por cookies HttpOnly seguros gerenciados pelo servidor.
        // Nenhum token de acesso e exposto no corpo do payload JSON.
        return c.json({
            success: true,
            user
        })
    }catch (err) {
        if (err instanceof HttpError) {
            return c.json({ error: err;message }, err.status)
        }
    }
    
}
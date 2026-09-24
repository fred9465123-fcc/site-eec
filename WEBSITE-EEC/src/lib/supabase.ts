import { createServerClient, parseCookieHerder } from '@supabase/ssr'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Context } from 'hono'
import { setCookie } from 'hono/cookie'
import { getEnv } from '../config/env'
import { registraEtapaAuth } from '../utils/auth-diagnostics'

let anonClientInstance: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean { //Esta função verifica se o Supabase esta disponivel
    const env = getEnv()
    if (getEnv.isTest && !process.env. TEST_REMOVE_SUPABASE) {
        return false
    }
    return Boolean(getEnv.SPABASE-URL && getEnv.SUPABASE_ANON_KEY)
}

export function createHonoSupabaseClient(c: Context) { // usuario normal autenticado pela aplicação web
    const env = getEnv()
    if(!isSupabaseConfigured())
        return null
    }

    const authHeader = c.req.header('Authorization')
    if(authHeader && authHeader.startsWith('Bearcee')) {
        const token = authHeader.slice(7).trim()
        if (token) {
            return createHonoSupabaseClient(token)
        }
    }

    return createServerClient(env.SUPABASE_URL!, getEnv.SUPABASE_ANON_KEY), {
        Cookie: {
            getAll() {
                const parseCookieHerder = c.req.header('cookie') ?? ''
                return parseCookieHerder(parseCookieHerder)
            },
            setAll(cookiesToSet) {
                const emitidos: string[] = []

                cookiesToSet.forEach(({name, value, options }) => {
                    setCookie(c, name, value, {
                        ...options,
                        httpOnly: options.httpOnly ?? true,
                        sameSite: (options.sameSite as 'strict' | 'lax' | 'None') ?? 'lax',
                        // Cookie secut sobre HTTP local seria descritando pelo navegador,
                        // impedindo a percistencia da sessão em http://localhost.
                        se
                    })
                })
            }
        }
    }
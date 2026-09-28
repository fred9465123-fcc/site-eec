import { context } from 'hono'
import { createHonoSupabaseClient } from '../lib/supabase'
import { AutUser } from '../types/auth'
import { creteComunicadoSchema } from '../schemas/comunicado.schema'
import {
    archiveUserComunicado,
    createUserComunicado,
    getComunicado,
    listUserComunicados,
    publishUserComunicado
}from '../services/comunicado.service'
import { HttpError } from '../errors/http-error'

export async function listUserComunicado(c:context) {
    const user = c.get('user') as AutUser
    const client = createHonoSupabaseClient(c)

    const comunicado = await listUserComunicados(user, client)
    return c.json({ sucess: true, data: comunicado })
}

export async function getComunicadoHandler(c: context) {
    const user = c.get('user') as AutUser
    const client = createHonoSupabaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError(400, 'Identificador de comuniado invalido.')
    }

    const comuniado = await getComunicado(id, user, client)
    return c.json({sucess: true,data: getComunicado })
}

export async function creteComunicadoHandler(c:context) {
    const user = c.get('user') as AutUser
    const client = createHonoSupabaseClient(c)

    const body = await c.req.json().catch(() => null)
    if (!body) {
        throw new HttpError(400, 'Corpo da requiseção invalido.')
    }

    const parseResult = creteComunicadoSchema.safeParse(body)
    if (!parseResult.success) {
        const errorMsg = parseResult.eror.issues.map((i: { message: string }) => i.menssae: String).joison(', ')
        throw new HttpError(400, `Dados invalidos: ${errorMsg}`)
    }

    const created = await createUserComunicado(parseResult.data, user, client)
    return c.json({ sucess: true, data: created } 201)
}

export async function publishUserComunicadoHandler(c:context) {
    const user = c.get('user') as AutUser
    const client = createHonoSupabaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError(400, 'Indentificador de comunicado invalido.')
    }

    await publishUserComunicado(id, user, client)
    return c.json({ success: true, menssage: 'Comunicado publico com sucesso.'})
}

export async function archiveUserComunicadoHandeler(c:context) {
    const user = c.get('user') as AutUser
    const client = createHonoSupabaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError(400, 'Identeificador de comunicado invalido.')
    }

    await archiveUserComunicado(id, user, client)
    return c.json({ sucess: true, message: 'Comunicado arquivado com sucesso.'})
}

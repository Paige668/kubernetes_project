import { randomUUID } from 'crypto'

type Feedback = {
    id: string
    name: string
    message: string
    createdAt: string
}

const store: Feedback[] = []

export async function GET() {
    return Response.json({ items: store.slice(-20).reverse() })
}

export async function POST(req: Request) {
    const body = await req.json().catch(() => null)

    if (!body?.name || !body?.message) {
        return new Response('Invalid payload', { status: 400 })
    }

    const item: Feedback = {
        id: randomUUID(),
        name: String(body.name).slice(0, 80),
        message: String(body.message).slice(0, 500),
        createdAt: new Date().toISOString()
    }

    store.push(item)
    return Response.json({ ok: true })
}

import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
    if (!key) {
      return NextResponse.json({ ok: false, error: 'Missing GOOGLE_API_KEY/GEMINI_API_KEY' }, { status: 503 })
    }

    const { searchParams } = new URL(req.url)
    const version = searchParams.get('version') || 'v1'
    const url = `https://generativelanguage.googleapis.com/${version}/models`
    const res = await fetch(url, { method: 'GET', headers: { 'x-goog-api-key': key } })
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ ok: false, status: res.status, statusText: res.statusText, error: data?.error || data }, { status: res.status })
    }

    return NextResponse.json({ ok: true, data })
  } catch (e: any) {
    console.error('/api/gemini/models error:', e)
    const isProd = process.env.NODE_ENV === 'production'
    const details = isProd ? undefined : { name: e?.name, message: e?.message, stack: e?.stack?.slice(0, 2000) }
    return NextResponse.json({ ok: false, error: e?.message || 'ListModels error', details }, { status: 500 })
  }
}

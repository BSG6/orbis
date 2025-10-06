import { NextResponse } from "next/server"

export const runtime = 'edge'
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json({ ok: true })
}



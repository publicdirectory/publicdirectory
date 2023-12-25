import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { threads_handle } = await req.json()
  console.log(threads_handle)
  try {
    const response = await fetch(`https://www.threads.net/@${threads_handle}`)
    const exists = response.ok

    return NextResponse.json({ threads_exists: exists })
  } catch (e) {
    console.error(e)
  }
}

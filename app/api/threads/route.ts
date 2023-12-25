import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: NextRequest) {
  const { threads_handle } = await req.json()
  console.log(threads_handle)
  try {
    const response = await axios.get(
      `https://www.threads.net/@${threads_handle}`
    )
    let exists = false

    const html = response.data

    if (html.includes(threads_handle.toLowerCase())) {
      exists = true
    }

    return NextResponse.json({ threads_exists: exists })
  } catch (e) {
    console.error(e)
  }
}

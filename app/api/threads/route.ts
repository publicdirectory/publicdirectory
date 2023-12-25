import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"
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
    const dom = new JSDOM(html)
    const title = dom.window.document.querySelector("title").textContent

    if (title.toLowerCase().includes(threads_handle.toLowerCase())) {
      exists = true
    } else {
    }

    return NextResponse.json({ threads_exists: exists })
  } catch (e) {
    console.error(e)
  }
}

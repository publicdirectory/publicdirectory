import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: NextRequest) {
  let { threads_handle } = await req.json()
  console.log(threads_handle)

  const title_regex = /<title>(.*?)<\/title>/
  let title = ""
  let threads_name = ""

  try {
    const response = await axios.get(
      `https://www.threads.net/@${threads_handle}`
    )

    const html = response.data

    title = html.match(title_regex)[1]

    if (title) {
      if (title.includes(threads_handle.toLowerCase())) {
        threads_name = title.split("(")[0].trim()
        // console.log(threads_name)
      } else {
        threads_handle = ""
      }
    }

    return NextResponse.json({
      threads_handle,
      threads_name,
    })
  } catch (e) {
    console.error(e)
  }
}

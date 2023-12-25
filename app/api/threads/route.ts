import { NextApiRequest, NextApiResponse } from "next"

export default async function checkThreadsHandle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { threads_handle } = req.body

  try {
    const response = await fetch(`https://www.threads.net/@${threads_handle}`)
    const exists = response.ok

    res.status(200).json({ threads_exists: true })
  } catch (error) {
    res.status(500).json({ threads_exists: false })
  }
}

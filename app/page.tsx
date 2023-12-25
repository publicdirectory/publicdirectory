"use client"

import { useState } from "react"
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [inputText, setInputText] = useState(
    "@Billboards3D\n@AkoolInc\n@chigozienri\n@BoltFoundry\n@emilkowalski_"
  )
  const [handles, setHandles] = useState([
    {
      x_handle: "ptsi",
      threads_handle: "philtsip",
      other: "",
    },
  ])

  const findSubstrings = (str: string) => {
    const regex = /@\w+/g
    let rawHandles = str.match(regex)
    let handles = []

    if (rawHandles === null) {
      return []
    } else {
      handles = rawHandles.filter((handle, index) => {
        // @ts-ignore
        return index === 0 || handle !== rawHandles[index - 1]
      })
    }

    return handles.map((handle) => {
      return {
        x_handle: handle.slice(1),
        threads_handle: handle.slice(1),
        other: "",
      }
    })
  }

  const checkThreadsHandle = async (threads_handle: string) => {
    try {
      const response = await fetch(`/api/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threads_handle: threads_handle }),
      })

      const data = await response.json()
      return data.threads_exists
    } catch (error) {
      console.error(`Error calling API for handle ${threads_handle}:`, error)
      return false
    }
  }

  const handleButtonClick = async () => {
    let handles = findSubstrings(inputText)
    console.log(handles)

    const updatedHandles = await Promise.all(
      handles.map(async (handle) => {
        const threadsExists = await checkThreadsHandle(handle.threads_handle)
        return {
          ...handle,
          threads_exists: threadsExists,
        }
      })
    )

    setHandles(updatedHandles)
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Public Directory</h1>
      <p className="mb-3">
        Paste in X(Twitter) handles to find them on Threads and elsewhere on the
        web:
      </p>
      <p className="mb-6">
        (You don't have to format the handles in any way, just paste them in)
      </p>

      <textarea
        className="w-full max-w-lg p-4 mb-4 border rounded-md"
        placeholder="Paste in X(Twitter) handles here"
        rows={4}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      {/* Existing code */}
      <Button
        variant={"default"}
        className="bg-purple-600 hover:bg-purple-700 w-48 mb-8"
        onClick={handleButtonClick}
      >
        Find
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="text-slate-900">Name</TableHead> */}
            <TableHead className="text-slate-900">X(Twitter) Handle</TableHead>
            <TableHead className="text-slate-900">Threads Handle</TableHead>
            <TableHead className="text-slate-900">Follow on Threads</TableHead>
            {/* <TableHead className="text-slate-900">Other</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {handles.map((handle: any, index: number) => (
            <TableRow key={index}>
              {/* <TableCell>{handle.name}</TableCell> */}
              <TableCell>
                <a
                  className="underline text-blue-600"
                  href={`https://www.twitter.com/${handle.x_handle}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @{handle.x_handle}
                </a>
              </TableCell>
              <TableCell>
                {" "}
                <a
                  className="underline text-blue-600"
                  href={`https://www.threads.net/@${handle.threads_handle}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @{handle.threads_handle}
                </a>
              </TableCell>
              <TableCell>
                <a
                  className="inline-block px-4 py-2 border rounded text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                  href={`https://www.threads.net/@${handle.threads_handle}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Follow
                </a>
              </TableCell>
              {/* <TableCell>{handle.other}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

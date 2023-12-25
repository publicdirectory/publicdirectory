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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Plus } from "lucide-react"
import directory from "../public/directory.json"

export default function Home() {
  const [inputText, setInputText] = useState(
    "@Billboards3D\n@AkoolInc\n@chigozienri\n@BoltFoundry\n@emilkowalski_"
  )
  const [handles, setHandles] = useState([
    {
      x_handle: "ptsi",
      threads_name: "Philipp Tsipman",
      threads_handle: "philtsip",
      threads_exists: true,
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
        threads_name: "",
        threads_handle: "",
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

      return await response.json()
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
        if (handle.x_handle in directory) {
          return {
            ...handle,
            threads_exists: true,
            // @ts-ignore
            threads_name: directory[handle.x_handle].threads_name,
            // @ts-ignore
            threads_handle: directory[handle.x_handle].threads_handle,
          }
        } else {
          const threadsData = await checkThreadsHandle(handle.x_handle)
          console.log(threadsData)
          if (threadsData && threadsData.threads_exists) {
            return {
              ...handle,
              threads_exists: true,
              threads_name: threadsData.threads_name
                ? threadsData.threads_name
                : "",
              threads_handle: handle.x_handle,
            }
          }
          return {
            ...handle,
            threads_exists: false,
            threads_name: "",
            threads_handle: "",
          }
        }
      })
    )
    console.log(updatedHandles)
    setHandles(updatedHandles)
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 max-w-[900px] mx-auto">
      <h1 className="text-4xl font-bold mb-6">Public Directory</h1>
      <p className="mb-3">
        Paste in X(Twitter) handles to find them on Threads and elsewhere on the
        web:
      </p>
      <p className="text-sm">
        You don&apos;t have to format the handles in any way. Raw text or HTML
        is totally fine.
      </p>
      <p className="mb-6 text-sm">
        As long as the handles have an @ in front of them, just paste it in.
      </p>
      <textarea
        className="w-full max-w-lg p-4 mb-4 border rounded-md h-auto"
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
            <TableHead className="text-slate-900">Threads Name</TableHead>
            <TableHead className="text-slate-900">Threads Handle</TableHead>
            <TableHead className="text-slate-900">Follow on Threads</TableHead>
            {/* <TableHead className="text-slate-900">Actions</TableHead> */}
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
                {handle.threads_name ? <>{handle.threads_name}</> : ""}
              </TableCell>
              <TableCell>
                {handle.threads_exists ? (
                  <a
                    className="underline text-blue-600"
                    href={`https://www.threads.net/@${handle.threads_handle}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    @{handle.threads_handle}
                  </a>
                ) : (
                  "not found"
                )}
              </TableCell>
              <TableCell>
                {handle.threads_exists ? (
                  <a
                    className="inline-block px-4 py-2 border rounded text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                    href={`https://www.threads.net/@${handle.threads_handle}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Follow
                  </a>
                ) : (
                  ""
                )}
              </TableCell>
              {/*<TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="font-normal">
                      {handle.threads_exists ? (
                        <>
                          <Pencil size={16} className="mr-2" />
                          <span>Edit</span>
                        </>
                      ) : (
                        <>
                          <Plus size={16} className="mr-2" />
                          <span>Add</span>
                        </>
                      )}
                      &nbsp;Theads
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {handle.threads_exists ? "Edit" : "Add"} Threads handle
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-6 items-center gap-4">
                        <Label
                          htmlFor="x_handle"
                          className="text-right col-span-2"
                        >
                          X(Twitter) Handle
                        </Label>
                        <p className="col-span-4 text-sm ml-3">
                          {handle.x_handle}
                        </p>
                      </div>

                      <div className="grid grid-cols-6 items-center gap-4">
                        <Label
                          htmlFor="threads_handle"
                          className="text-right col-span-2"
                        >
                          Threads Handle
                        </Label>
                        <Input
                          id="threads_handle"
                          value={handle.threads_handle}
                          className="col-span-4"
                        />
                      </div>
                      <div className="grid grid-cols-6 items-center gap-4">
                        <Label
                          htmlFor="threads_name"
                          className="text-right col-span-2"
                        >
                          Threads Name (optional)
                        </Label>
                        <Input
                          id="threads_name"
                          value={handle.threads_name}
                          className="col-span-4"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Close
                        </Button>
                      </DialogClose>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell> */}
              {/* <TableCell>{handle.other}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-8">
        <a
          href="https://github.com/publicdirectory/publicdirectory"
          target="_blank"
          className="underline text-blue-600"
        >
          Github code
        </a>
        . Made with ❤️ by{" "}
        <a
          href="https://www.threads.net/@philtsip"
          target="_blank"
          className="underline text-blue-600"
        >
          philtsip
        </a>{" "}
        in NYC
      </p>
    </div>
  )
}

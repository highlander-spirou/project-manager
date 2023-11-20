/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ContextProvider } from '../ctx'
import { useContext } from "react"

export function DataTablePagination() {

  const ctx = useContext(ContextProvider)

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${ctx!.limit}`}
            onValueChange={(value) => {
              ctx!.setLimit(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={ctx!.limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => ctx!.setPage((old: number) => old === 1 ? old : old - 1)}
            disabled={ctx!.page === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center text-sm font-medium">
            {ctx!.page}
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => ctx!.setPage((old: number) => old + 1)}
            disabled={ctx?.data.length < ctx?.limit!}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div >
  )
}
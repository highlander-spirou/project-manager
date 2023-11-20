import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from './column-header'
import { PriorityBadge } from './priority-badge'
import Progress from "./progress"

export type Task = {
  id: number
  created_at: string
  status: number
  priority: number
  title: string
  date_diff: number
}


export const columns: ColumnDef<Task>[] = [
  {
    id: "created_at",
    header: "Created at",
    cell: ({ row }) => (<p className="font-semibold">{row.original.created_at}</p>)
  },
  {
    id: "date_diff",
    header: "Date diff",
    cell: ({ row }) => (<p className="font-semibold">{row.original.date_diff}</p>)
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (<Progress tracking={row.original.status}/>)

  },
  {
    accessorKey: "priority",
    header: () => {
      return <DataTableColumnHeader column="priority" title="Priority" />
    },
    cell: ({ row }) => (<PriorityBadge priority={row.original.priority} rowID={row.original.id} />)
    // cell: ({ row }) => (<p>{getPriorityLabel(row.original.priority)}</p>)
  },
]
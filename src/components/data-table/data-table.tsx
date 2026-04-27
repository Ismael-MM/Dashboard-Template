"use client"

import * as XLSX from 'xlsx'
import Papa from 'papaparse'

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DownloadIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  Plus,
} from "lucide-react";

import { useState, type ReactNode } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title: string
  addLabel?: string
  onAdd?: () => void
  renderRowActions?: (row: TData) => ReactNode
  pageCount?: number
  pagination?: { pageIndex: number; pageSize: number }
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
  onSortingChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  addLabel = "Add",
  onAdd,
  renderRowActions,
  pageCount,
  pagination,
  onPaginationChange,
  onSortingChange,
  isLoading,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])
  const hasActions = Boolean(renderRowActions)

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: { sorting,
      pagination: pagination ?? { pageIndex: 0, pageSize: 10},
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(next);
      if (next.length > 0) {
        onSortingChange?.(next[0].id, next[0].desc ? 'desc' : 'asc');
      }
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function'
        ? updater(pagination ?? { pageIndex: 0, pageSize: 10 })
        : updater;
      onPaginationChange?.(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  })

  const exportToCSV = () => {
    const selectedRows = table.getSelectedRowModel().rows

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map(row => row.original)
        : table.getFilteredRowModel().rows.map(row => row.original)

    const csv = Papa.unparse(dataToExport, {
      header: true
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${title}-export-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    const selectedRows = table.getSelectedRowModel().rows

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map(row => row.original)
        : table.getFilteredRowModel().rows.map(row => row.original)

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments')

    const cols = [{ wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 15 }]

    worksheet['!cols'] = cols

    XLSX.writeFile(workbook, `${title}-export-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportToJSON = () => {
    const selectedRows = table.getSelectedRowModel().rows

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map(row => row.original)
        : table.getFilteredRowModel().rows.map(row => row.original)

    const json = JSON.stringify(dataToExport, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${title}-export-${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {onAdd ? (
            <Button
              onClick={onAdd}
              className='w-full border border-sky-400 bg-sky-600/10 text-sky-600 hover:bg-sky-600/20 focus-visible:ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-400 dark:hover:bg-sky-400/20 dark:focus-visible:ring-sky-400/40 sm:w-auto'
            >
              <Plus className='mr-1' />
              {addLabel}
            </Button>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className="w-full sm:w-auto">
                <DownloadIcon className='mr-2' />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={exportToCSV}>
                <FileTextIcon className='mr-2 size-4' />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                <FileSpreadsheetIcon className='mr-2 size-4' />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportToJSON}>
                <FileTextIcon className='mr-2 size-4' />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Table className="min-w-180">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc" && (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  )}
                  {header.column.getIsSorted() === "desc" && (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  )}
                </TableHead>
              ))}

              {hasActions ? (
                <TableHead
                  key={`${headerGroup.id}-actions`}
                  className="bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6"
                >
                  Actions
                </TableHead>
              ) : null}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-gray-50 even:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}

              {hasActions ? (
                <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">
                  {renderRowActions?.(row.original)}
                </TableCell>
              ) : null}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="px-6 py-10 text-center text-sm text-muted-foreground"
              >
                No records to display.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination controls */}
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="text-center text-sm text-muted-foreground sm:flex-1 sm:text-left">
          {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()} pages
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[88px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

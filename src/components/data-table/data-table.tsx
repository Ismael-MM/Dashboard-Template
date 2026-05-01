"use client"

import * as XLSX from 'xlsx'
import Papa from 'papaparse'

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, type ReactNode } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title: string
  addLabel?: string
  onAdd?: () => void
  renderRowActions?: (row: TData) => ReactNode
  renderFilters?: ReactNode
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
  renderFilters,
  pageCount,
  pagination,
  onPaginationChange,
  onSortingChange,
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
    <div className="w-full space-y-4">
      <div className="rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">{title}</h1>
            {renderFilters}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            {onAdd ? (
              <Button
                onClick={onAdd}
                className='group w-full bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-all sm:w-auto'
              >
                <Plus className='mr-2 h-4 w-4 transition-transform group-hover:rotate-90' />
                {addLabel}
              </Button>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 sm:w-auto">
                  <DownloadIcon className='mr-2 h-4 w-4' />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={exportToCSV} className='cursor-pointer'>
                  <FileTextIcon className='mr-2 size-4' />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel} className='cursor-pointer'>
                  <FileSpreadsheetIcon className='mr-2 size-4' />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToJSON} className='cursor-pointer'>
                  <FileTextIcon className='mr-2 size-4' />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table className="min-w-180">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-slate-50/50 hover:bg-transparent border-b-slate-200">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="h-11 cursor-pointer px-6 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:text-slate-800"
                    >
                      <div className='flex'>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" && (
                          <ArrowUp className="ml-1 h-3 w-3" />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <ArrowDown className="ml-1 h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                  ))}

                  {hasActions ? (
                    <TableHead
                      key={`${headerGroup.id}-actions`}
                      className="bg-slate-50/50 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500"
                    >
                      Actions
                    </TableHead>
                  ) : null}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b-slate-100 hover:bg-white/80 transition-colors duration-200">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4 text-sm text-black">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}

                  {hasActions ? (
                    <TableCell className="px-6 py-4">
                      {renderRowActions?.(row.original)}
                    </TableCell>
                  ) : null}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="h-32 text-center text-slate-400"
                  >
                    No records to display.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination controls */}
          <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              Página <span className="font-medium text-slate-700">{table.getState().pagination.pageIndex + 1}</span> de{" "}
              <span className="font-medium text-slate-700">{table.getPageCount()}</span>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Selector de filas por página */}
              <div className="hidden items-center gap-2 sm:flex">
                <p className="text-sm font-medium text-slate-500">Filas</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(v) => table.setPageSize(Number(v))}
                >
                  <SelectTrigger className="h-8 w-[70px] border-slate-200 bg-transparent text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 50].map((size) => (
                      <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Controles de navegación */}
              <div className="flex items-center space-x-1">
                {/* IR AL PRINCIPIO */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-900"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* ANTERIOR */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-900"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* SIGUIENTE */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-900"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* IR AL FINAL */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-900"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

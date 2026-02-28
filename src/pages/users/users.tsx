"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@tanstack/react-table";

// Define a type for the user data
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Example data
const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "User",
  },
];

// Define columns
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];

export default function UsersPage() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={users} title="Users Table" />
    </div>
  );
}

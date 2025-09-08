import { Button, Table, TableData } from "@mantine/core";
import type { RowData } from "../types";

interface ListTabProps {
  rows: RowData[];
  loading: boolean;
  onRefresh: () => void | Promise<void>;
  onEdit: (id: number) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
}

export default function ListTab({
  rows,
  loading,
  onRefresh,
  onEdit,
  onDelete,
}: ListTabProps) {
  if (loading) return <p>Loading…</p>;
  if (!rows.length)
    return (
      <div>
        <p>No properties here</p>
        <Button onClick={onRefresh}>Refresh</Button>
      </div>
    );
  const tableData: TableData = {
    caption: "Real Estate Admin",
    head: ["ID", "Name", "Type", "City", "Country", ""],
    body: [
      ...rows.map((r) => [
        r.id,
        r.name,
        r.type,
        r.city,
        r.country,
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => onEdit(r.id)}>Edit</Button>
          <Button onClick={() => onDelete(r.id)}>Delete</Button>
        </div>,
      ]),
    ],
  };
  return <Table data={tableData} />;
}

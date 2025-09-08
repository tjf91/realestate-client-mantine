import "@mantine/core/styles.css";
import { MantineProvider, Modal } from "@mantine/core";
import { theme } from "./theme";
import { useEffect, useState } from "react";
import { api } from "./api";
import type { RowData, RealEstate, Tab } from "./types";
import TabButton from "./components/TabButton";
import ListTab from "./components/ListTab";
import FormTab from "./components/FormTab";

export default function App() {
  const [tab, setTab] = useState<Tab>("list");
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selected, setSelected] = useState<RealEstate | null>(null);
  const [toast, setToast] = useState<string>("");
  console.log("selected", selected);
  const loadList = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await api.get<RowData[]>("/properties");
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  const loadOneProperty = async (id: number): Promise<void> => {
    setSelected(null);
    const { data } = await api.get<RealEstate>(`/properties/${id}`);
    setSelected(data);
  };

  useEffect(() => {
    loadList();
  }, []);

  const onEdit = async (id: number): Promise<void> => {
    setSelectedId(id);
    await loadOneProperty(id);
    setTab("edit");
  };

  const onDelete = async (id: number): Promise<void> => {
    if (!confirm("Soft-delete this property?")) return;
    await api.delete(`/properties/${id}`);
    setToast(`Deleted #${id}`);
    await loadList();
    setTab("list");
  };

  const editSubmit = async (payload: Partial<RealEstate>): Promise<void> => {
    const { data } = await api.patch<RealEstate>(
      `/properties/${selectedId}`,
      payload,
    );
    console.log(" data", data);
    setToast(`Saved #${data.id}`);
    await loadList();
    setTab("list");
  };
  const createSubmit = async (payload: Partial<RealEstate>): Promise<void> => {
    const { data } = await api.post<RealEstate>("/properties", payload);
    setToast(`Created #${data.id}`);
    await loadList();
    setSelectedId(data.id);
    setSelected(data);
    setTab("list");
  };
  return (
    <MantineProvider theme={theme}>
      <Modal opened={tab === "create"} onClose={() => setTab("list")}>
        <FormTab key="create" submitLabel="Create" onSubmit={createSubmit} />
      </Modal>
      <Modal opened={tab === "edit"} onClose={() => setTab("list")}>
        <FormTab
          key={`edit-${selectedId}`}
          initial={selected}
          submitLabel="Save"
          onSubmit={editSubmit}
        />
      </Modal>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Real Estate Admin</h1>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <TabButton active={tab === "list"} onClick={() => setTab("list")}>
            List
          </TabButton>
          <TabButton active={tab === "create"} onClick={() => setTab("create")}>
            Create
          </TabButton>
        </div>

        {toast && (
          <div
            style={{
              background: "#e6ffed",
              border: "1px solid #22c55e",
              padding: 8,
              marginBottom: 12,
            }}
          >
            {toast}
          </div>
        )}
        <ListTab
          rows={rows}
          loading={loading}
          onRefresh={loadList}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </MantineProvider>
  );
}

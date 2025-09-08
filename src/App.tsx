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

  const loadList = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await api.get<RowData[]>("/properties");
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  const loadOne = async (id: number): Promise<void> => {
    setSelected(null);
    const { data } = await api.get<RealEstate>(`/properties/${id}`);
    setSelected(data);
  };

  useEffect(() => {
    void loadList();
  }, []);

  const onEdit = async (id: number): Promise<void> => {
    setSelectedId(id);
    await loadOne(id);
    setTab("edit");
  };

  const onDelete = async (id: number): Promise<void> => {
    if (!confirm("Soft-delete this property?")) return;
    await api.delete(`/properties/${id}`);
    setToast(`Deleted #${id}`);
    await loadList();
    setTab("list");
  };
  return (
    <MantineProvider theme={theme}>
      <Modal opened={tab === "create"} onClose={() => setTab("list")}>
        <FormTab
          key="create"
          submitLabel="Create"
          onSubmit={async (payload) => {
            const { data } = await api.post<RealEstate>("/properties", payload);
            setToast(`Created #${data.id}`);
            await loadList();
            setSelectedId(data.id);
            setSelected(data);
            setTab("edit");
          }}
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
          {/* {selectedId && (
            <TabButton active={tab === "edit"} onClick={() => setTab("edit")}>
              Edit #{selectedId}
            </TabButton>
          )} */}
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

        {tab === "list" && (
          <ListTab
            rows={rows}
            loading={loading}
            onRefresh={loadList}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}

        {/* {tab === "create" && (
          <FormTab
            key="create"
            submitLabel="Create"
            onSubmit={async (payload) => {
              const { data } = await api.post<RealEstate>(
                "/properties",
                payload,
              );
              setToast(`Created #${data.id}`);
              await loadList();
              setSelectedId(data.id);
              setSelected(data);
              setTab("edit");
            }}
          />
        )} */}

        {tab === "edit" && selectedId && (
          <FormTab
            key={`edit-${selectedId}`}
            initial={selected}
            submitLabel="Save"
            onSubmit={async (payload) => {
              const { data } = await api.patch<RealEstate>(
                `/properties/${selectedId}`,
                payload,
              );
              setToast(`Saved #${data.id}`);
              await loadList();
              await loadOne(selectedId);
            }}
          />
        )}
      </div>
    </MantineProvider>
  );
}

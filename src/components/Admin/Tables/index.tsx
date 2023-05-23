"use client";

import {
  createStyles,
  Text,
  rem,
  Button,
  Card,
  Badge,
  Select,
  Modal,
  Table,
  TextInput,
} from "@mantine/core";
import { type RouterOutputs, api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Qrcode as QrIcon, Reload } from "tabler-icons-react";
import { Row } from "~/components/Primary";
import QRCode from "react-qr-code";
import { useForm } from "@mantine/form";
import { toast } from "react-hot-toast";
import { TABLES_SORT_BY, buildTableOptions } from "./helper";

type TableWithPtable = RouterOutputs["tables"]["getAll"][number];

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: theme.spacing.xs,
    gap: rem(12),
  },
  filterContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
    padding: theme.spacing.xs,
    gap: rem(12),
    justifyContent: "center",
    alignItems: "flex-end",
  },
}));

const TableCardItem = ({
  table,
  onShowQr,
}: {
  table: TableWithPtable;
  onShowQr: () => void;
}) => {
  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      style={{
        maxWidth: "35%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        opacity: table.open ? 1 : 0.4,
      }}
    >
      <div style={{ flex: 1 }}>
        <Row justify="space-between">
          <Text weight={500}>{table?.identifier}</Text>
          <Badge color="pink" variant="light" style={{ cursor: "pointer" }}>
            {table.pTable.name}
          </Badge>
        </Row>
        <Row justify="center">
          <QrIcon
            size="auto"
            onClick={onShowQr}
            style={{ cursor: "pointer" }}
          />
        </Row>
      </div>
    </Card>
  );
};

const TableItem = ({
  table,
  onShowQr,
}: {
  table: TableWithPtable;
  onShowQr: () => void;
}) => {
  return (
    <tr style={{ opacity: table?.open ? 1 : 0.7 }}>
      <td>
        <QrIcon size="24px" onClick={onShowQr} style={{ cursor: "pointer" }} />
      </td>
      <td>{table?.open ? "open" : "closed"}</td>
      <td>{table?.pTable?.name}</td>
      <td>{table?.identifier}</td>
      <td>{table?.discount}%</td>
      <td>
        <Button>Delete</Button>
        <Button>{table?.open ? "Close" : "Re-open"}</Button>
      </td>
    </tr>
  );
};

export const Tables = () => {
  const [seeAsCards, setSeeAsCards] = useState(true);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const { classes } = useStyles();
  const [openedQr, { open: openQr, close: closeQr }] = useDisclosure(false);
  const [openedForm, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [selectedTable, setSelectedTable] = useState<TableWithPtable>();
  const form = useForm({
    initialValues: {
      identifier: "",
      pTableId: "",
      discount: 0.0,
    },
    transformValues: (values) => ({
      identifier: values.identifier,
      pTableId: Number(values.pTableId),
      discount: Number(values.discount) || 0.0,
    }),
  });
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const ctx = api.useContext();
  const { data: tables, isLoading } = api.tables.getAll.useQuery();
  const { data: pTables } = api.physicalTables.getAll.useQuery();
  const { mutate: createNewTable } = api.tables.create.useMutation({
    onSuccess: () => {
      void ctx.tables.getAll.invalidate();
      toast.success("Table created successfully");
      form.reset();
      closeForm();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });
  const PTABLES_OPTIONS = buildTableOptions(pTables);

  const handleShowTableQr = (table: TableWithPtable) => {
    setSelectedTable(table);
    openQr();
  };
  const handleCreateNewTable = (table: {
    identifier: string;
    pTableId: number;
    discount: number;
  }) => createNewTable(table);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className={classes.filterContainer}>
        <Select
          label="Sort by"
          data={TABLES_SORT_BY}
          value={sortBy}
          onChange={(value: string) => setSortBy(value)}
        />
        <Button onClick={() => setSeeAsCards((curr) => !curr)}>
          See as {seeAsCards ? "table" : "cards"}
        </Button>
        <Button onClick={() => void ctx.tables.getAll.invalidate()}>
          <Reload size={24} strokeWidth={2} color={"white"} />
        </Button>
        <Button onClick={openForm}>Create new</Button>
      </div>
      <div className={classes.container}>
        {seeAsCards ? (
          tables?.map((table) => (
            <TableCardItem
              key={table.id}
              table={table}
              onShowQr={() => handleShowTableQr(table)}
            />
          ))
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <th>Qr code</th>
                  <th>Status</th>
                  <th>PTable Name</th>
                  <th>Identifier</th>
                  <th>Discount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables?.map((table) => (
                  <TableItem
                    key={table.id}
                    table={table}
                    onShowQr={() => handleShowTableQr(table)}
                  />
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>
      <Modal
        opened={openedQr}
        onClose={closeQr}
        title={`${
          selectedTable?.identifier || selectedTable?.pTable.name || "table"
        } QR`}
        centered
      >
        {selectedTable && (
          <QRCode
            size={256}
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%",
              border: "12px solid white",
            }}
            value={`${origin}/menu/${selectedTable.token}`}
            viewBox={`0 0 256 256`}
          />
        )}
      </Modal>
      <Modal opened={openedForm} onClose={closeForm} title="Create new table">
        <form
          onSubmit={form.onSubmit((values) => handleCreateNewTable(values))}
        >
          <TextInput
            label="Identifier"
            placeholder="Enter a identifier"
            {...form.getInputProps("identifier")}
          />
          <TextInput
            mt="md"
            label="Discount"
            placeholder="Discount between 0 and 100"
            type="number"
            min={0}
            max={100}
            {...form.getInputProps("discount")}
          />
          <Select
            label="Physical table"
            data={PTABLES_OPTIONS}
            value={...form.getInputProps("pTableId").value}
            onChange={...form.getInputProps("pTableId").onChange}
            style={{ marginTop: "1.8rem" }}
          />
          <Row justify="center">
            <Button type="submit" mt="md">
              Create
            </Button>
          </Row>
        </form>
      </Modal>
    </>
  );
};

"use client";

import {
  createStyles,
  Text,
  rem,
  Button,
  Card,
  Badge,
  Modal,
} from "@mantine/core";
import { type RouterOutputs, api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Qrcode as QrIcon, Reload } from "tabler-icons-react";
import { Row } from "~/components/Primary";
import QRCode from "react-qr-code";

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

const TableItem = ({
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

export const Tables = () => {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTable, setSelectedTable] = useState<TableWithPtable>();
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const ctx = api.useContext();
  const { data: tables, isLoading } = api.tables.getAll.useQuery();

  const handleShowTableQr = (table: TableWithPtable) => {
    setSelectedTable(table);
    open();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className={classes.filterContainer}>
        {/* <Select
          label="Sort by"
          data={tableS_SORT_BY}
          value={sortBy}
          onChange={(value: string) => setSortBy(value)}
        /> */}
        <Button onClick={() => void ctx.tables.getAll.invalidate()}>
          <Reload size={24} strokeWidth={2} color={"white"} />
        </Button>
      </div>
      <div className={classes.container}>
        {tables?.map((table) => (
          <TableItem
            key={table.id}
            table={table}
            onShowQr={() => handleShowTableQr(table)}
          />
        ))}
      </div>
      <Modal opened={opened} onClose={close} title="Edit order" centered>
        {selectedTable && (
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={`${origin}/menu/${selectedTable.token}`}
            viewBox={`0 0 256 256`}
          />
        )}
      </Modal>
    </>
  );
};

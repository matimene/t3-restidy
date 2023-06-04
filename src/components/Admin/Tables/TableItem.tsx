import { Text, rem, Button, Card, Badge } from "@mantine/core";
import { type RouterOutputs } from "~/utils/api";
import { Qrcode as QrIcon, Trash } from "tabler-icons-react";
import { Row } from "~/components/Primary";

type TableWithPtable = RouterOutputs["tables"]["getAll"][number];

export const TableCardItem = ({
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

export const TableItem = ({
  table,
  onShowQr,
  onToggleOpen,
}: {
  table: TableWithPtable;
  onShowQr: () => void;
  onToggleOpen: () => void;
}) => {
  return (
    <tr style={{ opacity: table?.open ? 1 : 0.7 }}>
      <td>
        <QrIcon
          size="24px"
          onClick={() => (table?.open ? onShowQr() : "")}
          style={{
            cursor: table?.open ? "pointer" : "not-allowed",
            marginLeft: rem(12),
          }}
        />
      </td>
      <td>{table?.open ? "Open" : "Closed"}</td>
      <td>{table?.pTable?.name}</td>
      <td>{table?.identifier}</td>
      <td>{table?.discount}%</td>
      <td style={{ display: "flex", gap: 12 }}>
        <Button
          onClick={onToggleOpen}
          color={table?.open ? "black" : "green"}
          style={{ minWidth: rem(100) }}
        >
          {table?.open ? "Close" : "Re-open"}
        </Button>
        <Button color="red">
          <Trash size={24} strokeWidth={1.5} color={"white"} />
        </Button>
      </td>
    </tr>
  );
};

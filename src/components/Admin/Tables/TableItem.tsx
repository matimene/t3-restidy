import { Text, rem, Button, Card, Badge } from "@mantine/core";
import { type RouterOutputs } from "~/utils/api";
import { Qrcode as QrIcon } from "tabler-icons-react";
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
        <QrIcon size="24px" onClick={onShowQr} style={{ cursor: "pointer" }} />
      </td>
      <td>{table?.open ? "open" : "closed"}</td>
      <td>{table?.pTable?.name}</td>
      <td>{table?.identifier}</td>
      <td>{table?.discount}%</td>
      <td>
        <Row gap={12}>
          <Button>Delete</Button>
          <Button
            onClick={onToggleOpen}
            color={table?.open ? "orange" : "green"}
            style={{ minWidth: rem(100) }}
          >
            {table?.open ? "Close" : "Re-open"}
          </Button>
        </Row>
      </td>
    </tr>
  );
};

import { rem, Button } from "@mantine/core";
import { Edit } from "tabler-icons-react";
import { type PhysicalTable } from "@prisma/client";

const PhysicalTableItem = ({
  pTable,
  onEdit,
  onToggleActive,
}: {
  pTable: PhysicalTable;
  onEdit: () => void;
  onToggleActive: () => void;
}) => {
  return (
    <tr style={{ opacity: pTable?.active ? 1 : 0.7 }}>
      <td>{pTable?.active ? "Active" : "Disabled"}</td>
      <td>{pTable?.name}</td>
      <td style={{ display: "flex", gap: 12 }}>
        <Button onClick={onEdit}>
          <Edit size={24} strokeWidth={1.5} color={"white"} />
        </Button>
        <Button
          onClick={onToggleActive}
          color={pTable?.active ? "red" : "green"}
          style={{ minWidth: rem(100) }}
        >
          {pTable?.active ? "Disable" : "Enable"}
        </Button>
      </td>
    </tr>
  );
};

export default PhysicalTableItem;

"use client";

import { createStyles, Button, Table, rem, Text } from "@mantine/core";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Reload } from "tabler-icons-react";
import { PhysicalTablesModals } from "./Modal";
import PhysicalTableItem from "./PhysicalTableItem";
import { Row } from "~/components/Primary";
import { type PhysicalTable } from "@prisma/client";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: theme.spacing.xs,
    gap: rem(12),
  },
  filterContainer: {
    width: "100%",
    display: "flex",
    gap: rem(12),
    alignItems: "center",
    flexDirection: "column",
  },
}));

const PhysicalTables = () => {
  const { classes } = useStyles();
  const [openedForm, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [selectedPTable, setSelectedPTable] = useState<PhysicalTable>();

  const ctx = api.useContext();
  const { data: pTables, isLoading } = api.physicalTables.getAll.useQuery();
  const { mutate: editActive } = api.physicalTables.edit.useMutation({
    onSuccess: () => {
      void ctx.physicalTables.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });

  const handleToggleActive = (values: {
    active: boolean;
    id: number;
    name: string;
  }) => editActive(values);

  const handleEdit = (pTable: PhysicalTable) => {
    setSelectedPTable(pTable);
    openForm();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Row align="center" justify="center">
        <Text transform="uppercase" weight={600} size={24}>
          Physical Tables
        </Text>
      </Row>
      <div className={classes.filterContainer}>
        <Row gap={12} align="flex-end">
          <Button onClick={() => void ctx.physicalTables.getAll.invalidate()}>
            <Reload size={24} strokeWidth={1.5} color={"white"} />
          </Button>
          <Button onClick={openForm}>Create new</Button>
        </Row>
      </div>
      <div className={classes.container}>
        <Table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Name</th>
              <th style={{ width: rem(250) }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pTables?.map((pTable) => (
              <PhysicalTableItem
                key={pTable.id}
                pTable={pTable}
                onToggleActive={() =>
                  handleToggleActive({
                    id: pTable.id,
                    active: !pTable.active,
                    name: pTable.name,
                  })
                }
                onEdit={() => handleEdit(pTable)}
              />
            ))}
          </tbody>
        </Table>
      </div>
      <PhysicalTablesModals
        selectedPhysicalTable={selectedPTable}
        isOpen={openedForm}
        onClose={() => {
          closeForm();
          setSelectedPTable(undefined);
        }}
      />
    </>
  );
};

export default PhysicalTables;

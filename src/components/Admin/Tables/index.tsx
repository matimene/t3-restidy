"use client";

import { createStyles, Button, Select, Table, rem, Text } from "@mantine/core";
import { type RouterOutputs, api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Reload } from "tabler-icons-react";
import { TABLES_SORT_BY } from "./helper";
import { TablesModals } from "./Modals";
import { TableCardItem, TableItem } from "./TableItem";
import { Row } from "~/components/Primary";

type TableWithPtable = RouterOutputs["tables"]["getAll"][number];

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

const Tables = () => {
  const [seeAsCards, setSeeAsCards] = useState(true);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const { classes } = useStyles();
  const [openedQr, { open: openQr, close: closeQr }] = useDisclosure(false);
  const [openedForm, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [selectedTable, setSelectedTable] = useState<TableWithPtable>();

  const ctx = api.useContext();
  const { data: tables, isLoading } = api.tables.getAll.useQuery({ sortBy });
  const { mutate: editTableOpen } = api.tables.editTableOpen.useMutation({
    onSuccess: () => {
      void ctx.tables.getAll.invalidate(); // TODO: do smt better here
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });

  const handleShowTableQr = (table: TableWithPtable) => {
    setSelectedTable(table);
    openQr();
  };
  const handleToggleOpen = (table: { open: boolean; id: number }) =>
    editTableOpen(table);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Row align="center" justify="center">
        <Text transform="uppercase" weight={600} size={24}>
          Tables
        </Text>
      </Row>
      <div className={classes.filterContainer}>
        <Row gap={12} align="flex-end">
          <Select
            label="Sort by"
            data={TABLES_SORT_BY}
            value={sortBy}
            onChange={(value: string) => setSortBy(value)}
          />
          <Button onClick={() => void ctx.tables.getAll.invalidate()}>
            <Reload size={24} strokeWidth={1.5} color={"white"} />
          </Button>
        </Row>
        <Row gap={12}>
          <Button onClick={() => setSeeAsCards((curr) => !curr)}>
            See as {seeAsCards ? "table" : "cards"}
          </Button>
          <Button onClick={openForm}>Create new</Button>
        </Row>
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
                  <th style={{ width: rem(250) }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables?.map((table) => (
                  <TableItem
                    key={table.id}
                    table={table}
                    onShowQr={() => handleShowTableQr(table)}
                    onToggleOpen={() =>
                      handleToggleOpen({ open: !table.open, id: table.id })
                    }
                  />
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>
      <TablesModals
        selectedTable={selectedTable}
        isOpenQr={openedQr}
        isOpenForm={openedForm}
        onCloseFormModal={closeForm}
        onCloseQrModal={closeQr}
      />
    </>
  );
};

export default Tables;

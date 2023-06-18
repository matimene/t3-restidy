import { Button, Select, Modal, TextInput, Text } from "@mantine/core";
import { type RouterOutputs, api } from "~/utils/api";
import { Row } from "~/components/Primary";
import QRCode from "react-qr-code";
import { useForm } from "@mantine/form";
import { toast } from "react-hot-toast";
import { buildTableOptions } from "./helper";
import Link from "next/link";

type TableWithPtable = RouterOutputs["tables"]["getAll"][number];

export const TablesModals = ({
  selectedTable,
  isOpenQr,
  isOpenForm,
  onCloseFormModal,
  onCloseQrModal,
}: {
  selectedTable?: TableWithPtable;
  isOpenQr: boolean;
  isOpenForm: boolean;
  onCloseFormModal: () => void;
  onCloseQrModal: () => void;
}) => {
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
  const { data: pTables } = api.physicalTables.getAll.useQuery();
  const { mutate: createNewTable } = api.tables.create.useMutation({
    onSuccess: () => {
      void ctx.tables.getAll.invalidate();
      toast.success("Table created successfully");
      form.reset();
      onCloseFormModal();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });
  const PTABLES_OPTIONS = buildTableOptions(pTables);

  const handleCreateNewTable = (table: {
    identifier: string;
    pTableId: number;
    discount: number;
  }) => createNewTable(table);

  return (
    <>
      <Modal
        opened={isOpenQr}
        onClose={onCloseQrModal}
        title={`${
          selectedTable?.identifier || selectedTable?.pTable.name || "table"
        } QR`}
        centered
      >
        {selectedTable && (
          <>
            <QRCode
              size={256}
              style={{
                height: "auto",
                maxWidth: "100%",
                width: "100%",
                border: "12px solid white",
              }}
              value={`${origin}/menu?token=${selectedTable.token}`}
              viewBox={`0 0 256 256`}
            />
            <Text align="center" size={20} mt={12}>
              <Link
                href={`${origin}/menu?token=${selectedTable.token}`}
                target="_blank"
              >
                Open
              </Link>
            </Text>
          </>
        )}
      </Modal>
      <Modal
        opened={isOpenForm}
        onClose={onCloseFormModal}
        title="Create new table"
      >
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

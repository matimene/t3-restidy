import { Button, Modal, TextInput } from "@mantine/core";
import { api } from "~/utils/api";
import { Row } from "~/components/Primary";
import { useForm } from "@mantine/form";
import { toast } from "react-hot-toast";
import { type PhysicalTable } from "@prisma/client";
import BooleanChip from "~/components/Primary/BooleanChip";
import { useEffect } from "react";

export const PhysicalTablesModals = ({
  selectedPhysicalTable,
  isOpen,
  onClose,
}: {
  selectedPhysicalTable?: PhysicalTable;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const isNew = !selectedPhysicalTable;
  const form = useForm({
    initialValues: {
      active: true,
      name: "",
    },
  });
  const ctx = api.useContext();
  const { mutate: createNew } = api.physicalTables.create.useMutation({
    onSuccess: () => {
      void ctx.physicalTables.getAll.invalidate();
      toast.success("Created successfully!");
      form.reset();
      onClose();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });
  const { mutate: edit } = api.physicalTables.edit.useMutation({
    onSuccess: () => {
      void ctx.physicalTables.getAll.invalidate();
      toast.success("Edited successfully!");
      form.reset();
      onClose();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });

  useEffect(() => {
    selectedPhysicalTable && form.setValues(selectedPhysicalTable);

    return () => {
      form.reset();
    };
  }, [selectedPhysicalTable]);

  const handleSubmitForm = (pTable: { active: boolean; name: string }) =>
    isNew
      ? createNew(pTable)
      : edit({ ...pTable, id: selectedPhysicalTable.id });

  return (
    <Modal opened={isOpen} onClose={onClose} title="Create new">
      <form onSubmit={form.onSubmit((values) => handleSubmitForm(values))}>
        <TextInput
          mt="sm"
          mb="sm"
          label="Name"
          placeholder="Physical table name"
          {...form.getInputProps("name")}
        />
        <BooleanChip {...form.getInputProps("active")} />
        <Row justify="center">
          <Button type="submit" mt="sm">
            {isNew ? "Create" : "Save"}
          </Button>
        </Row>
      </form>
    </Modal>
  );
};

import { TextInput, Button, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";
import { type Item } from "@prisma/client";
import { Row } from "~/components/Primary";

type NewItem = Omit<Item, "id">;
type GenericObject = Record<string, string | number>;

const ProductForm = ({
  disabled,
  onSubmit,
  submitLabel,
  defaultValues,
}: {
  disabled: boolean;
  onSubmit: (body: any) => void;
  submitLabel: string;
  defaultValues?: Item;
}) => {
  const [newBody, setNewBody] = useState<
    Item | NewItem | GenericObject | undefined
  >(defaultValues);

  const handleEditField = (key: string, value: any) =>
    setNewBody((curr) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { ...curr, [key]: value };
    });

  useEffect(() => {
    setNewBody(defaultValues);
  }, [defaultValues]);

  return (
    <>
      <TextInput
        label="SKU"
        maxLength={190}
        value={newBody?.sku || ""}
        onChange={({ target }) => handleEditField("sku", target?.value)}
      />
      <TextInput
        label="Image URL"
        maxLength={255}
        value={newBody?.img || ""}
        onChange={({ target }) => handleEditField("img", target?.value)}
      />
      <TextInput
        label="Title (ENG)"
        maxLength={255}
        value={newBody?.titleEn || ""}
        onChange={({ target }) => handleEditField("titleEn", target?.value)}
      />
      <TextInput
        label="Title (SPA)"
        maxLength={255}
        value={newBody?.titleEs || ""}
        onChange={({ target }) => handleEditField("titleEs", target?.value)}
      />
      <Textarea
        label="Description (ENG)"
        maxLength={500}
        autosize
        minRows={2}
        value={newBody?.descriptionEn || ""}
        onChange={({ target }) =>
          handleEditField("descriptionEn", target?.value)
        }
      />
      <Textarea
        label="Description (SPA)"
        maxLength={500}
        autosize
        minRows={2}
        value={newBody?.descriptionEs || ""}
        onChange={({ target }) =>
          handleEditField("descriptionEs", target?.value)
        }
      />
      <TextInput
        label="Category codes"
        maxLength={255}
        value={newBody?.categoryCodes || ""}
        onChange={({ target }) =>
          handleEditField("categoryCodes", target?.value)
        }
      />
      <TextInput
        label="Price"
        type="number"
        value={newBody?.price || ""}
        onChange={({ target }) =>
          handleEditField("price", parseFloat(target?.value))
        }
      />
      <Row justify="center" marginTop={12}>
        <Button uppercase disabled={disabled} onClick={() => onSubmit(newBody)}>
          {submitLabel}
        </Button>
      </Row>
    </>
  );
};

export default ProductForm;

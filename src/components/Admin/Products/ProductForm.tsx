import { TextInput, Button } from "@mantine/core";
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
        value={newBody?.sku || ""}
        onChange={({ target }) => handleEditField("sku", target?.value)}
      />
      <TextInput
        label="Image URL"
        value={newBody?.img || ""}
        onChange={({ target }) =>
          target?.value && handleEditField("img", target?.value)
        }
      />
      <TextInput
        label="Title (ENG)"
        value={newBody?.titleEn || ""}
        onChange={({ target }) => handleEditField("titleEn", target?.value)}
      />
      <TextInput
        label="Title (SPA)"
        value={newBody?.titleEs || ""}
        onChange={({ target }) => handleEditField("titleEs", target?.value)}
      />
      <TextInput
        label="Description (ENG)"
        value={newBody?.descriptionEn || ""}
        onChange={({ target }) =>
          handleEditField("descriptionEn", target?.value)
        }
      />
      <TextInput
        label="Description (SPA)"
        value={newBody?.descriptionEs || ""}
        onChange={({ target }) =>
          handleEditField("descriptionEs", target?.value)
        }
      />
      <TextInput
        label="Category codes"
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

import { Image, rem, Button } from "@mantine/core";
import { type Item } from "@prisma/client";
import { Edit } from "tabler-icons-react";
import { ActionsContainer, TwoLineLable } from "~/components/Primary";

const ItemProduct = ({
  item,
  onToggleActive,
  onEdit,
}: {
  item: Item;
  onEdit: () => void;
  onToggleActive: () => void;
}) => {
  return (
    <tr style={{ opacity: item.active ? 1 : 0.7 }}>
      <td>{item.sku}</td>
      <td>{item.active ? "active" : "disabled"}</td>
      <td>
        {item?.img ? (
          <Image
            styles={{
              image: {
                maxHeight: rem(48),
              },
            }}
            alt="product image"
            radius="sm"
            fit="cover"
            src={item.img}
          />
        ) : (
          ""
        )}
      </td>
      <td>{item?.titleEn}</td>
      <td>{item?.titleEs}</td>
      <td>
        <TwoLineLable>{item?.descriptionEn}</TwoLineLable>
      </td>
      <td>
        <TwoLineLable>{item?.descriptionEs}</TwoLineLable>
      </td>
      <td>{item?.categoryCodes}</td>
      <td>{item?.price}</td>
      <td>
        <ActionsContainer>
          <Button onClick={onEdit}>
            <Edit size={24} strokeWidth={1.5} color={"white"} />
          </Button>
          <Button
            onClick={onToggleActive}
            color={item?.active ? "red" : "green"}
            style={{ minWidth: rem(100) }}
          >
            {item?.active ? "Disable" : "Enable"}
          </Button>
        </ActionsContainer>
      </td>
    </tr>
  );
};

export default ItemProduct;

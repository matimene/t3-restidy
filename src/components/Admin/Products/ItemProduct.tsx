import { Image, rem, Button } from "@mantine/core";
import { type Item } from "@prisma/client";

const ItemProduct = ({
  item,
  onToggleActive,
}: {
  item: Item;
  onToggleActive: () => void;
}) => {
  return (
    <tr style={{ opacity: item.active ? 1 : 0.7 }}>
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
      <td>{item.active ? "active" : "closed"}</td>
      <td>{item.sku}</td>
      <td>{item?.titleEn}</td>
      <td>{item?.titleEs}</td>
      <td>{item?.descriptionEn}</td>
      <td>{item?.descriptionEs}</td>
      <td>{item?.categoryCodes}</td>
      <td>
        <Button
          onClick={onToggleActive}
          color={item?.active ? "orange" : "green"}
          style={{ minWidth: rem(100) }}
        >
          {item?.active ? "Disable" : "Enable"}
        </Button>
      </td>
    </tr>
  );
};

export default ItemProduct;

import {
  createStyles,
  rem,
  Loader,
  Image,
  Modal,
  Button,
  Tabs,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Category, type Item } from "@prisma/client";
import { useState } from "react";
import { getProductLocaleProps } from "~/utils/helpers";

const useStyles = createStyles((theme) => ({
  container: {
    maxWidth: rem(1024),
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: theme.radius.sm,
  },
  itemWrapper: {
    padding: theme.spacing.xs,
    height: "min-content",
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderBottom: `1px dashed ${theme.colors.gray[7]};`,
  },
  imgWrapper: {
    width: rem(120),
    // height: "-webkit-fill-available",
    marginRight: theme.spacing.xs,
  },
  dataWrapper: {
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: "white",
  },
  desc: {},
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xxs,
  },
  price: {
    fontSize: 24,
    color: theme.colors.yellow[6],
    textAlign: "right",
  },
}));

const Product = (item: Item) => {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);

  const { title, description } = getProductLocaleProps<Item>({
    item,
    keys: ["title", "description"],
  });

  return (
    <>
      <div className={classes.itemWrapper}>
        {item.img && (
          <div className={classes.imgWrapper}>
            <Image
              styles={{
                image: {
                  height: "100%",
                  minHeight: rem(120),
                },
              }}
              miw={120}
              radius="md"
              fit="cover"
              src={item.img}
              alt={item.sku}
              onClick={open}
            />
          </div>
        )}
        <div className={classes.dataWrapper}>
          {title && <div className={classes.title}>{title}</div>}
          {description && <div className={classes.desc}>{description}</div>}
          {item?.price && (
            <div className={classes.actionsContainer}>
              <div className={classes.price}>€{item?.price}</div>
              <Button variant="outline" color="yellow">
                Add to cart
              </Button>
            </div>
          )}
        </div>
      </div>
      <Modal opened={opened} onClose={close} centered withCloseButton={false}>
        <Image
          width="100%"
          radius="md"
          fit="cover"
          src={item.img}
          alt={item.sku}
          styles={{ image: { minHeight: 300 } }}
        />
      </Modal>
    </>
  );
};

type ParsedCategory = {
  name: string;
  code: string;
};
type ItemsListProps = {
  items: Item[] | undefined;
  categories: ParsedCategory[];
  isLoading: boolean;
};

export const ItemsList = ({ items, categories, isLoading }: ItemsListProps) => {
  const { classes } = useStyles();
  const [activeTabCode, setActiveTabCode] = useState<string>(
    categories[0]?.code as string
  );

  if (isLoading) return <Loader />;

  const selectedItems = items?.filter((item) => {
    return item.categoryCodes?.split(";").indexOf(activeTabCode) !== -1;
  });

  return (
    <>
      <Tabs
        color="yellow"
        loop
        defaultValue="gallery"
        value={activeTabCode}
        onTabChange={(v) => v && setActiveTabCode(v)}
        styles={{
          tabsList: {
            flexWrap: "nowrap",
            overflowY: "scroll",
            overflowX: "visible",
          },
        }}
      >
        <Tabs.List position="center">
          {categories?.map((cat) => (
            <Tabs.Tab key={cat.code} value={cat.code}>
              {cat.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
      <div className={classes.container}>
        {selectedItems?.map((item) => (
          <Product key={item.id} {...item} />
        ))}
      </div>
    </>
  );
};

import { createStyles, rem, Loader, Image, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Item } from "@prisma/client";
import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.gray[3],
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
    background: "black", // TODO
    padding: theme.spacing.xs,
    height: "min-content",
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px dashed rgb(187, 187, 187);",
  },
  imgWrapper: {
    flex: 1,
    minHeight: rem(120),
    // height: "-webkit-fill-available",
    width: rem(120),
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
  price: {
    fontSize: 24,
    color: theme.colors.yellow[6],
    textAlign: "right",
    paddingTop: theme.spacing.xxs,
  },
}));

type Locales = "En" | "Es";

function getProductLocaleProps(item: Item, rawLocale = "en") {
  const locale = rawLocale
    .toLowerCase()
    .replace(/\w/, (firstLetter) => firstLetter.toUpperCase()) as Locales;

  return {
    title: item[`title${locale}`] ?? "",
    description: item[`description${locale}`] ?? "",
    tags: item[`tags${locale}`] ?? "",
  };
}

const Product = (item: Item) => {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const { title, description } = getProductLocaleProps(item);

  return (
    <>
      <div className={classes.itemWrapper}>
        {item.img && (
          <div className={classes.imgWrapper}>
            <Image
              styles={{ image: { minHeight: 120 } }}
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
          {item?.price && <div className={classes.price}>€{item?.price}</div>}
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

export const ItemsList = () => {
  const { classes } = useStyles();
  const { data: items, isLoading } = api.items.getAll.useQuery();

  if (isLoading) return <Loader />;

  return (
    <div className={classes.container}>
      {items?.map((item) => (
        <Product key={item.id} {...item} />
      ))}
    </div>
  );
};

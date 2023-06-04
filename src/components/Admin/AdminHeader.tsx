import {
  createStyles,
  Header,
  Menu,
  Group,
  Center,
  Burger,
  Container,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChevronDown, MoodSmileDizzy } from "tabler-icons-react";
import ThemeToggler from "../Primary/ThemeToggler";
import { UserButton } from "@clerk/nextjs";

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,
    borderBottom: 0,
    marginBottom: 24,
  },

  inner: {
    height: rem(56),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    textTransform: "capitalize",
    cursor: "pointer",

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background!,
        0.1
      ),
    },
  },

  linkLabel: {
    marginRight: rem(5),
    textTransform: "capitalize",
    cursor: "pointer",
  },
}));

interface HeaderSearchProps {
  links: {
    key: string;
    label: string;
    onClick?: () => void;
    links?: { label: string; key: string; onClick: () => void }[];
  }[];
}

function AdminHeader({ links }: HeaderSearchProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item
        key={item.key}
        onClick={item.onClick}
        style={{ textTransform: "capitalize" }}
      >
        {item.label}
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <div className={classes.link}>
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <ChevronDown size={12} />
              </Center>
            </div>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <div key={link.key} className={classes.link} onClick={link.onClick}>
        {link.label}
      </div>
    );
  });

  return (
    <Header height={56} className={classes.header}>
      <Container>
        <div className={classes.inner}>
          <MoodSmileDizzy size={28} />
          <Group spacing={5} className={classes.links}>
            {items}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingRight: 12,
              }}
            >
              <UserButton />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingRight: 12,
              }}
            >
              <ThemeToggler />
            </div>
          </Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color="#fff"
          />
        </div>
      </Container>
    </Header>
  );
}

export default AdminHeader;

import {
  createStyles,
  rem,
  Paper,
  Text,
  TextInput,
  Button,
} from "@mantine/core";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { Row } from "~/components/Primary";
import { LoadingSpinner } from "../Primary/LoadingSpinner";
import BooleanChip from "../Primary/BooleanChip";
import useIntervalPicker from "~/utils/hooks/useIntervalPicker";
import { type StoreConfig } from "@prisma/client";
import toast from "react-hot-toast";

const useStyles = createStyles((theme, { bgUrl }: { bgUrl?: string }) => ({
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xs,
  },
  bgsSampler: {
    height: rem(300),
    width: rem(150),
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${
      bgUrl ?? ""
    })`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    margin: "auto",
  },
}));

type StoreConfigProps = StoreConfig & { imgs: string[] };

const StoreConfigPage = () => {
  const ctx = api.useContext();
  const { data: storeConfig, isLoading } = api.stores.getConfig.useQuery();
  const [newBody, setNewBody] = useState<StoreConfigProps>();
  const bgImage = useIntervalPicker(
    newBody?.imgs.filter((item) => item.length) || [],
    5000
  );
  const { classes } = useStyles({ bgUrl: bgImage });

  const { mutate: edit, isLoading: isEditing } =
    api.stores.editConfig.useMutation({
      onSuccess: () => {
        void ctx.stores.getConfig.invalidate();
        toast.success("Store config updated");
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError;
        window.alert(errorMessage);
      },
    });

  const handleEditField = (key: string, value: any) =>
    setNewBody((curr) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (curr) return { ...curr, [key]: value };
    });
  const handleEditImg = (index: number, value: string) =>
    setNewBody((curr) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (curr) {
        const newImgs = [...curr.imgs];
        newImgs[index] = value;
        return { ...curr, imgs: newImgs };
      }
    });
  const handleSubmit = () => {
    storeConfig &&
      edit({
        id: storeConfig.id,
        imgs: newBody?.imgs ?? [],
        defaultLang: newBody?.defaultLang ?? "en",
        logo: newBody?.logo,
      });
  };

  useEffect(() => {
    storeConfig &&
      setNewBody({
        ...storeConfig,
        imgs: storeConfig?.bgImgs?.split(";") ?? [],
      });
  }, [storeConfig]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Row align="center" justify="center">
        <Text transform="uppercase" weight={600} size={24}>
          Store Config
        </Text>
      </Row>
      <div className={classes.container}>
        <Paper
          p={48}
          style={{ display: "flex", gap: 24, flexDirection: "column" }}
        >
          <Row gap={12}>
            <div>
              <TextInput
                label="Background Image 1"
                maxLength={190}
                value={newBody?.imgs[0] || ""}
                onChange={({ target }) => handleEditImg(0, target?.value)}
              />
              <TextInput
                label="Background Image 2"
                maxLength={190}
                value={newBody?.imgs[1] || ""}
                onChange={({ target }) => handleEditImg(1, target?.value)}
              />
              <TextInput
                label="Background Image 3"
                maxLength={190}
                value={newBody?.imgs[2] || ""}
                onChange={({ target }) => handleEditImg(2, target?.value)}
              />
              <TextInput
                label="Background Image 4"
                maxLength={190}
                value={newBody?.imgs[3] || ""}
                onChange={({ target }) => handleEditImg(3, target?.value)}
              />
              <TextInput
                label="Background Image 5"
                maxLength={190}
                value={newBody?.imgs[4] || ""}
                onChange={({ target }) => handleEditImg(4, target?.value)}
              />
            </div>
            <div className={classes.bgsSampler} />
          </Row>
          {/* <TextInput
            label="Logo"
            maxLength={255}
            value={newBody?.img || ""}
            onChange={({ target }) => handleEditField("img", target?.value)}
          /> */}
          <div>
            <Text size={14}>Default lang:</Text>
            <BooleanChip
              value={newBody?.defaultLang === "en"}
              falseLabel="Español"
              trueLabel="English"
              onChange={(value) =>
                handleEditField("defaultLang", value ? "en" : "es")
              }
            />
          </div>
          <Button onClick={handleSubmit} disabled={isEditing || isLoading}>
            Save changes
          </Button>
        </Paper>
      </div>
    </>
  );
};
export default StoreConfigPage;

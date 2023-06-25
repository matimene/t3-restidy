import { Text } from "@mantine/core";
import { World } from "tabler-icons-react";
import styled from "@emotion/styled";
import useStore from "~/utils/zustand-store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

const I18NButton = ({ style }: { style?: React.CSSProperties }) => {
  const { dispatch, lang } = useStore();
  // const lang = (router.query.lang as string) ?? "en";
  // void router.replace({
  //   query: { ...router.query, lang: lang === "en" ? "es" : "en" },
  // });

  const handleChangeLang = () =>
    void dispatch.setLang(lang === "en" ? "es" : "en");

  return (
    <Container
      style={{ justifyContent: "center", ...style }}
      onClick={handleChangeLang}
    >
      <Text>
        {lang === "en" ? "ENG" : "ESP"}
        <World size={12} style={{ marginLeft: 2 }} />
      </Text>
    </Container>
  );
};

export default I18NButton;

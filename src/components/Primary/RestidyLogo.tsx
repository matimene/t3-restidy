import { MoodSmileDizzy } from "tabler-icons-react";
import { Text } from "@mantine/core";

const RestidyLogo = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "min-content",
        gap: 6,
        fontWeight: 600,
        color: "white",
      }}
    >
      <MoodSmileDizzy size={28} />
      <Text transform="uppercase" size={20} pt={2}>
        Restidy
      </Text>
    </div>
  );
};

export default RestidyLogo;

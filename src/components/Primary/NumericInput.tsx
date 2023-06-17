import { useRef } from "react";
import {
  NumberInput,
  Group,
  ActionIcon,
  type NumberInputHandlers,
  rem,
} from "@mantine/core";

function NumericInput({
  value,
  setValue,
  showDecrement = true,
  style,
  mainInputStyle,
}: {
  value: number;
  setValue: (val: number) => void;
  showDecrement?: boolean;
  style?: React.CSSProperties;
  mainInputStyle?: object;
}) {
  const handlers = useRef<NumberInputHandlers>();

  return (
    <Group spacing={5} style={style && style}>
      {showDecrement && (
        <ActionIcon
          size={26}
          variant="gradient"
          gradient={{ from: "yellow.4", to: "yellow.8", deg: 90 }}
          onClick={() => handlers?.current?.decrement()}
          opacity={0.9}
        >
          –
        </ActionIcon>
      )}
      <NumberInput
        hideControls
        value={value}
        onChange={(val: number) => setValue(val)}
        handlersRef={handlers}
        max={10}
        min={0}
        step={1}
        variant="filled"
        styles={{
          input: {
            width: rem(40),
            backgroundColor: "#00000080",
            textAlign: "center",
            ...mainInputStyle,
          },
        }}
      />
      <ActionIcon
        size={26}
        variant="gradient"
        gradient={{ from: "yellow.4", to: "yellow.8", deg: 270 }}
        onClick={() => handlers?.current?.increment()}
        opacity={0.9}
      >
        +
      </ActionIcon>
    </Group>
  );
}

export default NumericInput;

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
}: {
  value: number;
  setValue: (val: number) => void;
}) {
  const handlers = useRef<NumberInputHandlers>();

  return (
    <Group spacing={5}>
      <ActionIcon
        size={28}
        variant="default"
        onClick={() => handlers?.current?.decrement()}
      >
        –
      </ActionIcon>
      <NumberInput
        hideControls
        value={value}
        onChange={(val: number) => setValue(val)}
        handlersRef={handlers}
        max={10}
        min={0}
        step={1}
        styles={{ input: { width: rem(40), textAlign: "center" } }}
      />
      <ActionIcon
        size={28}
        variant="default"
        onClick={() => handlers?.current?.increment()}
      >
        +
      </ActionIcon>
    </Group>
  );
}

export default NumericInput;

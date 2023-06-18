import { Chip, Group } from "@mantine/core";

const BooleanChip = ({
  value,
  onChange,
  falseLabel = "Disabled",
  trueLabel = "Active",
}: {
  falseLabel?: string;
  trueLabel?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <Chip.Group
      multiple={false}
      value={value ? "1" : "0"}
      onChange={(value) => onChange(value === "0" ? false : true)}
    >
      <Group position="center">
        <Chip value={"0"}>{falseLabel}</Chip>
        <Chip value={"1"}>{trueLabel}</Chip>
      </Group>
    </Chip.Group>
  );
};

export default BooleanChip;

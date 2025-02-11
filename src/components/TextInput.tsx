import { ChangeEvent, memo, useMemo } from "react";

import { debounce } from "../helpers/debounce";

export const TextInput = memo(({ onChange, deferral }: { onChange?: (text: string) => void; deferral?: number }) => {
  const memorizedOnChange = useMemo(() => {
    const handleEvent = (event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value);
    return deferral ? debounce(handleEvent, deferral) : handleEvent;
  }, [deferral, onChange]);

  return (
    <input
      style={{ padding: "8px 12px", width: "30%", fontSize: "22px", borderRadius: "5px", color: "#52796f" }}
      placeholder="Filter jokes..."
      onChange={memorizedOnChange}
      type="text"
    />
  );
});

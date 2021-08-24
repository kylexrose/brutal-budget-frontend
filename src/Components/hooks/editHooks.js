import { useState } from "react";

function CustomEditHooks(initialState) {
  const [value, setValue] = useState(initialState);
  function onChange(e) {
    setValue(e.target.value);
  }
  return {value, onChange};
}

export default CustomEditHooks;
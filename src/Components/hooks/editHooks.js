import { useState } from "react";

function CustomEditHooks(initialState) {
  const [value, setValue] = useState(initialState);
  const [editable, setEditable] = useState(false);
  function onChange(e) {
    setValue(e.target.value);
  }
  function editToggle(){
      setEditable(!editable);
  }
  return [value, editable, onChange, editToggle];
}

export default CustomEditHooks;
import "../styles/SliderOptionInput.css";
import { useState } from "react";
import {
  createRandomUUID,
  removeArrayDuplicates,
} from "../helpers/helperFunctions";

export function SliderOptionInput({
  initialOption,
  options,
  labelText = "",
  onChange,
}) {
  const [IDs] = useState({
    labelID: createRandomUUID(),
    datalistID: createRandomUUID(),
  });

  if (!Array.isArray(options))
    return <>"Error: must receive an array of options."</>;
  else if (options.length === 0) return null;

  return (
    <>
      <datalist id={IDs.datalistID}>
        {removeArrayDuplicates(options).map((option, index) => (
          <option
            key={createRandomUUID()}
            value={index}
            label={option}
          ></option>
        ))}
      </datalist>

      <label htmlFor={IDs.inputID}>{labelText}</label>
      <input
        type="range"
        id={IDs.inputID}
        min="0"
        max={options.length - 1}
        step="1"
        list={IDs.datalistID}
        value={options.findIndex((option) => option === initialOption)}
        onChange={(e) => {
          onChange(e, options[e.target.value]);
        }}
      />
    </>
  );
}

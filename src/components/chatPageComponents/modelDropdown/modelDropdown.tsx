import React from "react";
import Select from "react-select";
import { useAppDispatch, useAppSelector } from "../../../state";
import { turnOffline,turnOnline } from "../../../state/modelState";

interface OptionType {
  value: string;
  label: string;
  icon?: string;
}

const options: OptionType[] = [
  {
    value: "offline",
    label: "LLama model Offline",
    icon: "/img/icons8-offline-48.png",
  },
  {
    value: "online",
    label: "Open AI model Online",
    icon: "/img/icons8-online-48.png",
  },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "rgb(28, 30, 58, 1)",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "rgb(28, 30, 58, 1)", // Set background color for the dropdown menu
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  optionImage: {
    marginRight: "10px",
    width: "24px",
    height: "24px",
    verticalAlign: "middle",
  },
};

const ModelDropdown: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleChange = (selectedOption: OptionType | null) => {
    if (selectedOption) {
      if (selectedOption.value === "online") {
        dispatch(turnOnline());
      } else if (selectedOption.value === "offline") {
        dispatch(turnOffline());
      }
    }
  };

  return (
    <Select
      options={options}
      defaultValue={options[0]}
      styles={customStyles}
      getOptionLabel={(option: OptionType) => option.label}
      getOptionValue={(option: OptionType) => option.value}
      formatOptionLabel={(option: OptionType) => (
        <div style={{ fontFamily: "Arial, sans-serif", color: "white" }}>
          {option.icon && (
            <img src={option.icon} alt="" style={customStyles.optionImage} />
          )}
          {option.label}
        </div>
      )}
      onChange={handleChange}
    />
  );
};

export default ModelDropdown;

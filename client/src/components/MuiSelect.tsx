import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  ThemeProvider,
  createTheme,
  Box,
} from "@mui/material";

interface OptionItem {
  value: string | number;
  label: string;
}

interface MuiSelectProps {
  value: string | number;
  onChange: (value: any) => void;
  options: OptionItem[];
  label?: string;
  className?: string;
  size?: "small" | "medium";
  variant?: "standard" | "outlined" | "filled";
}

// Custom Crafters'Haven Theme for MUI Select
const customMuiTheme = createTheme({
  palette: {
    primary: {
      main: "#1c1917", // stone-900
    },
    text: {
      primary: "#1c1917",
      secondary: "#78716c", // stone-500
    },
  },
  typography: {
    fontFamily: "inherit",
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
          backgroundColor: "#ffffff",
          fontSize: "13px",
          fontWeight: 600,
          color: "#1c1917",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e7e5e4", // stone-200
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#a8a29e", // stone-400
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1c1917",
            borderWidth: "1.5px",
          },
        },
        select: {
          paddingTop: "8px",
          paddingBottom: "8px",
          paddingLeft: "12px",
          paddingRight: "32px",
          display: "flex",
          alignItems: "center",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "13px",
          fontWeight: 500,
          padding: "10px 16px",
          color: "#292524",
          "&.Mui-selected": {
            backgroundColor: "#f5f5f4",
            fontWeight: 700,
            color: "#1c1917",
            "&:hover": {
              backgroundColor: "#e7e5e4",
            },
          },
          "&:hover": {
            backgroundColor: "#fafaf9",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e7e5e4",
          marginTop: "6px",
        },
      },
    },
  },
});

export const MuiSelect: React.FC<MuiSelectProps> = ({
  value,
  onChange,
  options,
  label,
  className = "",
  size = "small",
}) => {
  const handleChange = (event: SelectChangeEvent<any>) => {
    onChange(event.target.value);
  };

  return (
    <ThemeProvider theme={customMuiTheme}>
      <Box className={className}>
        <FormControl fullWidth size={size}>
          <Select
            value={value}
            onChange={handleChange}
            displayEmpty
            renderValue={(selected) => {
              const matched = options.find((opt) => opt.value === selected);
              return matched ? matched.label : (label || "");
            }}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </ThemeProvider>
  );
};

export default MuiSelect;

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
      main: "#4A4A4A",
    },
    text: {
      primary: "#4A4A4A",
      secondary: "rgba(74, 74, 74, 0.7)",
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
          color: "#4A4A4A",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(226, 180, 189, 0.6)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(226, 180, 189, 0.9)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4A4A4A",
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
          color: "#4A4A4A",
          "&.Mui-selected": {
            backgroundColor: "rgba(247, 214, 208, 0.35)",
            fontWeight: 700,
            color: "#4A4A4A",
            "&:hover": {
              backgroundColor: "rgba(247, 214, 208, 0.5)",
            },
          },
          "&:hover": {
            backgroundColor: "#FFF5F5",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 10px 25px -5px rgba(74, 74, 74, 0.12), 0 8px 10px -6px rgba(74, 74, 74, 0.05)",
          border: "1px solid rgba(226, 180, 189, 0.4)",
          backgroundColor: "#ffffff",
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

import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: 'black', color: 'white', p: 2, textAlign: 'center', mt: 'auto' }}>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Adithya. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
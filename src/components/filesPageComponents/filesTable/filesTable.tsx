import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Key, useEffect, useState } from "react";
import axios from "axios";
import { error } from "console";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

type File = {
  fileID: string;
  fileName: string;
  owner: string;
  timestamp: string;
};

export default function FilesTable() {
  return (
    <div>
      <TableContainer
        sx={{ border: 1, borderColor: "blue", borderRadius: 5 }}
      ></TableContainer>
    </div>
  );
}

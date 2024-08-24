"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";

interface DataRow {
  articleid: string;
  subarticleid: string;
  articlename: string;
  external_str_id: string;
  ecrlongname: string;
}

const DataTable = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageInput, setPageInput] = useState(page + 1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch("/api/data");
        if (!response.ok) {
          throw new Error("Network error");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    setPageInput(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
    setPageInput(1);
  };

  const handlePageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      -setPageInput(Number(value));
    }
  };

  const handlePageInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const inputPage = Number(pageInput);
      if (inputPage > 0 && inputPage <= Math.ceil(data.length / rowsPerPage)) {
        setPage(inputPage - 1);
      }
    }
  };

  const handlePageInputBlur = () => {
    const inputPage = Number(pageInput);
    if (inputPage > 0 && inputPage <= Math.ceil(data.length / rowsPerPage)) {
      setPage(inputPage - 1);
    } else {
      setPageInput(page + 1);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TableContainer component={Paper} className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="overflow-y-auto h-full">
              <Table className="w-full h-full table-fixed">
                <TableHead className="sticky top-0">
                  <TableRow className="grid grid-cols-11 bg-gray-100">
                    <TableCell className="font-medium col-span-1 text-gray-500">
                      #
                    </TableCell>
                    <TableCell className="font-medium col-span-1 text-gray-500">
                      Article ID
                    </TableCell>
                    <TableCell className="font-medium col-span-1 text-gray-500">
                      Subarticle ID
                    </TableCell>
                    <TableCell className="font-medium col-span-3 text-gray-500">
                      Article Name
                    </TableCell>
                    <TableCell className="font-medium col-span-2 text-gray-500">
                      External Str ID
                    </TableCell>
                    <TableCell className="font-medium col-span-3 text-gray-500">
                      ECR Long Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        key={index}
                        className="grid min-h-[10%] grid-cols-11 hover:bg-gray-100 "
                      >
                        <TableCell className="truncate col-span-1">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="truncate col-span-1">
                          <Tooltip title={row.articleid} arrow>
                            <span>{row.articleid}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="truncate col-span-1">
                          <Tooltip title={row.subarticleid} arrow>
                            <span>{row.subarticleid}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="truncate col-span-3">
                          <Tooltip title={row.articlename} arrow>
                            <span>{row.articlename}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="truncate col-span-2">
                          <Tooltip title={row.external_str_id} arrow>
                            <span>{row.external_str_id}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="truncate col-span-3">
                          <Tooltip title={row.ecrlongname} arrow>
                            <span>{row.ecrlongname}</span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </TableContainer>
      <div className="flex items-center justify-between p-4 bg-gray-100 border-t">
        <FormControl size="small">
          <InputLabel>Строк</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            label="Rows per page"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </FormControl>
        <div className="flex items-center space-x-4">
          <IconButton
            onClick={(event) => handleChangePage(event, 0)}
            disabled={page === 0}
            aria-label="First Page"
          >
            <FirstPage />
          </IconButton>
          <IconButton
            onClick={(event) => handleChangePage(event, page - 1)}
            disabled={page === 0}
            aria-label="Previous Page"
          >
            <NavigateBefore />
          </IconButton>
          <span className="flex items-center justify-center w-10 h-10 rounded-2xl border-2 border-blue-300 text-sm text-blue-500">
            {page + 1}
          </span>
          <IconButton
            onClick={(event) => handleChangePage(event, page + 1)}
            disabled={page >= Math.ceil(data.length / rowsPerPage) - 1}
            aria-label="Next Page"
          >
            <NavigateNext />
          </IconButton>
          <IconButton
            onClick={(event) =>
              handleChangePage(event, Math.ceil(data.length / rowsPerPage) - 1)
            }
            disabled={page >= Math.ceil(data.length / rowsPerPage) - 1}
            aria-label="Last Page"
          >
            <LastPage />
          </IconButton>
        </div>
        <TextField
          type="text"
          size="small"
          value={pageInput}
          onChange={handlePageInputChange}
          onKeyDown={handlePageInputKeyDown}
          onBlur={handlePageInputBlur}
          inputMode="numeric"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                из {Math.ceil(data.length / rowsPerPage)}
              </InputAdornment>
            ),
          }}
          className="w-[150px]"
        />
      </div>
    </div>
  );
};

export default DataTable;

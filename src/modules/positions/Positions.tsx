import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridSlots,
} from "@mui/x-data-grid";
import { PositionsForm } from "./PositionsForm";
import PositionsService from "./positions.service";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Loader } from "../../components/Loader";
import useTitle from "../../hooks/useTitle";
import { blue, red } from "@mui/material/colors";
import swal from "sweetalert";

interface EditToolbarProps {
  setOpen: React.Dispatch<any>;
  setIseditMode: React.Dispatch<any>;
}

function EditToolbar(props: EditToolbarProps) {
  const { setOpen, setIseditMode } = props;

  return (
    <GridToolbarContainer>
      <Button
        variant="contained"
        color="info"
        startIcon={<AddIcon />}
        onClick={() => {
          setOpen(true);
          setIseditMode(false);
        }}
      >
        اضافه کردن پست جدید
      </Button>
    </GridToolbarContainer>
  );
}

export default function Positions() {
  const [rows, setRows] = React.useState([]);
  const [pagesize, setPageSize] = React.useState(20);
  const [rowId, setId] = React.useState(-1);
  const [lastPage, setLastPage] = React.useState(1);
  const [isEditMode, setIseditMode] = React.useState(false);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 15,
  });
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const refresh = (pageNumber: number) => {
    setIsPending(true);
    PositionsService.getAll(pageNumber).then(
      (res: {
        data: {
          data: {
            map: (arg0: (item: any) => any) => React.SetStateAction<never[]>;
          };
          per_page: React.SetStateAction<number>;
          last_page: React.SetStateAction<number>;
        };
      }) => {
        setIsPending(false);
        setRows(
          res.data.data.map((item: any) => ({
            id: item.node.id,
            ...item.node.properties,
          }))
        );

        setPageSize(res.data.per_page);
        setLastPage(res.data.last_page);
      }
    );
  };
  const handleDelete = (id: number) =>
    swal({
      title: "آیا از حذف پست اطمینان دارید؟",
      icon: "warning",
      dangerMode: true,
      buttons: ["خیر", "بله"],
    }).then((value: any) => {
      if (value) {
        PositionsService.delete(id)
          .then((res: any) => {
            if (res.status === 200) {
              toast.success("پست  با موفقیت حذف شد", {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });
              refresh(1);
            }
          })
          .catch(() =>
            toast.error("خطا در حذف فرد", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            })
          );
      }
    });

  const columns: GridColDef[] = [
    { field: "id", headerName: "id", width: 180 },

    {
      field: "title",
      headerName: "title",
      type: "string",
      width: 180,
      editable: true,
    },
    { field: "caller_id", headerName: "caller_id", width: 180 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => {
              setOpen(true);
              setIseditMode(true);
              setId(id as any);
            }}
            color="inherit"
            sx={{ color: blue[900] }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDelete(id as number)}
            color="inherit"
            sx={{ color: red[500] }}
          />,
        ];
      },
    },
  ];
  useTitle("پست ها");

  React.useEffect(() => refresh(1), []);
  React.useEffect(() => {
    refresh(paginationModel.page + 1);
  }, [paginationModel]);
  return (
    <>
      <Loader open={isPending} handleClose={() => {}} />
      <PositionsForm
        open={open}
        id={rowId}
        isEditMode={isEditMode}
        setOpen={setOpen}
        refresh={refresh}
      />
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <Box
        component="div"
        sx={{
          height: 500,
          "&.actions": {
            color: "text.secondary",
          },
          "&.textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[pagesize]}
          editMode="row"
          slots={{
            toolbar: EditToolbar as GridSlots["toolbar"],
          }}
          slotProps={{
            toolbar: { setOpen, setIseditMode },
          }}
          paginationMode={"server"}
          onPaginationModelChange={setPaginationModel}
          paginationModel={paginationModel}
          rowCount={lastPage * pagesize}
        />
      </Box>
    </>
  );
}

import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { GeneralGraph } from "./GeneralGraph";
import EditableGraph from "./EditableGraph";
import { fetchGraphData } from "../../neo4j/neo4j";
import useTitle from "../../hooks/useTitle";
import RotaryGraph from "./RotaryGraph";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Graph = () => {
  const [value, setValue] = React.useState("1");
  const [nodes, setNodes] = React.useState<any[]>([]);
  const [edges, setEdges] = React.useState<any[]>([]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  useTitle("نمایش گراف");
  React.useEffect(() => {
    fetchGraphData()
      .then((res) => {
        setNodes(res?.nodes as any[]);
        setEdges(res?.edges as any[]);
      })
      .catch(() => {
        toast.error("خطا در دریافت اطلاعات", {
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
      });
  }, []);
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
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

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            variant="fullWidth"
          >
            <Tab label="گراف کلی" value="1" />
            <Tab label="ویرایش گراف" value="2" />
            <Tab label="Rotary" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <GeneralGraph nodes={nodes as any[]} edges={edges as any[]} />
        </TabPanel>
        <TabPanel value="2">
          <EditableGraph nodes={nodes as any[]} edges={edges as any[]} />
        </TabPanel>
        <TabPanel value="3">
          <RotaryGraph  nodes={nodes as any[]} edges={edges as any[]}/>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Graph;

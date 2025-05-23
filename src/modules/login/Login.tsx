import {
  Button,
  CircularProgress,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import img from "./../../assets/img/login.svg";
import useForm from "../../hooks/useForm";
import AuthService from "./auth.service";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import AuthContext from "../../contexts/authcontext/authContext";
import { ILogin, validate } from "./login.types";
import useTitle from "../../hooks/useTitle";

const Login = () => {
  const theme = useTheme();

  const initial = useMemo(
    () => ({
      email: "",
      password: "",
    }),
    []
  );

  const { values, errors, handleChange } = useForm<ILogin>(initial, validate);
  const [isPending, setIsPending] = useState<boolean>(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  useTitle("ورود");

  return (
    <>
      <CssBaseline />
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
      <Grid
        container
        style={{
          width: "100%",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
        justifyContent={"center"}
        bgcolor={theme.palette.primary.main}
      >
        <Grid
          item
          style={{
            width: "50%",
            height: "100%",
            alignContent: "center",
            justifyContent: "center",
            padding: "32px",
            background: "white",
          }}
        >
          <Grid
            container
            sx={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
            }}
            gap={6}
          >
            <Grid item>
              <TextField
                label="ایمیل"
                variant="outlined"
                sx={{ width: "300px", borderRadius: "8px" }}
                required
                value={values.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                name="email"
              />
            </Grid>
            <Grid item>
              <TextField
                label="رمز عبور"
                variant="outlined"
                sx={{ width: "300px", borderRadius: "8px" }}
                required
                value={values.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                type="password"
                name="password"
              />
            </Grid>
            <Grid>
              <Button
                type="submit"
                variant="contained"
                size="large"
                color="info"
                sx={{ width: "300px", borderRadius: "8px" }}
                disabled={!!errors.password || !!errors.email}
                onClick={() => {
                  setIsPending(true);

                  AuthService.login({
                    email: values.email,
                    password: values.password,
                  })
                    .then((res: any) => {
                      setIsPending(false);
                      if (res.status === 200) {
                        localStorage.setItem("token", res.data.accessToken);
                        authContext.setToken(res.data.accessToken);
                        toast.success("با موفقیت وارد شدید!", {
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
                        navigate("/");
                      }
                    })
                    .catch(() => {
                      setIsPending(false);
                      toast.error("نام کاربری یا رمز عبور اشتباه است", {
                        position: "top-right",
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
                }}
              >
                {isPending ? (
                  <CircularProgress
                    size={28}
                    sx={{
                      color: "#ccc",
                    }}
                  />
                ) : (
                  "ورود"
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          style={{
            width: "50%",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            style={{
              alignContent: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
            gap={6}
          >
            <Grid item alignSelf={"center"}>
              <Typography
                color={"white"}
                component={"h6"}
                fontWeight={"bold"}
                fontSize={"34px"}
              >
                سامانه تلفن یار دانشگاه بوعلی سینا
              </Typography>
            </Grid>
            <Grid item>
              <img src={img} width={"400px"} height={"300px"} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default Login;

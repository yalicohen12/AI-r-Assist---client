import { width } from "@mui/system";
import { toast } from "react-toastify";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import "./userProfile.css";
import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Tabs } from "@mui/material";
import TabsNav from "../../components/tabsNavigation/tabs";
import { useAppDispatch, useAppSelector } from "../../state";
import { setPage } from "../../state/pageState";
import LogoutIcon from "@mui/icons-material/Logout";
import { disConnect } from "../../state/authStatusState";
import { newConversation } from "../../state/conversationState";

export default function UserProfile() {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [submittable, setSubmittable] = useState(false);

  const conversationsCount = useAppSelector(
    (state) => state.countSlice.conversationCount
  );

  const filesCount = useAppSelector((state) => state.countSlice.filesCount);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPage("User"));
  }, []);

  const notifyMissingFields = () => {
    toast.error("please fill all fields", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
      autoClose: 1000,
    });
  };
  const notifyNewPasswordError = () => {
    toast.error("new Password inputs not match ", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
      autoClose: 1000,
    });
  };
  const notifycurrPasswordError = () => {
    toast.error("current password incorect ", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
      autoClose: 1000,
    });
  };
  const notifyPasswordChanged = () => {
    toast.success("Password replaced!", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
      autoClose: 5000,
    });
  };

  const notifyLogout = () => {
    toast.info("Succsesfuly Logout", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
      autoClose: 3000,
    });
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 3,
    },
    paper: {
      padding: theme.spacing(4),
      margin: "auto",
      width: "auto",
      backgroundColor: "#1E2A3A",
    },
    image: {
      width: 150,
      height: 150,
    },
    img: {
      margin: "auto",
      display: "block",
      width: "100%",
      height: "100%",
    },
    // New styles for the orders grid
    ordersGrid: {
      // marginTop: theme.spacing(0),
    },
    ordersPaper: {
      // padding: theme.spacing(4),
      width: "100%",
    },
    ordersText: {
      marginBottom: theme.spacing(4.4),
      display: "flex",
      justifyContent: "flex-start", // Align the headline at the top left
      alignItems: "center", // Align text vertically
    },
    ordersButton: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
      fontWeight: "bold",
    },
    marginBottom: {
      // marginBottom: theme.spacing(4),
    },
    ordersHeadline: {
      color: "white",
      fontSize: 32,
      fontWeight: "bold", // Set font weight to bold
      marginBottom: theme.spacing(3), // Add spacing below the headline
    },

    orderText: {
      fontSize: 24,
      color: "white",
    },
  }));

  const classes = useStyles();

  function validateNewPassword(): void {
    throw new Error("Function not implemented.");
  }

  function handleSubmit(): void {
    if (
      currPassword === "" ||
      newPassword === "" ||
      confirmNewPassword === ""
    ) {
      notifyMissingFields();
      return;
    }

    if (newPassword !== confirmNewPassword) {
      notifyNewPasswordError();
      return;
    }
    axios
      .post("http://localhost:4000/changePassword", {
        userID: localStorage.getItem("userID"),
        oldPassword: currPassword,
        newPassword: newPassword,
      })
      .then(() => {
        notifyPasswordChanged();
        setCurrPassword("");
        setConfirmNewPassword("");
        setNewPassword("");
        return;
      })
      .catch(() => {
        notifycurrPasswordError();
        return;
      });
  }

  function handleLogout() {
    navigate("/");
    dispatch(disConnect());
    dispatch(newConversation());
    localStorage.clear();
    notifyLogout();
  }

  return (
    <div className="userProfile-container">
      <div
        className="logContainer"
        onClick={handleLogout}
        style={{ position: "absolute", right: "1%", top: "1%" }}
      >
        <LogoutIcon
          className="logouticon"
          style={{ cursor: "pointer" }}
        ></LogoutIcon>
        <div className="logTxt"> Logout</div>
      </div>
      <TabsNav></TabsNav>
      <div className="userProfile-data">
        <Grid
          className="gridProfile"
          container
          spacing={2}
          style={{ height: "200px" }}
        >
          <Grid item xs={12}>
            <Paper
              className={classes.paper}
              style={{ backgroundColor: "#1E2A3A" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} container>
                  <Typography className="typo" variant="h4">
                    Account Info
                  </Typography>
                </Grid>
                <Grid item xs={12} container>
                  <Grid
                    item
                    container
                    direction="column"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Typography className="typo" gutterBottom variant="h5">
                      user name: {localStorage.getItem("userName")}
                    </Typography>
                    <Typography className="typo" variant="h5">
                      created at: {new Date(Date.now()).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item>
            <Paper className={classes.paper}>
              <Grid container direction="column" spacing={2}>
                <Grid container justify="flex-start">
                  <Typography className="typo" variant="h5">
                    Password Management
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    InputLabelProps={{
                      style: { color: "grey", fontSize: "1.1rem" }, // Set the color of the label text to white
                    }}
                    InputProps={{
                      style: { color: "white", fontSize: "1.6rem" },
                    }}
                    className="typo"
                    label="Current Password"
                    value={currPassword}
                    variant="outlined"
                    type="password"
                    style={{ color: "white" }}
                    fullWidth
                    onChange={(e) => setCurrPassword(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    InputLabelProps={{
                      style: { color: "grey", fontSize: "1.1rem" }, // Set the color of the label text to white
                    }}
                    InputProps={{
                      style: { color: "white", fontSize: "1.6rem" },
                    }}
                    size="small"
                    label="New Password"
                    value={newPassword}
                    variant="outlined"
                    type="password"
                    style={{ width: "100%", color: "white" }}
                    // fullWidth
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    InputLabelProps={{
                      style: { color: "grey", fontSize: "1.1rem" }, // Set the color of the label text to white
                    }}
                    InputProps={{
                      style: { color: "white", fontSize: "1.6rem" },
                    }}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    label="Confirm New Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                  />
                </Grid>
                <Grid container justify="flex-end">
                  <Button
                    disabled={submittable}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={`${classes.paper} ${classes.ordersPaper}`}>
              <Grid
                container
                direction="column"
                spacing={0}
                className={classes.ordersGrid}
              >
                <Grid container>
                  <Typography
                    variant="h5"
                    style={{
                      fontFamily: "Arial",
                      color: "white",
                      fontSize: "1.7rem",
                      marginBottom: "2rem",
                    }}
                  >
                    App usage
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    gutterBottom
                    variant="h4"
                    className={`${classes.ordersText} ${classes.orderText}`}
                  >
                    Conversation placed: {conversationsCount}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    gutterBottom
                    variant="h4"
                    className={`${classes.ordersText} ${classes.orderText}`}
                  >
                    Files placed: {filesCount}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography gutterBottom variant="h4">
                    <Button
                      style={{ marginTop: "4.5rem" }}
                      className={classes.ordersButton}
                      variant="contained"
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      View All Chats
                    </Button>
                  </Typography>
                </Grid>
                <Grid container justify="flex-end"></Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

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
import "./UserProfile.css";
import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [submittable, setSubmittable] = useState(false);

  const [ordersCount, setOrdersCount] = useState(0);
  const [ordersSum, setOrdersSum] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/getOrdersStats/${localStorage.getItem("userId")}`
      )
      .then((res) => {
        setOrdersCount(res.data.ordersCount);
        setOrdersSum(res.data.ordersSum);
      });
  }, []);

  const notifyMissingFields = () => {
    toast.error("please fill all fields", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 1000,
    });
  };
  const notifyNewPasswordError = () => {
    toast.error("new Password inputs not match ", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 1000,
    });
  };
  const notifycurrPasswordError = () => {
    toast.error("current password incorect ", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 1000,
    });
  };
  const notifyPasswordChanged = () => {
    toast.success("Password replaced!", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 5000,
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
      marginTop: theme.spacing(0),
    },
    ordersPaper: {
      padding: theme.spacing(4),
      width: "100%",
    },
    ordersText: {
      marginBottom: theme.spacing(7.4 ),
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
      marginBottom: theme.spacing(4),
    },
    ordersHeadline: {
      color: "blue", 
      fontSize: 32, 
      fontWeight: "bold", // Set font weight to bold
      marginBottom: theme.spacing(3), // Add spacing below the headline
    },
  
    orderText: {
      color: "#666", 
      fontSize: 24, 
 
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
      .post("http://localhost:5000/changePassword", {
        userId: localStorage.getItem("userId"),
        currentPassword: currPassword,
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

  return (
    <div>
      <Grid className="gridProfile" container spacing={3}>
     <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container spacing={6}>
              <Grid item xs={12} container justify="flex-start">
                <Typography variant="h3">Account Info</Typography>
              </Grid>
              <Grid item xs={12} container>
                <Grid
                  item
                  container
                  direction="column"
                  alignItems="flex-start"
                  spacing={1}
                >
                  <Typography gutterBottom variant="h4">
                    {localStorage.getItem("userName")}
                  </Typography>
                  <Typography variant="h5" color="textSecondary">
                    Role: {localStorage.getItem("role")}
                  </Typography>
                  <Typography variant="h5" color="textSecondary">
                    Email: {localStorage.getItem("email")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item>
          <Paper className={classes.paper}>
            <Grid container direction="column" spacing={4}>
              <Grid container justify="flex-start">
                <Typography variant="h4">Password Management</Typography>
              </Grid>
              <Grid item>
                <TextField
                  label="Current Password"
                  value={currPassword}
                  variant="outlined"
                  type="password"
                  fullWidth
                  onChange={(e) => setCurrPassword(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="New Password"
                  value={newPassword}
                  variant="outlined"
                  type="password"
                  style={{ width: "100%" }} // Set the width to 100%
                  // fullWidth
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
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
  <Grid container direction="column" spacing={4} className={classes.ordersGrid}>
    <Grid container>
      <Typography variant="h4" className={`${classes.ordersText} ${classes.ordersHeadline}`}>
        Orders Data
      </Typography>
    </Grid>
    <Grid item>
      <Typography gutterBottom variant="h4" className={`${classes.ordersText} ${classes.orderText}`}>
        Orders placed: {ordersCount}
      </Typography>
    </Grid>
    <Grid item>
      <Typography gutterBottom variant="h4" className={`${classes.ordersText} ${classes.orderText}`}>
        Total amount spent: {ordersSum}$
      </Typography>
    </Grid>
    <Grid item className={classes.marginBottom}>
      <Typography gutterBottom variant="h4">
        <Button
          className={classes.ordersButton}
          variant="contained"
          onClick={() => {
            navigate("/ordersView");
          }}
        >
          View All Orders
        </Button>
      </Typography>
    </Grid>
    <Grid container justify="flex-end"></Grid>
  </Grid>
</Paper>
        </Grid>
      </Grid>
    </div>
  );
}

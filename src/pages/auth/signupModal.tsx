import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./signupModal.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signup } from "../../services/apis/loginAPI";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useAppDispatch } from "../../state";
import { connect } from "../../state/authStatusState";

interface signModalProps {
  onClose: () => void;
  isOpen: boolean;
  onLogin: () => void;
}
export default function SignupModal({
  onClose,
  isOpen,
  onLogin,
}: signModalProps) {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nameValidator, setNameValidator] = useState("");
  const [passwordValidator, setPasswordValidator] = useState("");
  const [emailValidator, setEmailValidator] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const notify = () => {
    toast.success("Welcome !", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
  };

  const notifyIssue = () => {
    toast.error("user name already exsits", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 6000,
    });
  };
  const notifyFormNotFilled = () => {
    toast.error("Fill Inputs Properly", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 6000,
    });
  };

  useEffect(() => {
    if (isSubmitted) {
      console.log("rech to effetct 2");
    }
  }, [isSubmitted]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.length > 2 && password.length > 2) {
      try {
        const log = await signup(name, password);
        if (log == "user name already exsits") {
          notifyIssue();
          setName("")
          setPassword("")
          return;
        }
        notify();
        console.log("connected");
        dispatch(connect());
        onClose();
      } catch {
        notifyIssue();
      }
    } else {
      notifyFormNotFilled();
    }
  };

  return (
    <>
      <div className="login"> Sign up</div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            {/* <label>Username </label> */}
            <input
              type="search"
              name="uname"
              placeholder="user name"
              required
              className="input-field"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.length >= 3) {
                  setNameValidator("");
                } else {
                  setNameValidator("user name should be at least 3 charcaters");
                }
              }}
            />
            <div className="validator"> {nameValidator} </div>
          </div>
          <div className="input-container">{/* <label>email </label> */}</div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              name="pass"
              className="input-field"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.length >= 5) {
                  setPasswordValidator("");
                } else {
                  setPasswordValidator(
                    "password should be at least 5 charcaters"
                  );
                }
              }}
            />
            <div className="validator"> {passwordValidator}</div>
          </div>
          <div>{errorMessages}</div>
          <div className="button-container">
            <input type="submit" value={"Sign up"} />
          </div>
        </form>
      </div>
      <div className="create-acount" onClick={() => onLogin()}>
        {" "}
        Back to Login
      </div>
    </>
    //   </div>
    // </div>
  );
}

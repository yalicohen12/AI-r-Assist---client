import { FormEvent, useState, useEffect, useRef } from "react";
import "./loginModal.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../services/apis/loginAPI";
import Signup from "./signupModal";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useAppDispatch } from "../../state";
import { connect } from "../../state/authStatusState";
interface LoginModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function LoginModal({ onClose, isOpen }: LoginModalProps) {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [onLogin, setIsOnLogin] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.length > 2 && password.length > 2) {
      try {
        const log = await login(name, password);
        if (log == 0) {
          notifyIssue();
          return;
        }
        console.log("connected");
        dispatch(connect());
        onClose();
        notify();
      } catch {
        notifyIssue();
      }
    } else {
      notifyFormNotFilled();
    }
  };
  const notify = () => {
    toast.success("Welcome back!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  const notifyIssue = () => {
    toast.error("false user parameters", {
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

  return (
    <>
      <div className="logApp" onClick={onClose}>
        <div className="modalStyles" onClick={(e) => e.stopPropagation()}>
          <div className="close">
            <IconButton
              onClick={() => {
                onClose();
                setIsOnLogin(true);
              }}
            >
              <CloseIcon color="primary" />
            </IconButton>
          </div>
          {onLogin && (
            <>
              <div className="login"> Log in</div>
              <div className="form">
                <form onSubmit={handleSubmit}>
                  <div className="input-container">
                    <input
                      type="search"
                      name="user name"
                      placeholder="user name"
                      required
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      className="input-field"
                      style={{ marginBottom: "1rem" }}
                    />
                  </div>
                  <div className="input-container">
                    <input
                      type="password"
                      name="pass"
                      placeholder="Password"
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      className="input-field"
                    />
                  </div>
                  <div>{errorMessages}</div>
                  <div>
                    <input
                      className="btn-connect"
                      type="submit"
                      value={"Login"}
                      // style={{ color: "white" }}
                    />
                  </div>
                </form>
              </div>

              <div
                className="create-acount"
                onClick={() => setIsOnLogin(false)}
              >
                {" "}
                Create an account
              </div>
            </>
          )}
          {!onLogin && (
            <Signup
              isOpen={isOpen}
              onClose={onClose}
              onLogin={() => setIsOnLogin(true)}
            ></Signup>
          )}
        </div>
      </div>
    </>
  );
}

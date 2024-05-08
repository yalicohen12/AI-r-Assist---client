import axios from "axios";

export async function login(name: string, password: string) {
  try {
    const loadedUser = await axios.post("http://localhost:4000/login", {
      name: name,
      password: password,
    });
    localStorage.setItem("userID", loadedUser.data.userID);
    localStorage.setItem("userName", loadedUser.data.name);
    localStorage.setItem("token", loadedUser.data.token);
    return loadedUser.data.userID;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

export async function signup(name: string, password: string) {
  try {
    const loadedUser = await axios.post("http://localhost:4000/signup", {
      name: name,
      password: password,
    });
    localStorage.setItem("userID", loadedUser.data.userID);
    localStorage.setItem("userName", loadedUser.data.name);
    localStorage.setItem("token", loadedUser.data.token);

    return loadedUser.data.userID;
  } catch (err: any) {
    return err.response.data;
  }
}

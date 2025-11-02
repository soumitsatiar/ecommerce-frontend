import axiosInstance from "./axios";

interface User {
  email: String;
  role: String;
}

const isAuthenticated = async (): Promise<User | null> => {
  try {
    const res = await axiosInstance.get("/me");
    const x: User = {
      email: res.data?.email,
      role: res.data?.role,
    };
    console.log(x);

    return x;
  } catch (error) {
    return null;
  }
};

export default isAuthenticated;

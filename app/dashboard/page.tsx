// import { userInfo } from "../services/authService";
"use client";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [data, setData] = useState();
  useEffect(() => {
    const getuserInfo = async () => {
      try {
        const response = await api.get("/api/health");
        console.log(response, "response");
        if (response.data.success) {
          setData(response.data?.data?.name);
        } else {
          toast.error(response.data.errorMessage);
        }
      } catch (error) {
        console.log(error, "error");
        // toast.error(error.response.data.errorMessage);
      }
    };
    getuserInfo();
  }, []);
  return <div className="container-custom">Welcome {data} Dashboard</div>;
};

export default Dashboard;

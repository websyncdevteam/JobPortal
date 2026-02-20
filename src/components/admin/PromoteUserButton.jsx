import React from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://www.backendserver.aim9hire.com';

const PromoteUserButton = ({ userId, newRole, fetchUsers }) => {
  const promoteHandler = async () => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/v1/user/promote/${userId}`,
        { newRole },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      fetchUsers(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to promote user");
    }
  };

  return (
    <Button onClick={promoteHandler} className="text-xs px-3 py-1">
      Promote to {newRole}
    </Button>
  );
};

export default PromoteUserButton;

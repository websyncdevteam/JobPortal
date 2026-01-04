import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, IconButton, Menu, MenuItem, Typography, Tooltip, CircularProgress } from "@mui/material";
import { Edit, MoreHoriz, Delete, Visibility, Block, Key } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { companyAPI } from "../../services/companyservice/api";
import CompanyLogo from "../admin/CompanyLogo";

const CompaniesTable = ({ companies = [], onRefresh }) => {
  const { searchCompanyByText } = useSelector((store) => store.company);
  const [filterCompany, setFilterCompany] = useState(companies);
  const [loadingActions, setLoadingActions] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const filteredCompany = companies.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
    });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  const setActionLoading = (companyId, action, isLoading) => {
    setLoadingActions(prev => ({
      ...prev,
      [`${companyId}-${action}`]: isLoading
    }));
  };

  const handleToggleStatus = async (companyId, currentStatus) => {
    setActionLoading(companyId, "status", true);
    
    try {
      console.log('🔄 Toggle status - Company ID:', companyId, 'Current status:', currentStatus);
      
      let res;
      if (currentStatus === "active") {
        // Suspend company
        console.log('🔴 Suspending company:', companyId);
        res = await companyAPI.suspendCompany(companyId);
      } else {
        // Activate company - USING THE NEW FUNCTION
        console.log('🟢 Activating company:', companyId);
        res = await companyAPI.activateCompany(companyId);
      }
      
      console.log('📊 API Response:', res);
      
      if (res.success) {
        toast.success(res.message || `Company ${currentStatus === "active" ? "suspended" : "activated"} successfully`);
        if (onRefresh) onRefresh();
      } else {
        toast.error(res.message || `Failed to ${currentStatus === "active" ? "suspend" : "activate"} company`);
      }
    } catch (error) {
      console.error('❌ Toggle status error:', error);
      toast.error(error.response?.data?.message || `Failed to ${currentStatus === "active" ? "suspend" : "activate"} company`);
    } finally {
      setActionLoading(companyId, "status", false);
      handleCloseMenu();
    }
  };

  const handleDelete = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    setActionLoading(companyId, "delete", true);

    try {
      const res = await companyAPI.deleteCompany(companyId);
      if (res.success) {
        toast.success(res.message || "Company deleted successfully");
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete company");
    } finally {
      setActionLoading(companyId, "delete", false);
    }
  };

  const handleResetPassword = async (companyId, companyName) => {
    if (!window.confirm(`Reset password for ${companyName}?`)) return;

    setActionLoading(companyId, "password", true);
    
    try {
      const res = await companyAPI.resetCompanyPassword(companyId);
      if (res.success) {
        toast.success("Password reset successfully. Email sent to company.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setActionLoading(companyId, "password", false);
    }
  };

  const handleClickMenu = (event, companyId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompanyId(companyId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedCompanyId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "#6cbe6b"; // green
      case "suspended": return "#f44336"; // red
      case "pending": return "#ff9800"; // orange
      default: return "#9e9e9e"; // gray
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active": return "Active";
      case "suspended": return "Suspended";
      case "pending": return "Pending";
      default: return status;
    }
  };

  const getToggleStatusText = (status) => {
    return status === "active" ? "Suspend Company" : "Activate Company";
  };

  const isStatusLoading = (companyId) => {
    return loadingActions[`${companyId}-status`];
  };

  return (
    <div>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterCompany.map((company) => (
              <TableRow key={company._id}>
                <TableCell>
                  <CompanyLogo companyId={company._id} companyName={company.name} className="w-10 h-10" />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" color="textPrimary">
                    {company.name}
                  </Typography>
                </TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{
                      backgroundColor: getStatusColor(company.status),
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "12px",
                      fontWeight: "500",
                      textTransform: "capitalize",
                      display: "inline-block",
                      minWidth: "80px",
                      textAlign: "center"
                    }}
                  >
                    {getStatusText(company.status)}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={(event) => handleClickMenu(event, company._id)} 
                    style={{ color: "#333" }}
                    disabled={isStatusLoading(company._id)}
                  >
                    <MoreHoriz />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedCompanyId === company._id}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={() => navigate(`/admin/companies/${company._id}`)}>
                      <Edit style={{ marginRight: 8 }} />
                      Edit Details
                    </MenuItem>
                    <MenuItem onClick={() => navigate(`/admin/companies/${company._id}/activity`)}>
                      <Visibility style={{ marginRight: 8 }} />
                      View Activity
                    </MenuItem>
                    <MenuItem onClick={() => navigate(`/admin/companies/${company._id}/analytics`)}>
                      <Visibility style={{ marginRight: 8 }} />
                      View Analytics
                    </MenuItem>
                    <MenuItem onClick={() => handleResetPassword(company._id, company.name)}>
                      <Key style={{ marginRight: 8 }} />
                      Reset Password
                    </MenuItem>
                    <MenuItem 
                      onClick={() => handleToggleStatus(company._id, company.status)}
                      disabled={isStatusLoading(company._id)}
                    >
                      {isStatusLoading(company._id) ? (
                        <CircularProgress size={16} style={{ marginRight: 8 }} />
                      ) : (
                        <Block style={{ marginRight: 8 }} />
                      )}
                      {isStatusLoading(company._id) 
                        ? (company.status === "active" ? "Suspending..." : "Activating...") 
                        : getToggleStatusText(company.status)
                      }
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(company._id)}>
                      <Delete style={{ marginRight: 8 }} />
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filterCompany.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px", color: "#9e9e9e" }}>
          No companies found. {searchCompanyByText && "Try a different search term."}
        </div>
      )}
    </div>
  );
};

export default CompaniesTable;
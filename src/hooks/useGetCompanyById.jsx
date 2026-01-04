import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // ADD useSelector
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { setSingleCompany } from "@/redux/companySlice";
import { toast } from "sonner";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth); // GET TOKEN FROM REDUX

  useEffect(() => {
    if (!companyId) {
      console.warn("⚠️ [Hook] Company ID is undefined/null");
      return;
    }
    
    const idString = String(companyId).trim();
    const isValidObjectId = idString.length === 24 && /^[0-9a-fA-F]{24}$/.test(idString);
    
    if (!isValidObjectId) {
      console.error(`❌ [Hook] Invalid company ID format: "${idString}"`);
      toast.error("Invalid company ID format");
      return;
    }

    console.log(`🔄 [Hook] Fetching company: ${idString}, Token exists: ${!!token}`);

    const fetchCompany = async () => {
      try {
        const headers = {};
        
        // ADD TOKEN TO HEADERS IF EXISTS
        if (token) {
          headers.Authorization = `Bearer ${token}`;
          console.log("✅ [Hook] Adding token to request");
        } else {
          console.warn("⚠️ [Hook] No token available - request may fail");
        }

        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get/${idString}`,
          { 
            withCredentials: true,
            headers: headers, // ADD HEADERS
            timeout: 10000,
          }
        );

        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
          console.log("✅ [Hook] Company fetched successfully");
        }
      } catch (error) {
        console.error("❌ [Hook] Failed to fetch company:", {
          status: error.response?.status,
          message: error.response?.data?.message,
          tokenPresent: !!token
        });
        
        if (error.response?.status === 401) {
          toast.error("Please login to view company details");
        } else {
          toast.error(error.response?.data?.message || "Failed to load company");
        }
      }
    };

    fetchCompany();
  }, [companyId, dispatch, token]); // ADD token to dependencies
};

export default useGetCompanyById;
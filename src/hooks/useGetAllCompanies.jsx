import { setCompanies } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    const isMounted = useRef(true);
    
    useEffect(() => {
        isMounted.current = true;
        
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { 
                    withCredentials: true,
                    timeout: 10000
                });
                
                if (isMounted.current && res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                if (isMounted.current) {
                    console.error("Error fetching companies:", error);
                }
            }
        }
        
        fetchCompanies();
        
        return () => {
            isMounted.current = false;
        }
    }, [dispatch])
}

export default useGetAllCompanies
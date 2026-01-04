import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCompanies, setSearchCompanyByText } from '@/redux/companySlice';
import { companyAPI } from "../../services/companyservice/api";

const Companies = () => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const companies = useSelector(state => state.company.companies);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await companyAPI.getAdminCompanies();
            console.log('📦 Companies API Response:', response);
            
            if (response.success) {
                const companiesData = response.companies || response.data || [];
                console.log('📊 Companies data:', companiesData);
                dispatch(setCompanies(companiesData));
            }
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button onClick={() => navigate("/admin/companies/create")}>
                        New Company
                    </Button>
                </div>
                {loading ? (
                    <div>Loading companies...</div>
                ) : (
                    <CompaniesTable companies={companies} onRefresh={fetchCompanies} />
                )}
            </div>
        </div>
    );
};

export default Companies;
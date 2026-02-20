// src/components/Job.jsx
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import CompanyLogo from './admin/CompanyLogo'
import { toast } from 'sonner'
import axios from 'axios'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [applying, setApplying] = useState(false);
    
    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }

    const handleApply = async () => {
        setApplying(true);
        try {
            // Use environment variable for API base URL
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://www.backendserver.aim9hire.com';
            const response = await axios.post(
                `${API_BASE_URL}/api/v1/application/${job._id}/apply`,
                {},
                { withCredentials: true }
            );
            
            if (response.data.success) {
                toast.success('Application submitted successfully!');
            }
        } catch (error) {
            // Handle suspension errors
            if (error.response?.status === 400) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 409) {
                toast.error('You have already applied for this job.');
            } else {
                toast.error('Failed to apply for job. Please try again.');
            }
        } finally {
            setApplying(false);
        }
    };
    
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <CompanyLogo 
                  companyId={job?.company?._id} 
                  companyName={job?.company?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                <Button 
                  className="bg-[#7209b7]" 
                  onClick={handleApply}
                  disabled={applying}
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </Button>
            </div>
        </div>
    )
}

export default Job

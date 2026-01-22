import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = allAdminJobs?.filter((job) => {
      if (!searchJobByText) return true;

      const titleMatch = job?.title?.toLowerCase().includes(searchJobByText.toLowerCase());
      const companyMatch = job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());

      return titleMatch || companyMatch;
    });

    setFilteredJobs(filtered || []);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="mt-6">
      <Table>
        <TableCaption>A list of jobs you have posted.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs?.length > 0 ? (
            filteredJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job?.company?.name}</TableCell>
                <TableCell>{job?.title}</TableCell>
                <TableCell>{job?.createdAt?.split('T')[0]}</TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button>
                        <MoreHorizontal className="w-5 h-5 text-gray-600 hover:text-black" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      {/* Fixed the URL pattern here */}
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                        className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </div>
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="flex items-center gap-2 cursor-pointer mt-2 hover:text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No jobs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable; 
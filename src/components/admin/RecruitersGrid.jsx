import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Shield,
  UserX,
  UserCheck
} from 'lucide-react';

const RecruitersGrid = ({ 
  recruiters, 
  onEdit, 
  onDelete, 
  onSuspend, 
  onActivate,
  onSendEmail 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter recruiters based on search and status
  const filteredRecruiters = recruiters.filter(recruiter => {
    const matchesSearch = 
      recruiter.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.company?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && !recruiter.isSuspended) ||
      (statusFilter === 'suspended' && recruiter.isSuspended);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (recruiter) => {
    if (recruiter.isSuspended) {
      return <Badge variant="destructive">Suspended</Badge>;
    }
    if (recruiter.recruiterProfile?.isVerified) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search recruiters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Recruiters Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Recruiter</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecruiters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No recruiters found
                </TableCell>
              </TableRow>
            ) : (
              filteredRecruiters.map((recruiter) => (
                <TableRow key={recruiter._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {recruiter.fullname?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {recruiter.fullname || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {recruiter.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      {recruiter.company?.companyName || 'No Company'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {recruiter.company?.industry || ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {recruiter.recruiterProfile?.position || 'Not specified'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {recruiter.recruiterProfile?.department || ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(recruiter)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {formatDate(recruiter.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onEdit(recruiter)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSendEmail(recruiter)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        {recruiter.recruiterProfile?.isVerified ? (
                          <DropdownMenuItem onClick={() => onEdit(recruiter)}>
                            <Shield className="w-4 h-4 mr-2" />
                            Manage Verification
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => onEdit(recruiter)}>
                            <Shield className="w-4 h-4 mr-2" />
                            Verify Account
                          </DropdownMenuItem>
                        )}
                        {recruiter.isSuspended ? (
                          <DropdownMenuItem 
                            onClick={() => onActivate(recruiter)}
                            className="text-green-600"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => onSuspend(recruiter)}
                            className="text-orange-600"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => onDelete(recruiter)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing {filteredRecruiters.length} of {recruiters.length} recruiters
        </div>
      </div>
    </div>
  );
};

export default RecruitersGrid;
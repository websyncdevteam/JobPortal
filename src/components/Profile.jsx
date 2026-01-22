import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    
    // Get API URL from environment or use default
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    // Safe profile data access
    const profile = user?.profile || {};
    const skills = profile.skills || [];
    const hasSkills = skills.length > 0;
    const hasResume = !!profile.resume;
    
    // ============================
    // 🔗 FIX: URL Helper Functions
    // ============================
    const getProfilePhotoUrl = () => {
        if (!profile.profilePhoto) {
            return "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg";
        }
        
        // If already a full URL, use it as-is
        if (profile.profilePhoto.startsWith('http://') || profile.profilePhoto.startsWith('https://')) {
            return profile.profilePhoto;
        }
        
        // If just a filename, add the base URL
        return `${API_BASE_URL}/api/uploads/${profile.profilePhoto}`;
    };
    
    const getResumeUrl = () => {
        if (!profile.resume) return '';
        
        // If already a full URL, use it as-is
        if (profile.resume.startsWith('http://') || profile.resume.startsWith('https://')) {
            return profile.resume;
        }
        
        // If just a filename, add the base URL
        return `${API_BASE_URL}/api/uploads/${profile.resume}`;
    };
    
    const getResumeFilename = () => {
        if (!profile.resume) return 'Resume';
        
        // Extract filename from URL or use stored filename
        if (profile.resumeOriginalName) {
            return profile.resumeOriginalName;
        }
        
        // Extract from URL if it's a URL
        if (profile.resume.includes('/')) {
            const parts = profile.resume.split('/');
            return parts[parts.length - 1];
        }
        
        return profile.resume;
    };
    
    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage 
                                src={getProfilePhotoUrl()} 
                                alt={`${user?.fullname || 'User'}'s profile`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg";
                                }}
                            />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname || 'No Name'}</h1>
                            <p className='text-gray-600'>{profile.bio || 'No bio added'}</p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => setOpen(true)} 
                        className="text-right" 
                        variant="outline"
                        aria-label="Edit profile"
                    >
                        <Pen className="h-4 w-4" />
                    </Button>
                </div>
                
                <div className='my-5 space-y-3'>
                    <div className='flex items-center gap-3'>
                        <Mail className="h-5 w-5 text-gray-500" />
                        <span className='text-gray-700'>{user?.email || 'No email'}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Contact className="h-5 w-5 text-gray-500" />
                        <span className='text-gray-700'>{user?.phoneNumber || 'No phone number'}</span>
                    </div>
                </div>
                
                <div className='my-5'>
                    <h1 className='font-semibold text-lg mb-2'>Skills</h1>
                    <div className='flex flex-wrap gap-2'>
                        {hasSkills ? (
                            skills.map((item, index) => (
                                <Badge key={index} variant="secondary">
                                    {item}
                                </Badge>
                            ))
                        ) : (
                            <span className='text-gray-500 italic'>No skills added</span>
                        )}
                    </div>
                </div>
                
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {hasResume ? (
                        <a 
                            target='_blank' 
                            rel='noopener noreferrer'
                            href={getResumeUrl()} 
                            className='text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors'
                            aria-label={`Download resume: ${getResumeFilename()}`}
                        >
                            {getResumeFilename()}
                        </a>
                    ) : (
                        <span className='text-gray-500 italic'>No resume uploaded</span>
                    )}
                </div>
            </div>
            
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile
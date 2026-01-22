import React, { useState } from 'react';
import { Calendar, Clock, Users, Video, Mail, Check, X, Loader } from 'lucide-react';

const InterviewScheduling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  
  // Mock interviews data
  const interviews = [
    {
      id: 1,
      candidate: 'John Doe',
      job: 'Senior Developer',
      date: new Date(2025, 7, 15, 14, 30),
      duration: 60,
      interviewers: ['Jane Smith', 'Mike Johnson'],
      round: 'Technical',
      link: 'https://meet.google.com/abc-xyz'
    },
    {
      id: 2,
      candidate: 'Sarah Johnson',
      job: 'UX Designer',
      date: new Date(2025, 7, 16, 10, 0),
      duration: 45,
      interviewers: ['Robert Brown'],
      round: 'Design Review',
      link: 'https://meet.google.com/def-uvw'
    },
    {
      id: 3,
      candidate: 'Michael Chen',
      job: 'Backend Engineer',
      date: new Date(2025, 7, 18, 11, 30),
      duration: 90,
      interviewers: ['Emily Davis', 'David Wilson'],
      round: 'System Design',
      link: 'https://meet.google.com/ghi-rst'
    }
  ];

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(`${hour}:${minute === 0 ? '00' : minute}`);
      }
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Interview Scheduling</h1>
        <button 
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => setShowForm(true)}
        >
          <Calendar className="mr-2" size={18} />
          Schedule Interview
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3">
            <h2 className="font-bold text-lg mb-4">Upcoming Interviews</h2>
            <div className="space-y-4">
              {interviews.map(interview => (
                <div key={interview.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{interview.candidate}</h3>
                      <p className="text-gray-500 text-sm">{interview.job} - {interview.round}</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">
                      {interview.date.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex items-center text-gray-500 text-sm">
                    <Clock size={16} className="mr-1" />
                    <span>
                      {interview.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(interview.date.getTime() + interview.duration * 60000)
                        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center text-gray-500 text-sm">
                    <Users size={16} className="mr-1" />
                    <span>{interview.interviewers.join(', ')}</span>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <a 
                      href={interview.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-indigo-50 text-indigo-700 py-1.5 rounded-lg text-center hover:bg-indigo-100"
                    >
                      Join Meeting
                    </a>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded-lg hover:bg-gray-200">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-2/3">
            <h2 className="font-bold text-lg mb-4">Calendar View</h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-gray-500 font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg border border-gray-200 h-24 p-2 cursor-pointer hover:bg-indigo-50"
                  >
                    <div className="text-right text-sm">
                      {index < 31 ? index + 1 : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Schedule New Interview</h2>
              <button onClick={() => setShowForm(false)}>
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Candidate
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option>John Doe (Senior Developer)</option>
                    <option>Sarah Johnson (UX Designer)</option>
                    <option>Michael Chen (Backend Engineer)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Round
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option>Technical Screening</option>
                    <option>Coding Challenge</option>
                    <option>System Design</option>
                    <option>HR Discussion</option>
                    <option>Final Interview</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    {timeSlots.map(slot => (
                      <option key={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    defaultValue="60"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interviewers
                  </label>
                  <input
                    type="text"
                    placeholder="Enter emails separated by commas"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="https://meet.google.com/abc-xyz"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button className="bg-indigo-600 text-white px-4 rounded-r-lg hover:bg-indigo-700">
                    Generate
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Interview focus areas, special instructions, etc."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="flex items-center">
                    <Mail size={18} className="mr-2" />
                    Send Invitation
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduling;
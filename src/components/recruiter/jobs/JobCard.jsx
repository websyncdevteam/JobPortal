const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between">
          <h3 className="font-semibold text-lg truncate">{job.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            job.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {job.status === 'active' ? 'Active' : 'Closed'}
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1 truncate">{job.company} • {job.location}</p>
      </div>
      
      <div className="p-4 flex justify-between items-center">
        <div>
          <span className="font-medium">{job.applicants}</span>
          <span className="text-gray-500 text-sm ml-1">applicants</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-1 text-gray-500 hover:text-blue-600">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-500 hover:text-red-600">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
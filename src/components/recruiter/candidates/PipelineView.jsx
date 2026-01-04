const PipelineView = () => {
  const stages = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'];
  
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {stages.map(stage => (
        <div key={stage} className="min-w-[280px] bg-gray-50 rounded-lg">
          <div className="p-3 border-b">
            <h3 className="font-medium">{stage}</h3>
          </div>
          <div className="p-2 space-y-2">
            <div className="bg-white rounded-lg shadow-xs p-3 border border-gray-200">
              <div className="flex items-start">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-3 flex-1">
                  <h4 className="font-medium">John Doe</h4>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                      Schedule
                    </button>
                    <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
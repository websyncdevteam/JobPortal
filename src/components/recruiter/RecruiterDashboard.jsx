import { useState } from 'react';
import { Tab } from '@headlessui/react';
import JobManagement from './JobManagement';
import CandidateManagement from './CandidateManagement';
import Analytics from './Analytics';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const RecruiterDashboard = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6">
          {['Jobs', 'Candidates', 'Analytics'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm leading-5 font-medium text-gray-700 rounded-lg',
                  selected
                    ? 'bg-white shadow text-indigo-600'
                    : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <JobManagement />
          </Tab.Panel>

          <Tab.Panel>
            <CandidateManagement />
          </Tab.Panel>

          <Tab.Panel>
            <Analytics />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default RecruiterDashboard;
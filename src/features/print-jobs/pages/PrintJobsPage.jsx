import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PrintJobFilters from '../components/PrintJobFilters';
import PrintJobColumn from '../components/PrintJobColumn';
import NewJobModal from '../components/NewJobModal';
import JobDetailModal from '../components/JobDetailModal';
import {
  mockPrintJobColumns,
  mockPrintJobs,
  mockStaffOptions,
  mockJobTypeOptions,
  mockDueOptions,
} from '../data/mockPrintJobData';

export const PrintJobsPage = () => {
  const [jobs, setJobs] = useState(mockPrintJobs);
  const [selectedStaff, setSelectedStaff] = useState('All staff');
  const [selectedType, setSelectedType] = useState('All job types');
  const [selectedDue, setSelectedDue] = useState('Due: any time');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

  // Filter jobs based on active filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search matches job ID, customer, or title
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.id.toLowerCase().includes(q) ||
        job.customer.toLowerCase().includes(q) ||
        job.title.toLowerCase().includes(q);

      // Staff filter
      const matchesStaff =
        selectedStaff === 'All staff' || job.staff === selectedStaff;

      // Job Type filter
      const matchesType =
        selectedType === 'All job types' || job.jobType === selectedType;

      // Due time filter
      let matchesDue = true;
      if (selectedDue === 'Due today') {
        matchesDue = job.timing?.toLowerCase().includes('today');
      } else if (selectedDue === 'Ready for collection') {
        matchesDue = job.status === 'ready' || job.timing?.toLowerCase().includes('ready');
      }

      return matchesSearch && matchesStaff && matchesType && matchesDue;
    });
  }, [jobs, searchQuery, selectedStaff, selectedType, selectedDue]);

  // Drag and drop handler
  const handleDragStart = (e, jobId) => {
    e.dataTransfer.setData('text/plain', jobId);
  };

  const handleDropJob = (jobId, targetStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: targetStatus } : job
      )
    );
  };

  const handleAddNewJob = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const handleUpdateJobStatus = (jobId, newStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
  };

  const handleDeleteJob = (jobId) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  // Header Actions button
  const headerActions = (
    <button
      type="button"
      onClick={() => setIsNewModalOpen(true)}
      className="bg-[#e8a838] hover:bg-[#d89727] text-[#131d33] font-semibold text-xs md:text-sm px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#e8a838]/50"
    >
      <Plus className="w-4 h-4 stroke-[2.5]" />
      <span>New job</span>
    </button>
  );

  return (
    <DashboardLayout
      title="Print job management"
      subtitle="23 active jobs · drag a ticket to update its status"
      headerActions={headerActions}
    >
      {/* Top Filter Bar */}
      <PrintJobFilters
        selectedStaff={selectedStaff}
        onStaffChange={setSelectedStaff}
        staffOptions={mockStaffOptions}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        typeOptions={mockJobTypeOptions}
        selectedDue={selectedDue}
        onDueChange={setSelectedDue}
        dueOptions={mockDueOptions}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Kanban Board Grid (5 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-start overflow-x-auto pb-6">
        {mockPrintJobColumns.map((col) => {
          const colJobs = filteredJobs.filter((job) => job.status === col.id);
          // Set Completed column default badge to 142 unless filtered
          const badgeCount =
            col.id === 'completed' && searchQuery === '' && selectedStaff === 'All staff' && selectedType === 'All job types' && selectedDue === 'Due: any time'
              ? 142
              : colJobs.length;

          return (
            <PrintJobColumn
              key={col.id}
              column={col}
              jobs={colJobs}
              badgeCount={badgeCount}
              onCardClick={(job) => setViewingJob(job)}
              onDragStart={handleDragStart}
              onDropJob={handleDropJob}
            />
          );
        })}
      </div>

      {/* New Job Modal */}
      <NewJobModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAdd={handleAddNewJob}
        staffOptions={mockStaffOptions}
        jobTypeOptions={mockJobTypeOptions}
        columns={mockPrintJobColumns}
      />

      {/* Job Details Modal */}
      <JobDetailModal
        isOpen={!!viewingJob}
        job={viewingJob}
        onClose={() => setViewingJob(null)}
        columns={mockPrintJobColumns}
        onUpdateStatus={handleUpdateJobStatus}
        onDelete={handleDeleteJob}
      />
    </DashboardLayout>
  );
};

export default PrintJobsPage;

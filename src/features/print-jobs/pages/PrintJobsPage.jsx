import { useState, useMemo, useEffect } from 'react';
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
import {
  subscribeToPrintJobs,
  createPrintJob,
  updatePrintJobStatus,
  deletePrintJob,
} from '../../../services/printJobService';

export const PrintJobsPage = () => {
  const [jobs, setJobs] = useState(mockPrintJobs);
  const [selectedStaff, setSelectedStaff] = useState('All staff');
  const [selectedType, setSelectedType] = useState('All job types');
  const [selectedDue, setSelectedDue] = useState('Due: any time');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeToPrintJobs(
      (firestoreJobs) => {
        if (firestoreJobs && firestoreJobs.length > 0) {
          setJobs(firestoreJobs);
        }
      },
      (error) => {
        console.error('Firestore print jobs subscription error:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter jobs based on active filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = searchQuery.toLowerCase().trim();
      const id = job.id || '';
      const customer = job.customer || '';
      const title = job.title || '';

      const matchesSearch =
        !q ||
        id.toLowerCase().includes(q) ||
        customer.toLowerCase().includes(q) ||
        title.toLowerCase().includes(q);

      const matchesStaff =
        selectedStaff === 'All staff' || job.staff === selectedStaff;

      const matchesType =
        selectedType === 'All job types' || job.jobType === selectedType;

      let matchesDue = true;
      if (selectedDue === 'Due today') {
        matchesDue = job.timing?.toLowerCase().includes('today');
      } else if (selectedDue === 'Ready for collection') {
        matchesDue = job.status === 'ready' || job.timing?.toLowerCase().includes('ready');
      }

      return matchesSearch && matchesStaff && matchesType && matchesDue;
    });
  }, [jobs, searchQuery, selectedStaff, selectedType, selectedDue]);

  // Drag and drop handler with Firestore synchronization
  const handleDragStart = (e, jobId) => {
    e.dataTransfer.setData('text/plain', jobId);
  };

  const handleDropJob = async (jobId, targetStatus) => {
    // Optimistic UI update
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: targetStatus } : job
      )
    );

    try {
      await updatePrintJobStatus(jobId, targetStatus);
    } catch (error) {
      console.error('Failed to update job status in Firestore:', error);
    }
  };

  // Add new job with Firestore synchronization
  const handleAddNewJob = async (newJob) => {
    try {
      await createPrintJob(newJob);
    } catch (error) {
      console.error('Failed to create job in Firestore:', error);
      setJobs((prev) => [newJob, ...prev]);
    }
  };

  // Update status from modal with Firestore synchronization
  const handleUpdateJobStatus = async (jobId, newStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );

    try {
      await updatePrintJobStatus(jobId, newStatus);
    } catch (error) {
      console.error('Failed to update job status in Firestore:', error);
    }
  };

  // Delete job with Firestore synchronization
  const handleDeleteJob = async (jobId) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    try {
      await deletePrintJob(jobId);
    } catch (error) {
      console.error('Failed to delete job from Firestore:', error);
    }
  };

  const activeJobsCount = jobs.filter((j) => j.status !== 'completed').length;

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
      subtitle={`${activeJobsCount} active jobs · drag a ticket to update its status`}
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
          const badgeCount = colJobs.length;

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

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { FileText, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';

interface Assignment {
  _id: string;
  title: string;
  course: string;
  courseCode: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  obtainedMarks?: number;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Graded';
  submittedOn?: string;
}

const Assignments = () => {
  const [assignments] = useState<Assignment[]>([
    {
      _id: '1',
      title: 'DB Design Project',
      course: 'Database Systems',
      courseCode: 'CS210',
      description: 'Design and implement a complete database system for a library management system',
      dueDate: '2026-01-28',
      totalMarks: 100,
      status: 'In Progress'
    },
    {
      _id: '2',
      title: 'Routing Lab',
      course: 'Computer Networks',
      courseCode: 'CS230',
      description: 'Configure network routing protocols and analyze packet flow',
      dueDate: '2026-01-29',
      totalMarks: 50,
      status: 'Not Started'
    },
    {
      _id: '3',
      title: 'AVL Trees Implementation',
      course: 'Data Structures',
      courseCode: 'CS201',
      description: 'Implement AVL tree with insertion, deletion, and balancing operations',
      dueDate: '2026-02-02',
      totalMarks: 75,
      obtainedMarks: 70,
      status: 'Graded',
      submittedOn: '2026-01-25'
    },
    {
      _id: '4',
      title: 'Process Scheduling',
      course: 'Operating Systems',
      courseCode: 'CS240',
      description: 'Simulate CPU scheduling algorithms (FCFS, SJF, Round Robin)',
      dueDate: '2026-02-05',
      totalMarks: 80,
      status: 'Not Started'
    },
    {
      _id: '5',
      title: 'SQL Query Optimization',
      course: 'Database Systems',
      courseCode: 'CS210',
      description: 'Analyze and optimize complex SQL queries for better performance',
      dueDate: '2026-01-26',
      totalMarks: 60,
      obtainedMarks: 58,
      status: 'Graded',
      submittedOn: '2026-01-24'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Graded':
        return 'bg-green-100 text-green-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const pendingAssignments = assignments.filter(a => a.status === 'Not Started' || a.status === 'In Progress');
  const completedAssignments = assignments.filter(a => a.status === 'Submitted' || a.status === 'Graded');

  return (
    <DashboardLayout title="Assignments">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingAssignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedAssignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <AlertCircle className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedAssignments.filter(a => a.obtainedMarks).length > 0
                    ? Math.round(
                        completedAssignments
                          .filter(a => a.obtainedMarks)
                          .reduce((sum, a) => sum + ((a.obtainedMarks! / a.totalMarks) * 100), 0) /
                          completedAssignments.filter(a => a.obtainedMarks).length
                      )
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Assignments */}
        {pendingAssignments.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Assignments</h2>
            <div className="space-y-4">
              {pendingAssignments.map((assignment) => {
                const daysRemaining = getDaysRemaining(assignment.dueDate);
                const isOverdue = daysRemaining < 0;
                const isDueSoon = daysRemaining >= 0 && daysRemaining <= 2;

                return (
                  <div
                    key={assignment._id}
                    className={`border rounded-lg p-4 hover:shadow-md transition ${
                      isOverdue ? 'border-red-300 bg-red-50' : isDueSoon ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {assignment.courseCode} - {assignment.course}
                        </p>
                        <p className="text-sm text-gray-700">{assignment.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock size={16} className={isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-gray-600'} />
                          <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : isDueSoon ? 'text-yellow-600 font-medium' : 'text-gray-600'}`}>
                            {isOverdue
                              ? `Overdue by ${Math.abs(daysRemaining)} days`
                              : daysRemaining === 0
                              ? 'Due today'
                              : daysRemaining === 1
                              ? 'Due tomorrow'
                              : `Due in ${daysRemaining} days`}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">Max: {assignment.totalMarks} marks</span>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2">
                        <Upload size={16} />
                        Submit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Assignments */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Assignments</h2>
          {completedAssignments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No completed assignments yet</p>
          ) : (
            <div className="space-y-4">
              {completedAssignments.map((assignment) => (
                <div key={assignment._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {assignment.courseCode} - {assignment.course}
                      </p>
                      {assignment.submittedOn && (
                        <p className="text-xs text-gray-500">Submitted on {new Date(assignment.submittedOn).toLocaleDateString()}</p>
                      )}
                    </div>
                    {assignment.obtainedMarks !== undefined && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {assignment.obtainedMarks}/{assignment.totalMarks}
                        </p>
                        <p className="text-sm text-gray-600">
                          {((assignment.obtainedMarks / assignment.totalMarks) * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assignments;

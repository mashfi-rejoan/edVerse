import DashboardLayout from '../../components/DashboardLayout';
import EventCalendarView from './EventCalendarView';

const StudentEventCalendar = () => {
  return <EventCalendarView Layout={DashboardLayout} title="Calendar" />;
};

export default StudentEventCalendar;

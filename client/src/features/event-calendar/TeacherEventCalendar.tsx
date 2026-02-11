import TeacherDashboardLayout from '../../components/TeacherDashboardLayout';
import EventCalendarView from './EventCalendarView';

const TeacherEventCalendar = () => {
  return <EventCalendarView Layout={TeacherDashboardLayout} title="Calendar" />;
};

export default TeacherEventCalendar;

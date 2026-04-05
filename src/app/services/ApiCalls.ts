import axios from 'axios'

// export  const Api_Endpoint ="http://196.175.251.141:8085/afs-api/api";
// export const Api_Endpoint = 'https://localhost:7045/api'
// export const Report_URL = "http://localhost/HRMS-Reports/"
// export const Report_URL = "https://15.236.239.129/2i-reports/"
export const Report_URL = "https://2i-institut.com/2i-reports/"
export const Api_Endpoint = 'https://localhost:7294/api'
// export  const Api_Endpoint ="https://15.236.239.129/2i-api/api";
// export  const Api_Endpoint ="https://2i-institut.com/2i-api/api";
// 

export const fetchUsersApi = (status:any) => {
  return axios.get(`${Api_Endpoint}/users?status=${status}`)
}
export const fetchStudentsApi = (status:any) => {
  return axios.get(`${Api_Endpoint}/users/students?status=${status}`)
}
export const fetchAllClasses= () => {
  return axios.get(`${Api_Endpoint}/Classes`)
}
export const fetchAllSemesterClasses= (id:any) => {
  return axios.get(`${Api_Endpoint}/SemesterClasses/${id}`)
}
export const fetchAcademicProgram= () => {
  return axios.get(`${Api_Endpoint}/Classes/AcademicProgram`)
}
export const fetchAllLibraryBooks= () => {
  return axios.get(`${Api_Endpoint}/Library`)
}
export const fetchAllCoursesFiles= () => {
  return axios.get(`${Api_Endpoint}/CoursesFiles`)
}
export const fetchAllGrades= () => {
  return axios.get(`${Api_Endpoint}/grades`)
}
export const fetchStudentGrades= (id:any) => {
  return axios.get(`${Api_Endpoint}/grades/student/${id}`)
}
export const fetchTeacherGradesEntry= (id:any) => {
  return axios.get(`${Api_Endpoint}/grades/teacher/${id}`)
}
export const deleteGradeApi= (id:any) => {
  return axios.delete(`${Api_Endpoint}/grades?id=${id}`)
}
export const fetchAllLibraryGenre= () => {
  return axios.get(`${Api_Endpoint}/LibraryGenre`)
}
export const fetchAllCourses= () => {
  return axios.get(`${Api_Endpoint}/courses`)
}
export const fetchAllClassesCourses= (id:any) => {
  return axios.get(`${Api_Endpoint}/ClassesCourses/${id}`)
}
export const fetchAllActiveClassesCourses= (id:any) => {
  return axios.get(`${Api_Endpoint}/ClassesCourses/Active/${id}`)
}
export const deleteClassesCourses= (id:any) => {
  return axios.delete(`${Api_Endpoint}/ClassesCourses?id=${id}`)
}
export const fetchAllTeachersCourses= (id:any) => {
  return axios.get(`${Api_Endpoint}/TeachersCourses/${id}`)
}
export const fetchAllTeacherTaughtCourses= (id:any) => {
  return axios.get(`${Api_Endpoint}/TeachersCourses/TaughtCourses/${id}`)
}
export const deleteTeachersCourses= (id:any) => {
  return axios.delete(`${Api_Endpoint}/TeachersCourses?id=${id}`)
}
export const DeleteLibraryApi= (id:any) => {
  return axios.delete(`${Api_Endpoint}/Library?id=${id}`)
}
export const deleteClassesApi = (id:any) => {
  return axios.delete(`${Api_Endpoint}/classes?id=${id}`)
}
export const fetchAllMeetingLinks= (id:any) => {
  return axios.get(`${Api_Endpoint}/meetingLinks`)
  // return axios.get(`${Api_Endpoint}/meetingLinks/${id}`)
}
export const deleteMeetingLinksApi = (id:any) => {
  return axios.delete(`${Api_Endpoint}/meetingLinks?id=${id}`)
}
export const fetchAllTeachersClasses= (id:any) => {
  return axios.get(`${Api_Endpoint}/TeachersClasses/${id}`)
}
export const fetchAllCurrentTeachersClasses= (id:any) => {
  return axios.get(`${Api_Endpoint}/TeachersClasses/CurrentSpecificTaughtClasses/${id}`)
}
export const fetchAllTeachersStudents= (id:any,semesterId:any) => {
  return axios.get(`${Api_Endpoint}/TeachersClasses/teacherStudents/${id}/${semesterId}`)
}
export const fetchAllCurrentYearTeachersStudents= (id:any) => {
  return axios.get(`${Api_Endpoint}/TeachersClasses/currentYearTeacherStudents/${id}`)
}
export const fetchAllStudents= () => {
  return axios.get(`${Api_Endpoint}/Students`)
}
export const fetchAllStudentsPayments= () => {
  return axios.get(`${Api_Endpoint}/StudentsPayments`)
}
export const fetchAllUE= (id:any) => {
  return axios.get(`${Api_Endpoint}/UE?semesterId=${id}`)
}
export const fetchAllTeachers= () => {
  return axios.get(`${Api_Endpoint}/Teachers`)
}
export const fetchCurrentTeacher= (id:any) => {
  return axios.get(`${Api_Endpoint}/Teachers/${id}`)
}
export const deleteTeachersApi = (id:any) => {
  return axios.delete(`${Api_Endpoint}/Teachers?id=${id}`)
}
export const fetchAllLeaves = () => {
  return axios.get(`${Api_Endpoint}/Leaves`)
}
export const fetchPendingLeavesCount = () => {
  return axios.get(`${Api_Endpoint}/Leaves/PendingLeavesCount`)
}
export const fetchHolidays = () => {
  return axios.get(`${Api_Endpoint}/Holidays`)
}
export const deleteHolidayApi = (id:any) => {
  return axios.delete(`${Api_Endpoint}/Holidays?id=${id}`)
}
export const fetchLeaveTransactions = () => {
  return axios.get(`${Api_Endpoint}/LeaveTransactions`)
}
export const deleteLeaveTransactionsApi = (id:any) => {
  return axios.delete(`${Api_Endpoint}/LeaveTransactions?id=${id}`)
}
export const fetchCurrentUserActiveLeaves = (id:any) => {
  return axios.get(`${Api_Endpoint}/Leaves/UserActiveLeaves?userId=${id}`)
}
export const fetchCurrentUserPendingLeaves = (id:any) => {
  return axios.get(`${Api_Endpoint}/Leaves/UserPendingLeaves?userId=${id}`)
}
export const fetchCurrentUserLeaves = (id:any) => {
  return axios.get(`${Api_Endpoint}/Leaves/UserLeaves?userId=${id}`)
}
export const fetchCurrentUserApprovedLeaves = (id:any) => {
  return axios.get(`${Api_Endpoint}/Leaves/UserApprovedLeaves?userId=${id}`)
}
export const fetchCurrentUserRejectedLeaves = (id:any) => {
  return axios.get(`${Api_Endpoint}/Leaves/UserRejectedLeaves?userId=${id}`)
}
export const fetchCurrentUserRemainingLeaveDays = (id:any) => {
  return axios.get(`${Api_Endpoint}/Leaves/RemainingLeaveDays?userId=${id}`)
}
export const fetchAllActiveLeaves = () => {
  return axios.get(`${Api_Endpoint}/Leaves/AllActiveLeaves`)
}
export const fetchAllApprovedLeaves = () => {
  return axios.get(`${Api_Endpoint}/Leaves/AllApprovedLeaves`)
}
export const fetchAllPendingLeaves = () => {
  return axios.get(`${Api_Endpoint}/Leaves/AllPendingLeaves`)
}
export const fetchAllRejectedLeaves = () => {
  return axios.get(`${Api_Endpoint}/Leaves/AllRejectedLeaves`)
}
export const deleteLeaveRequestApi = (id: any,leaveType:any) => {
  return axios.delete(`${Api_Endpoint}/Leaves?id=${id}&leaveType=${leaveType}`, id)
}
export const fetchLeavePolicy = () => {
  return axios.get(`${Api_Endpoint}/LeavePolicyConfig`)
}
export const fetchDepartmentsApi = () => {
  return axios.get(`${Api_Endpoint}/departments`)
}
// export const fetchRemaningMessageBalance = () => {
//   return axios.get(`https://apps.mnotify.net/smsapi/balance?key=aASSWW7qZahf5eLBfzdZhP5Pk`)
// }
export const fetchUserPositionApi = (id:any) => {
  return axios.get(`${Api_Endpoint}/userposition?id=${id}`)
}
export const fetchAllUserPositionApi = () => {
  return axios.get(`${Api_Endpoint}/userposition`)
}
export const deleteUserPositionApi = (id: any) => {
  return axios.delete(`${Api_Endpoint}/userPosition?id=${id}`, id)
}
export const deleteUserApi = (id: any) => {
  return axios.delete(`${Api_Endpoint}/users/${id}`, id)
}
export const deleteRoleApi = (id: any) => {
  return axios.delete(`${Api_Endpoint}/departments?id=${id}`, id)
}
export const fetchDepartments=(id:any)=>{
  return  axios.get(`${Api_Endpoint}/Departments`)
}
export const deleteDepartments=(id:any)=>{
 return  axios.delete(`${Api_Endpoint}/Departments?id=${id}`)
}
export const fetchAttendance=()=>{
 return  axios.get(`${Api_Endpoint}/Attendance`)
}
export const fetchEmployees=()=>{
 return  axios.get(`${Api_Endpoint}/Employees`)
}
export const fetchTotalStudents=()=>{
 return  axios.get(`${Api_Endpoint}/stats/TotalStudents`)
}
export const fetchTotalUserDetails=(status:any,departmentId:any)=>{
 return  axios.get(`${Api_Endpoint}/stats/TotalUsers/details?status=${status}&departmentId=${departmentId}`)
}
export const fetchTotalUserGenderDetails=(status:any,departmentId:any,sex:any)=>{
 return  axios.get(`${Api_Endpoint}/stats/TotalUsers/details?status=${status}&departmentId=${departmentId}&sex=${sex}`)
}
export const fetchTotalStudentsGender=()=>{
 return  axios.get(`${Api_Endpoint}/stats/TotalStudentsGender`)
}
export const fetchTotalTeacher=()=>{
 return  axios.get(`${Api_Endpoint}/stats/TotalTeacher`)
}
export const fetchTotalTeacherGender=()=>{
 return  axios.get(`${Api_Endpoint}/stats/TotalTeacherGender`)
}
export const fetchTotalStaff=()=>{
 return  axios.get(`${Api_Endpoint}/stats/TotalStaff`)
}
export const fetchTotalStaffGender=()=>{
 return  axios.get(`${Api_Endpoint}/stats/TotalStaffGender`)
}
export const fetchTotalBooks=()=>{
 return  axios.get(`${Api_Endpoint}/stats/TotalBooks`)
}
// export const fetchTimetable = async (): Promise<AxiosResponse<TimetableEntry[]>> => {
export const fetchTimetable =()=> {
  // const response = await axios.get<TimetableEntry[]>('https://localhost:7241/api/Timetables');
  // const response =  axios.get(`${Api_Endpoint}/Timetables`);
  // return response;
  return  axios.get(`${Api_Endpoint}/Timetables`);
};
export const fetchUserClassTimetable =(studentId:any,departmentId:any)=> {
  // const response = await axios.get<TimetableEntry[]>('https://localhost:7241/api/Timetables');
  // const response =  axios.get(`${Api_Endpoint}/Timetables`);
  // return response;
  return  axios.get(`${Api_Endpoint}/Timetables/${studentId}?departmentId=${departmentId}`);
};
import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
// import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import { PageLink, PageTitle } from '../../_metronic/layout/core'
import { Holidays } from '../pages/setup/Holidays/holidays'
import { HolidaysEditForm } from '../pages/setup/Holidays/holidaysEditForm'
import { HolidaysForm } from '../pages/setup/Holidays/holidaysForm'
import { LeaveTransactions } from '../pages/setup/LeaveTransactions/leaveTransactions'
import { LeaveTransactionsEditForm } from '../pages/setup/LeaveTransactions/LeaveTransactionsEditForm'
import { LeaveTransactionsForm } from '../pages/setup/LeaveTransactions/leaveTransactionsForm'
import { Departments } from '../pages/setup/departments/departments'
import { DepartmentsEditForm } from '../pages/setup/departments/DepartmentsEditForm'
import { DepartmentsForm } from '../pages/setup/departments/departmentsForm'
import { UserPositionEditForm } from '../pages/setup/departments/UserPositionEditForm'
import { UserPositionForm } from '../pages/setup/departments/UserPositionForm'
import { UserPostions } from '../pages/setup/departments/UserPositions'
import { LeavePolicy } from '../pages/setup/LeavePolicy/LeavePolicy'
import { LeavePolicyEditForm } from '../pages/setup/LeavePolicy/LeavePolicyEditForm'
import { InactiveUsers } from '../pages/setup/users/InactiveUsers'
import { Users } from '../pages/setup/users/Users'
import { UserEditForm } from '../pages/setup/users/userEditForm'
import { UsersForm } from '../pages/setup/users/UsersForm'
// import { AttendanceReport } from '../pages/report/'
import { EmployeeReportPage } from '../pages/report/EmployeeReportPage'
import AttendanceReport from '../pages/report/AttendanceReport'
import LateAndEarlyCheckersReport from '../pages/report/LateAndEarlyCheckersReport'
import AbsenteesListReport from '../pages/report/AbsenteesListReport'
import { AboutUs } from '../pages/AboutUs/AboutUs'
import { HomePage } from '../pages/HomePage/homePage'
import { useAuth } from '../modules/auth'
import GradesReport from '../pages/report/GradesReport'
import { Error404 } from '../modules/errors/components/Error404'
import { StudentsSetup } from '../pages/setup/Students/Students'
// import { StudentsEditForm } from '../pages/setup/Students/studentsEditForm'
import { StudentsForm } from '../pages/setup/Students/StudentsForm'
import { StudentsEditForm } from '../pages/setup/Students/StudentsEditForm'
import { ProductsPage } from '../pages/setup/Products/productsPage'
import { StockPage } from '../pages/setup/Stocks/StockPage'
import DashboardPage from '../pages/Dashboard/dashboard'

const PrivateRoutes = () => {
  // const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  // const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  // const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  // const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  // const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  // const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))
  const accountBreadCrumbs: Array<PageLink> = [
    {
      title: '',
      path: '/cycle_details/cycle-details',
      isSeparator: false,
      isActive: false,
    },
  ]
  const {currentUser} = useAuth()
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        {/* <Route path='dashboard' element={<DashboardWrapper />} /> */}
        <Route path='dashboard' element={
          // currentUser?.departmentId==32?
          <DashboardPage />
        // <HomePage />
        } />
        {/* <Route path='dashboard' element={<Attendance />} /> */}
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        
        <Route
          path='HomePage/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Home Page</PageTitle>
              <HomePage />
            </SuspensedView>
          }
        />
        <Route
          path='Setup/Products/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Products</PageTitle>
              <ProductsPage />
            </SuspensedView>
          }
        />
        <Route
          path='Setup/Stocks/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Stocks</PageTitle>
              <StockPage />
            </SuspensedView>
          }
        />
        {currentUser?.departmentId==32?(<Route
          path='StudentsSetup/addForm/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Ajout d'Etudiants</PageTitle>
              <StudentsForm />
            </SuspensedView>
          }
        />):null}
        {currentUser?.departmentId==32?(<Route
          path='StudentsSetup/editForm/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Modification d'Etudiants</PageTitle>
              <StudentsEditForm />
            </SuspensedView>
          }
        />):null}
        
       
        <Route
          path='Holidays/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Holidays</PageTitle>
              <Holidays />
            </SuspensedView>
          }
        />
        <Route
          path='GradesReport/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Grades</PageTitle>
              <GradesReport />
            </SuspensedView>
          }
        />
        <Route
          path='holidays/addForm/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Holidays Form</PageTitle>
              <HolidaysForm />
            </SuspensedView>
          }
        />
        <Route
          path='holidays/editForm/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Holidays Edit Form</PageTitle>
              <HolidaysEditForm />
            </SuspensedView>
          }
        />
        <Route
          path='LeaveTransactions/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Leave Transactions</PageTitle>
              <LeaveTransactions />
            </SuspensedView>
          }
        />
        <Route
          path='LeaveTransactions/addForm/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Leave Transactions Form</PageTitle>
              <LeaveTransactionsForm />
            </SuspensedView>
          }
        />
        <Route
          path='LeaveTransactions/editForm/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Leave Transactions Edit Form</PageTitle>
              <LeaveTransactionsEditForm />
            </SuspensedView>
          }
        />
        <Route
          path='departments/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Departments</PageTitle>
              <Departments/>
            </SuspensedView>
          }
        />
        <Route
          path='departmentsForm/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Departments Form</PageTitle>
              <DepartmentsForm/>
            </SuspensedView>
          }
        />
        <Route
          path='departments/EditForm/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Edit Form</PageTitle>
              <DepartmentsEditForm/>
            </SuspensedView>
          }
        />
        <Route
          path='departments/userpositions/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Positions</PageTitle>
              <UserPostions/>
            </SuspensedView>
          }
        />
       <Route
          path='departments/userpositions/addForm/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Position Form</PageTitle>
              <UserPositionForm/>
            </SuspensedView>
          }
        />
       <Route
          path='departments/userpositions/EditForm/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Position Edit Form</PageTitle>
              <UserPositionEditForm/>
            </SuspensedView>
          }
        />
        {/* <Route
          path='leaves/authorizations/leaveForm/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Leave Form</PageTitle>
              <AdminLeaveRequestForm/>
            </SuspensedView>
          }
        /> */}
       
       
        <Route
          path='leavePolicy/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Leave Policy</PageTitle>
              <LeavePolicy/>
            </SuspensedView>
          }
        />
        <Route
          path='leavePolicy/edit/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Edit Leave Policy</PageTitle>
              <LeavePolicyEditForm/>
            </SuspensedView>
          }
        />
        <Route
          path='/activeUsers'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Active Users</PageTitle>
              <Users/>
            </SuspensedView>
          }
        />
         <Route
          path='/inactiveUsers'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Inactive Users</PageTitle>
              <InactiveUsers/>
            </SuspensedView>
          }
        />
        <Route
          path='/users/userEditForm/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Edit</PageTitle>
              <UserEditForm/>
            </SuspensedView>
          }
        />
          <Route
           path='/usersForm'
           element={
             <SuspensedView>
               <PageTitle breadcrumbs={accountBreadCrumbs}>User Registration</PageTitle>
               <UsersForm/>
             </SuspensedView>
           }
         />
          
          <Route
           path='/AboutUs'
           element={
             <SuspensedView>
               <PageTitle breadcrumbs={accountBreadCrumbs}>About 2i</PageTitle>
               <AboutUs/>
             </SuspensedView>
           }
         />
         <Route
          path='AttendanceReport/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Attendance Report</PageTitle>
              <AttendanceReport />
            </SuspensedView>
          }
        />
         <Route
          path='AbsenteesListReport/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Absentees List Report</PageTitle>
              <AbsenteesListReport />
            </SuspensedView>
          }
        />
         <Route
          path='LateAndEarlyCheckersReport/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Late And Early Checkers Report</PageTitle>
              <LateAndEarlyCheckersReport />
            </SuspensedView>
          }
        />
        <Route
          path='report-page/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>All Reports</PageTitle>
              <EmployeeReportPage />
            </SuspensedView>
          }
        />
        
        
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}

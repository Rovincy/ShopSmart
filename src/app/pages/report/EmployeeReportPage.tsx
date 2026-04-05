import { Link } from 'react-router-dom'
import { useAuth } from '../../modules/auth'

const EmployeeReportPage = () => {
  const {currentUser} = useAuth()
  return (
    <div 
    
    >
      <div className='row col-12 mb-10'>
       
     
        {currentUser?.departmentId==11||
        currentUser?.departmentId==23||
        currentUser?.departmentId==32?(<div className='col-3'
          style={{
              backgroundColor: 'white',
              padding: '20px',
              margin:'0px 10px 0px 10px',
              borderRadius: '5px',
              boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            }}
        >
          <h2>HR Reports</h2>
          <hr></hr>
          <br></br>
          {/* <h2><span className="bullet me-5"></span><Link to="/AttendanceReport">Attendance Report</Link></h2>
          <h2><span className="bullet me-5"></span><Link to="/AbsenteesListReport">Absentees List Report</Link></h2>
          <h2><span className="bullet me-5"></span><Link to="/LateAndEarlyCheckersReport">Late and early checker Report</Link></h2> */}
          <h2><span className="bullet me-5"></span><Link to="/GradesReport">Bulletins</Link></h2>
          
        </div>):null}
        
        
      </div>
    </div>
  )
}

export {EmployeeReportPage}

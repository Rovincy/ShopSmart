import {useState} from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {Link} from 'react-router-dom'
// import './formStyle.css'
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface'
import {UploadOutlined} from '@ant-design/icons'
import {Button, Upload, message} from 'antd'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {Api_Endpoint, fetchDepartmentsApi, fetchUsersApi} from '../../../services/ApiCalls'
import {useNavigate, Navigate,useLocation} from 'react-router-dom'
import React from 'react'
import { useAuth } from '../../../modules/auth'
// import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
const auditTrailUrl = `${Api_Endpoint}/auditTrail`
const LeaveTransactionsForm = () => {
  const [formData, setFormData] = useState({})
  const [activeTab, setActiveTab] = useState('tab1')
  const {register, reset, handleSubmit} = useForm()
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const {currentUser} = useAuth();
  const {data: usersData, isLoading: usersLoading} = useQuery('activeUsers', ()=>fetchUsersApi('Active'))
  var newRequestStatus:any;
  const {mutate: newLeaveTransactionEntry} = useMutation((values)=>axios.post(`${Api_Endpoint}/LeaveTransactions`,values), {
    onSuccess:async (response,values:any)=>{
      message.success("Record submitted successfully")
      var trailData = {
        userId: currentUser?.id,
        action: `User has added a new leave transaction in the system.`,
      }
      window.history.back()
    },
    onError:(error: any)=>{
      setLoading(false)
      // Safely access the error message and display it
    // const errorMessage = error?.response?.data || 'An error occurred. Please try again.'
    message.error(error?.response?.data)
    }
  })
 
  const location = useLocation()
  let leaveData : any = location?.state
  const navigate = useNavigate()

 

  // const url = `${Api_Endpoint}/users`

  // const OnSUbmit = handleSubmit( async (values, event)=> {
  //   event?.preventDefault();
  //   setLoading(true)
  //   const data = {
  //     firstName: values.firstName,
  //     lastname: values.lastname,
  //     email: values.email,
  //     account: values.account,
  //     gender: values.gender,
  //     dob: values.dob,
  //     phoneNumber: values.phoneNumber,
  //     idType: values.idType,
  //     nationality: values.nationality,
  //     idNumber: values.idNumber,
  //     docUrl:'',
  //       }
  //       console.log(data)
  //   try {
  //     console.log(data)
  //     const response = await axios.post(url, data)
  //     setSubmitLoading(false)
  //     reset()
  //     navigate('/grm/Guests/', {replace: true})
  //     return response.statusText
  //   } catch (error: any) {
  //     setSubmitLoading(false)
  //     return error.statusText
  //   }
  // })

  const OnSubmit = handleSubmit(async (values, event) => {
        event?.preventDefault()
        setLoading(true)
    try {
      
    if(values.date===''){
      setLoading(false)
      message.error('Please date field cannot be empty')
      return
    }
      const holidayDetails:any = {
        employeeId: values.employeeId,
        days: values.days,
        comments: values.comments,
        transactionType: values.transactionType,
        addedBy:currentUser?.id
      }
      newRequestStatus = values.status;

      newLeaveTransactionEntry(holidayDetails)
    } catch (error: any) {
      setLoading(false)
      return error.statusText
    }
  })

  return (
    <div
      className='col-12'
      style={{
        // backgroundColor: 'white',
        padding: '40px',
        borderRadius: '5px',

        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      {/* <Link to='/leaves/authorizations/pending'> */}
      <Link to='#' onClick={() => window.history.back()}>
        <a
          style={{fontSize: '16px', fontWeight: '500'}}
          className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'
        >
          Back to list
        </a>
      </Link>

      <div className='tabs'></div>
      <form onSubmit={OnSubmit}>
        {/* <form onSubmit={OnSUbmit}> */}
        <div className='tab-content'>
            <div className='col-12'>
              <div className='row mb-0'>
              <div className='col-4 mb-7'>
                  <label className='required form-label'>Employee Name</label>
                  <select {...register("employeeId")} className="form-select form-select-solid" aria-label="Select a user">
                    <option></option>
                    {usersData?.data.map((item: any) => (
                      <option key={item.id} value={item.id}>{`${item.firstName} ${item.lastName}`}</option>
                    ))}
                  </select>
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor='exampleFormControlInput1' className='required form-label'>
                    Comments
                  </label>
                  <input
                    type='text'
                    {...register('comments')}
                    className='form-control form-control-solid'
                  />
                </div>
                <div className="col-4 mb-7">
                  <label htmlFor="status" className="required form-label">
                    Transaction Type
                  </label>
                  <select
                    className="form-select form-select-solid"
                    {...register('transactionType')}
                  >
                    <option value=""></option>
                    <option value="Addition">Addition</option>
                    <option value="Deduction">Deduction</option>
                  </select>
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor='exampleFormControlInput1' className='required form-label'>
                    Number of Days
                  </label>
                  <input
                    type='int'
                    {...register('days')}
                    className='form-control form-control-solid'
                  />
                </div>
              </div>
              
            </div>
          
        </div>
        <Button onClick={OnSubmit} type='primary' loading={loading}>Submit</Button>
        {/* <button className='btn btn-primary' onClick={OnSubmit} type='submit'>
          Submit
        </button> */}
        {/* <button className='btn btn-primary' onClick={OnSUbmit} type="submit">Submit</button> */}
      </form>
    </div>
  )
}

export {LeaveTransactionsForm}


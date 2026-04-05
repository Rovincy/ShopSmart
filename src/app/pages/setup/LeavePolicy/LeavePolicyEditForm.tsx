import { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button, message } from 'antd'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Api_Endpoint, fetchAllUserPositionApi, fetchDepartmentsApi } from '../../../services/ApiCalls'
import { useAuth } from '../../../modules/auth'

const LeavePolicyEditForm = () => {
  const { register, reset, handleSubmit, watch, setValue } = useForm()
  const [loading, setLoading] = useState(false)
  const { data: userdepartments, isLoading: userdepartmentsLoad } = useQuery('departments', fetchDepartmentsApi)
  const { data: userPositions, isLoading: userPositionsLoad } = useQuery('userPositions', fetchAllUserPositionApi)
  const { currentUser } = useAuth()
  const location = useLocation()
  let leavePolicyData: any = location?.state
  const navigate = useNavigate()

  const auditTrailUrl = `${Api_Endpoint}/auditTrail`
  const { mutate: updateLeavePolicy } = useMutation((values) => axios.put(`${Api_Endpoint}/leavePolicyConfig`, values), {
    onSuccess: async () => {
      message.success("Leave Policy updated successfully")
      const trailData = {
        userId: currentUser?.id,
        action: `User updated leave Policy record`,
      }
      await axios.post(auditTrailUrl, trailData)
      navigate('/leavePolicy')
      setLoading(false)
    },
    onError: (error: any) => {
      console.log(error)
      setLoading(false)
      message.error("Update failed")
    }
  })


  const OnSubmit = handleSubmit(async (values, event) => {
    setLoading(true)
    
    const leavePolicyDetails: any = {
      id: leavePolicyData.id,
      companyId: leavePolicyData.companyId,
      leavePolicyStart: values.leavePolicyStart,
      leavePolicyEnd: values.leavePolicyEnd,
    }
// console.log(leavePolicyDetails)
    try {
      updateLeavePolicy(leavePolicyDetails)
    } catch (error: any) {
      setLoading(false)
      return error.statusText
    }
  })

  return (
    <div
      className='col-12'
      style={{
        padding: '40px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <Link to='/leavePolicy'>
        <a
          style={{ fontSize: '16px', fontWeight: '500' }}
          className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'
        >
          Back to list
        </a>
      </Link>

      <form onSubmit={OnSubmit}>
        <div className='tab-content'>
          <div className='col-12'>
            <div className='row mb-0'>
              <div className='col-4 mb-7'>
                <label htmlFor='firstName' className='required form-label'>
                  Company
                </label>
                <input
                  type='text'
                  {...register('company')}
                  value={leavePolicyData?.company}
                  className='form-control form-control-solid'
                />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor='lastname' className='required form-label'>
                  Leave Policy Start
                </label>
                <input
                  type='date'
                  {...register('leavePolicyStart')}
                  defaultValue={leavePolicyData?.leavePolicyStart}
                  className='form-control form-control-solid'
                />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor='email' className='required form-label'>
                  Leave Policy End
                </label>
                <input
                  type='date'
                  {...register('leavePolicyEnd')}
                  defaultValue={leavePolicyData?.leavePolicyEnd}
                  className='form-control form-control-solid'
                />
              </div>
            </div>
          </div>
        </div>
        <Button onClick={OnSubmit} loading={loading} type="primary">Submit</Button>
      </form>
    </div>
  )
}

export { LeavePolicyEditForm }

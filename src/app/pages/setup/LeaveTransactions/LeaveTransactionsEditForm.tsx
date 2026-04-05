import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button, Upload, message } from 'antd'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useAuth } from '../../../modules/auth'
import { Api_Endpoint, fetchUsersApi } from '../../../services/ApiCalls'

const auditTrailUrl = `${Api_Endpoint}/auditTrail`


const LeaveTransactionsEditForm = () => {
  const [formData, setFormData] = useState({})
  const [activeTab, setActiveTab] = useState('tab1')
  const { register, reset, handleSubmit, setValue, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const {data: usersData, isLoading: usersLoading} = useQuery('activeUsers', ()=>fetchUsersApi('Active'))
  let leaveTransactionsData: any = location?.state
  // console.log(leaveTransactionsData)
  const { mutate: selectedLeaveTransaction } = useMutation(
    (values) => axios.put(`${Api_Endpoint}/LeaveTransactions`, values),
    {
      onSuccess: async (response,values:any) => {
        message.success('Record updated successfully')
      var trailData = {
        userId: currentUser?.id,
        action: `User just updated a leave transaction`,
      }
      await axios.post(auditTrailUrl, trailData)
      navigate('/LeaveTransactions')
      },
      onError: (error: any) => {
        console.log(error)
        message.error('Update failed')
      },
    }
  )

  const OnSubmit = handleSubmit(async (values, event) => {
    event?.preventDefault()
    setLoading(true)
    if (values.date === ''||values.description==='') {
      setLoading(false)
      message.error('Please all fields must be filled')
      return
    }

    try {
      const LeaveTransactionsDetails: any = {
        id: leaveTransactionsData.id,
        employeeId: values.employeeId,
        days: values.days,
        comments: values.comments,
        transactionType: values.transactionType,
      }
// console.log(LeaveTransactionsDetails)
      selectedLeaveTransaction(LeaveTransactionsDetails)
    } catch (error: any) {
      setLoading(false)
      return error.statusText
    }
  })


  return (
    <div
      className="col-12"
      style={{
        padding: '40px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <Link to="/leaveTransactions">
        <a
          style={{ fontSize: '16px', fontWeight: '500' }}
          className="mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary"
        >
          Back to list
        </a>
      </Link>

      <form onSubmit={OnSubmit}>
        <div className="tab-content">
            <div className="col-12">
              <div className="row mb-0">
              <div className='col-4 mb-7'>
                  <label className='required form-label'>Employee Name</label>
                  <select {...register("employeeId",{ value: leaveTransactionsData?.employeeId || '' })} className="form-select form-select-solid" aria-label="Select a user">
                    <option></option>
                    {usersData?.data.map((item: any) => (
                      <option key={item.id} value={item.id}>{`${item.firstName} ${item.lastName}`}</option>
                    ))}
                  </select>
                </div>
                <div className="col-4 mb-7">
                  <label htmlFor="comments" className="required form-label">
                    Comments
                  </label>
                  <input
                    type="text"
                    defaultValue={leaveTransactionsData.comments}
                    {...register('comments')}
                    className="form-control form-control-solid"
                  />
                </div>
                <div className="col-4 mb-7">
                  <label htmlFor="status" className="required form-label">
                    Transaction Type
                  </label>
                  <select
                    className="form-select form-select-solid"
                    {...register('transactionType', { value: leaveTransactionsData?.transactionType || '' })}
                  >
                    <option value=""></option>
                    <option value="Addition">Addition</option>
                    <option value="Deduction">Deduction</option>
                  </select>
                </div>
                <div className="col-4 mb-7">
                <label htmlFor="numberOfDays" className="required form-label">
                  Days
                </label>
                <input
                  type="number"
                  defaultValue={leaveTransactionsData?.days}
                  {...register('days')}
                  className="form-control form-control-solid"
                />
              </div>
              </div>
            </div>
        </div>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </form>
    </div>
  )
}

export { LeaveTransactionsEditForm }

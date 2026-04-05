import { useState } from 'react'
import { useMutation } from 'react-query'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button, Upload, message } from 'antd'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useAuth } from '../../../modules/auth'
import { Api_Endpoint } from '../../../services/ApiCalls'

const auditTrailUrl = `${Api_Endpoint}/auditTrail`

const formatDate = (dateString:any) => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0] // Convert to 'YYYY-MM-DD' format
}

const HolidaysEditForm = () => {
  const [formData, setFormData] = useState({})
  const [activeTab, setActiveTab] = useState('tab1')
  const { register, reset, handleSubmit, setValue, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  let holidayData: any = location?.state
  // console.log(holidayData)
  const { mutate: selectedHoliday } = useMutation(
    (values) => axios.put(`${Api_Endpoint}/holidays`, values),
    {
      onSuccess: async (response,values:any) => {
        message.success('Holiday updated successfully')
      var trailData = {
        userId: currentUser?.id,
        action: `User just updated a holiday`,
      }
      await axios.post(auditTrailUrl, trailData)
      navigate('/holidays')
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
      const holidaysDetails: any = {
        id: holidayData.id,
        date: values.date,
        description: values.description
      }
// console.log(holidaysDetails)
      selectedHoliday(holidaysDetails)
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
      <Link to="/leaves/authorizations/pending">
        <a
          style={{ fontSize: '16px', fontWeight: '500' }}
          className="mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary"
        >
          Back to list
        </a>
      </Link>

      <form onSubmit={OnSubmit}>
        <div className="tab-content">
          {activeTab === 'tab1' && (
            <div className="col-12">
              <div className="row mb-0">
                <div className="col-4 mb-7">
                  <label htmlFor="description" className="required form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    defaultValue={holidayData.description}
                    {...register('description')}
                    className="form-control form-control-solid"
                  />
                </div>
                <div className="col-4 mb-7">
                <label htmlFor="date" className="required form-label">
                  Date
                </label>
                <input
                  type="date"
                  defaultValue={formatDate(holidayData?.date)}
                  {...register('date')}
                  className="form-control form-control-solid"
                />
              </div>
              </div>
            </div>
          )}
        </div>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </form>
    </div>
  )
}

export { HolidaysEditForm }

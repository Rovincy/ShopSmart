import {Button, Input, Modal, Space, Table, Tag, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {
  Api_Endpoint,
  deleteHolidayApi,
  fetchHolidays,
} from '../../../services/ApiCalls'
import { useAuth } from '../../../modules/auth'

const Holidays = () => {
  const [gridData, setGridData] = useState<any>([])
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState<any>([])
  const {currentUser} = useAuth()
  const {data: holidaysData, isLoading: holidaysLoading} = useQuery('holidays',fetchHolidays)
  const {mutate: deleteHolidayData} = useMutation((id:any) => deleteHolidayApi(id))
  const queryClient = useQueryClient()

  const deleteLeaveRequest = (id: any) => {
    // console.log(id)
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure, you want to delete this holiday?',
      onOk: () => {
        deleteHolidayData( parseInt(id) , {
          onSuccess: async () => {
            message.success('Holiday deleted successfully!')
            queryClient.invalidateQueries('holidays')
          },
        })
      },
    })
  }

  const globalSearch = (text: string) => {
    const filtered = holidaysData?.data.filter((value: any) => {
      return (
        value.date.toLowerCase().includes(text.toLowerCase()) ||
        value.description.toLowerCase().includes(text.toLowerCase())||
        value.timestamp.toLowerCase().includes(text.toLowerCase())
      )
    })
    setFilteredData(filtered)
  }

  const columns: any = [
    {
        title: 'Date',
        dataIndex: 'date',
        render: (date: string) => {
          // Format the date to a more readable format
          const formattedDate = new Date(date).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          return formattedDate;
        },
        sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a: any, b: any) => a.description.localeCompare(b.description),
    },
    {
      title: 'Creation Date',
      dataIndex: 'timestamp',
      render: (timestamp: string) => {
        // Format the date to a more readable format
        const formattedDate = new Date(timestamp).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        return formattedDate;
      },
      sorter: (a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Link to={`/holidays/editForm`} state={record}>
            <a href='#' className='btn btn-light-primary btn-sm'>
              Edit
            </a>
          </Link>
          <a
            href='#'
            className='btn btn-light-danger btn-sm'
            onClick={() => deleteLeaveRequest(record.id)}
          >
            Delete
          </a>
        </Space>
      ),
    }
  ]

  useEffect(() => {
    setFilteredData(holidaysData?.data || [])
  }, [holidaysData])

  // Automatically filter results when the searchText changes
  useEffect(() => {
    globalSearch(searchText)
  }, [searchText])

  return (
    <div style={{
      width: '100%',
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
    }}>
      <KTCardBody className='py-4 '>
        <div className='table-responsive'>
          <div className='d-flex justify-content-between'>
            <Space style={{marginBottom: 16}}>
              <Input
                placeholder='Enter Search Text'
                type='text'
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Space>

            <Space style={{marginBottom: 16}}>
            <Link to='/holidays/addForm'>
                <button type='button' className='btn btn-primary me-3'>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Add
                </button>
              </Link>
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={holidaysLoading}
            pagination={false}
            className='table-responsive'
          />
        </div>
      </KTCardBody>
    </div>
  )
}

export {Holidays}

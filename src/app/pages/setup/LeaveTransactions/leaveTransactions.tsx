import {Button, Input, Modal, Space, Table, Tag, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {
  Api_Endpoint,
  deleteLeaveTransactionsApi,
  fetchLeaveTransactions,
} from '../../../services/ApiCalls'
import { useAuth } from '../../../modules/auth'

const LeaveTransactions = () => {
  const [gridData, setGridData] = useState<any>([])
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState<any>([])
  const {currentUser} = useAuth()
  const {data: LeaveTransactionsData, isLoading: LeaveTransactionsLoading} = useQuery('LeaveTransactions',fetchLeaveTransactions)
  const {mutate: deleteLeaveTransactionData} = useMutation((id:any) => deleteLeaveTransactionsApi(id))
  const queryClient = useQueryClient()

  const deleteLeaveTransactionRequest = (id: any) => {
    // console.log(id)
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure, you want to delete this entry?',
      onOk: () => {
        deleteLeaveTransactionData( parseInt(id) , {
          onSuccess: async () => {
            message.success('Entry deleted successfully!')
            queryClient.invalidateQueries('LeaveTransactions')
          },
        })
      },
    })
  }

  const globalSearch = (text: string) => {
    const filtered = LeaveTransactionsData?.data.filter((value: any) => {
      return (
        value?.employee?.toLowerCase().includes(text.toLowerCase()) ||
        value?.comments?.toLowerCase().includes(text.toLowerCase())||
        value?.transactionType?.toLowerCase().includes(text.toLowerCase())||
        value?.timestamp?.toLowerCase().includes(text.toLowerCase())
      )
    })
    setFilteredData(filtered)
  }

  const columns: any = [
    {
      title: 'Employee',
      dataIndex: 'employee',
      sorter: (a: any, b: any) => a.employee.localeCompare(b.employee),
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      sorter: (a: any, b: any) => a.comments.localeCompare(b.comments),
    },
    {
      title: 'Days',
      dataIndex: 'days',
      sorter: (a: any, b: any) => a.days.localeCompare(b.days),
    },
    {
      title: 'Transaction Type',
      dataIndex: 'transactionType',
      sorter: (a: any, b: any) => a.transactionType.localeCompare(b.transactionType),
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
          <Link to={`/LeaveTransactions/editForm`} state={record}>
            <a href='#' className='btn btn-light-primary btn-sm'>
              Edit
            </a>
          </Link>
          <a
            href='#'
            className='btn btn-light-danger btn-sm'
            onClick={() => deleteLeaveTransactionRequest(record.id)}
          >
            Delete
          </a>
        </Space>
      ),
    }
  ]

  useEffect(() => {
    setFilteredData(LeaveTransactionsData?.data || [])
  }, [LeaveTransactionsData])

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
            <Link to='/LeaveTransactions/addForm'>
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
            loading={LeaveTransactionsLoading}
            pagination={false}
            className='table-responsive'
          />
        </div>
      </KTCardBody>
    </div>
  )
}

export {LeaveTransactions}

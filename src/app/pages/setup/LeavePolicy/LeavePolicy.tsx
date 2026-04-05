import {Button, Form, Input, InputNumber, Modal, Space, Table, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../_metronic/helpers'
import {Link, useParams} from 'react-router-dom'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {
  Api_Endpoint,
  deleteUserApi,
  fetchLeavePolicy,
  fetchUsersApi,
} from '../../../services/ApiCalls'
import TextArea from 'antd/es/input/TextArea'
import { useAuth } from '../../../modules/auth'
import { ColumnType } from 'antd/es/table'

const LeavePolicy = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState<any>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
//   const {data: usersLeavePolicy, isLoading: usersLoading} = useQuery('users', fetchUsersApi)
  const {data: usersLeavePolicy, isLoading: usersLeavePolicyLoading} = useQuery('LeavePolicy', fetchLeavePolicy)
  const {mutate: deleteUserData} = useMutation((id: any) => deleteUserApi(id))
  const [openNoteModal, setopenNoteModal] = useState(false)
  const parms: any = useParams()
  const queryClient = useQueryClient()
  const {currentUser} = useAuth()

  const auditTrailUrl = `${Api_Endpoint}/auditTrail`

  const columns: ColumnType<any>[] = [ // Use ColumnType for better typing
    {
      title: 'School',
      dataIndex: 'company',
      sorter: (a: any, b: any) => a.company.localeCompare(b.company),
    },
    {
      title: 'Semester Start',
      dataIndex: 'leavePolicyStart',
      sorter: (a: any, b: any) => a.leavePolicyStart.localeCompare(b.leavePolicyStart),
    },
    {
      title: 'Semester End',
      dataIndex: 'leavePolicyEnd',
      sorter: (a: any, b: any) => a.leavePolicyEnd.localeCompare(b.leavePolicyEnd),
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 20,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Link to={`/leavePolicy/edit/`} state={record}>
            <a href='#' className='btn btn-light-primary btn-sm'>
              Edit
            </a>
          </Link>
          {/* <a
            href='#'
            className='btn btn-light-danger btn-sm'
            onClick={() => deleteUser(record.id)}
          >
            Delete
          </a> */}
        </Space>
      ),
    },
  ];


  // const LeavePolicy = usersLeavePolicy?.data
  // const userAndLeavePolicy = usersLeavePolicy?.data.map((e: any) => {
  //   const department = LeavePolicy?.find((x: any) => x.id === e.departmentId)
  //   return {
  //     id: e?.id,
  //     leavePolicyStart: e?.leavePolicyStart,
  //     company: e?.company,
  //     leavePolicyEnd: e?.leavePolicyEnd,
  //     email: e?.email,
  //     department: department?.name,
  //     departmentId: e?.departmentId,
  //     password: e?.password,
  //   }
  // })

  const globalSearch = (text: string) => {
    const filtered = usersLeavePolicy?.data?.filter((value: any) => {
      return (
        value.company?.toLowerCase().includes(text.toLowerCase()) ||
        value.leavePolicyStart||
        value.leavePolicyEnd
      )
    })
    setFilteredData(filtered)
  }

  // Update the filtered data when userAndLeavePolicy or searchText changes
  useEffect(() => {
    globalSearch(searchText)
  }, [searchText, usersLeavePolicy?.data])

  return (
    <div
      style={{
        width: '100%',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4 '>
        <div className='table-responsive'>
          {/* <div className='d-flex justify-content-between'>
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
              <Link to='/usersForm'>
                <button type='button' className='btn btn-primary me-3'>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Add
                </button>
              </Link>
            </Space>
          </div> */}

          <Table
            columns={columns}
            dataSource={filteredData}
            loading={usersLeavePolicyLoading}
            pagination={false}
            className='table-responsive'
          />
        </div>
      </KTCardBody>
    </div>
  )
}

export {LeavePolicy}

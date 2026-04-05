import {Button, Form, Input, InputNumber, Modal, Space, Table, Tag, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../_metronic/helpers'
import {Link, useParams} from 'react-router-dom'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {
  Api_Endpoint,
  deleteUserApi,
  fetchDepartmentsApi,
  fetchUsersApi,
} from '../../../services/ApiCalls'
import TextArea from 'antd/es/input/TextArea'
import { useAuth } from '../../../modules/auth'
import { ColumnType } from 'antd/es/table'

const InactiveUsers = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState<any>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {data: usersData, isLoading: usersLoading} = useQuery('inactiveUsers',()=> fetchUsersApi('Inactive'))
  // const {data: usersdepartments, isLoading: usersdepartmentsLoading} = useQuery('Departments', fetchDepartmentsApi)
  const {mutate: deleteUserData} = useMutation((id: any) => deleteUserApi(id))
  const [openNoteModal, setopenNoteModal] = useState(false)
  const parms: any = useParams()
  const queryClient = useQueryClient()
  const {currentUser} = useAuth()

  const auditTrailUrl = `${Api_Endpoint}/auditTrail`

  const deleteUser = (id: any) => {
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure, you want to delete this user?',
      onOk: () => {
        deleteUserData(id, {
          onSuccess: async () => {
            message.info('User deleted successfully!')
            queryClient.invalidateQueries('users')
            var trailData = {
              userId: currentUser?.id,
              action: `User deleted a user with name ${usersData?.data.find((x: any) => x.id === id)?.firstName} ${usersData?.data.find((x: any) => x.id === id)?.lastName}`,
            }
            await axios.post(auditTrailUrl, trailData)
          },
        })
      },
    })
  }
  const columns: ColumnType<any>[] = [ // Use ColumnType for better typing
    {
      title: 'FirstName',
      dataIndex: 'firstName',
      sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'LastName',
      dataIndex: 'lastName',
      sorter: (a: any, b: any) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: (a: any, b: any) => a.username.localeCompare(b.username),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      sorter: (a: any, b: any) => a.department.localeCompare(b.department),
    },
    {
      title: 'Postion',
      dataIndex: 'position',
      sorter: (a: any, b: any) => a.position.localeCompare(b.position),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    {
      title: 'Number of leaves Authiorized',
      dataIndex: 'authorized',
      sorter: (a: any, b: any) => a.authorized.localeCompare(b.authorized),
    },
    {
      title: 'Leave days used',
      dataIndex: 'used',
      sorter: (a: any, b: any) => a.used.localeCompare(b.used),
    },
    {
      title: 'Leave days left',
      dataIndex: 'daysLeft',
      sorter: (a: any, b: any) => a.daysLeft.localeCompare(b.daysLeft),
    },{
      title: 'Status',
      dataIndex: 'status',
      render: (text: string) => (
        <Tag color={'red'} key={text}>
          {text.toUpperCase()}
        </Tag>
      ),
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 20,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Link to={`/users/userEditForm/`} state={record}>
            <a href='#' className='btn btn-light-primary btn-sm'>
              Edit
            </a>
          </Link>
          <a
            href='#'
            className='btn btn-light-danger btn-sm'
            onClick={() => deleteUser(record.id)}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];


  // const departments = usersdepartments?.data
  // const userAnddepartments = usersData?.data.map((e: any) => {
  //   const department = departments?.find((x: any) => x.id === e.departmentId)
  //   return {
  //     id: e?.id,
  //     lastName: e?.lastName,
  //     firstName: e?.firstName,
  //     username: e?.username,
  //     email: e?.email,
  //     department: department?.name,
  //     departmentId: e?.departmentId,
  //     password: e?.password,
  //   }
  // })

  const globalSearch = (text: string) => {
    const filtered = usersData?.data?.filter((value: any) => {
      return (
        value.firstName.toLowerCase().includes(text.toLowerCase()) ||
        value.lastName.toLowerCase().includes(text.toLowerCase()) ||
        value.username.toLowerCase().includes(text.toLowerCase()) ||
        value.department?.toLowerCase().includes(text.toLowerCase()) ||
        value.position?.toLowerCase().includes(text.toLowerCase()) ||
        value.email.toLowerCase().includes(text.toLowerCase())
      )
    })
    setFilteredData(filtered)
  }

  // Update the filtered data when userAnddepartments or searchText changes
  useEffect(() => {
    globalSearch(searchText)
  }, [searchText, usersData?.data])

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
              <Link to='/usersForm'>
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
            loading={usersLoading}
            pagination={false}
            className='table-responsive'
          />
        </div>
      </KTCardBody>
    </div>
  )
}

export {InactiveUsers}

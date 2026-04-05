import {Button, Input, Modal, Space, Table, Tag, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {
  Api_Endpoint,
  deleteRoleApi,
  fetchDepartmentsApi,
} from '../../../services/ApiCalls'
import { useAuth } from '../../../modules/auth'

const Departments = () => {
  const [gridData, setGridData] = useState<any>([])
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState<any>([])
  const {data: departmentsData, isLoading: departmentsLoading} = useQuery('departments', fetchDepartmentsApi)
  const {mutate: deleteRoleData} = useMutation((id: any) => deleteRoleApi(id))
  const {currentUser} = useAuth()
  const queryClient = useQueryClient()

  const deleteRole = (id: any) => {
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure, you want to delete this department?',
      onOk: () => {
        deleteRoleData(id, {
          onSuccess: async () => {
            message.success('Department deleted successfully!')
            queryClient.invalidateQueries('departments')
          },
        })
      },
    })
  }

  const globalSearch = (text: string) => {
    const filtered = departmentsData?.data.filter((value: any) => {
      return (
        value.name.toLowerCase().includes(text.toLowerCase()) ||
        value.description.toLowerCase().includes(text.toLowerCase())
      )
    })
    setFilteredData(filtered)
  }

  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a: any, b: any) => a.description.localeCompare(b.description),
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Link to={`/departments/userpositions`} state={record}>
            <Tag
              color="blue"
              style={{
                cursor: 'pointer',
                fontSize: '14px',
                padding: '5px 10px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Positions
            </Tag>
          </Link>
          <Link to={`/departments/EditForm`} state={record}>
            <a href='#' className='btn btn-light-primary btn-sm'>
              Edit
            </a>
          </Link>
          {/* <a
            href='#'
            className='btn btn-light-danger btn-sm'
            onClick={() => deleteRole(record.id)}
          >
            Delete
          </a> */}
        </Space>
      ),
    },
  ]

  useEffect(() => {
    setFilteredData(departmentsData?.data || [])
  }, [departmentsData])

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
              <Link to='/departmentsForm'>
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
            loading={departmentsLoading}
            pagination={false}
            className='table-responsive'
          />
        </div>
      </KTCardBody>
    </div>
  )
}

export {Departments}

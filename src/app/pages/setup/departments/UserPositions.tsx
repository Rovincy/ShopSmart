import {Button, Form, Input, InputNumber, Modal, Space, Table, Tag, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../_metronic/helpers'
import {Link, useLocation, useParams} from 'react-router-dom'
// import { employeedata } from '../../../../../data/DummyData'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {
  Api_Endpoint,
  deleteUserPositionApi,
  deleteUserApi,
  fetchDepartmentsApi,
  fetchUserPositionApi,
} from '../../../services/ApiCalls'
import Checkbox from 'antd/es/checkbox/Checkbox'
import TextArea from 'antd/es/input/TextArea'
import { useAuth } from '../../../modules/auth'

const UserPostions = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const location = useLocation()
  let departmentData : any = location?.state
  const {data: departmentPositionData, isLoading: departmentPositionLoading} = useQuery('departmentPosition',(value)=> fetchUserPositionApi(departmentData?.id))
  const {mutate: deletePositionData} = useMutation((id: any) =>
  deleteUserPositionApi(id)
  )
  const auditTrailUrl = `${Api_Endpoint}/auditTrail`
  const {currentUser} = useAuth();
  const [openNoteModal, setopenNoteModal] = useState(false)
  const parms: any = useParams()
  const queryClient = useQueryClient()
  const [categoryForm] = Form.useForm()
  const showModal = () => {
    setopenNoteModal(true)
  }

  const deletePosition = (id: any) => {
    // console.log("id: ",id)
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure, you want to delete this Postion?',
      onOk: () => {
        deletePositionData(id, {
          onSuccess: async () => {
            message.success('Position deleted successfully!')
            queryClient.invalidateQueries('departmentPosition')
            var trailData = {
              userId:currentUser?.id,
              action:`User deleted position with name ${departmentPositionData?.data.find((e:any)=>e.id===id)?.name}`,
            }
            await axios.post(auditTrailUrl, trailData)
          },
        })
      },
    })
  }
  const cancelNoteModal = () => {
    setopenNoteModal(false)
  }
  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }
  const deleteData = async (element: any) => {
    try {
      const response = await axios.delete(`${Api_Endpoint}/RoomsType`)
      // update the local state so that react can refecth and re-render the table with the new data
      const newData = gridData.filter((item: any) => item.id !== element.id)
      setGridData(newData)
      return response.status
    } catch (e) {
      return e
    }
  }

  function handleDelete(element: any) {
    deleteData(element)
  }
  const columns: any = [
    {
      title: 'Postion Name',
      dataIndex: 'positionName',
      sorter: (a: any, b: any) => {
        if (a.positionName > b.positionName) {
          return 1
        }
        if (b.positionName > a.positionName) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Leave Days',
      dataIndex: 'leaveDays',
      sorter: (a: any, b: any) => {
        if (a.leaveDays > b.leaveDays) {
          return 1
        }
        if (b.leaveDays > a.leaveDays) {
          return -1
        }
        return 0
      },
    },
    
    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          {/* <Link to={`/departments/EditForm`} state={record}>
            <Tag
              color="green"
              style={{
                cursor: 'pointer',
                fontSize: '14px',
                padding: '5px 10px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Duty
            </Tag>
          </Link> */}
          <Link to={`/departments/userpositions/EditForm`} state={record}>
            <a href='#' className='btn btn-light-primary btn-sm'>
              Edit
            </a>
          </Link>
          {/* <a
            href='#'
            className='btn btn-light-danger btn-sm'
            onClick={() => deletePosition(record.id)}
          >
            Delete
          </a> */}
        </Space>
      ),
    }
    
  ]

  // Invalidate query on component unmount
  useEffect(() => {
    return () => {
      queryClient.invalidateQueries('departmentPosition');
    };
  }, [queryClient]);


  return (
    // <div
    //   style={{
    //     backgroundColor: 'white',
    //     padding: '20px',
    //     borderRadius: '5px',
    //     boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
    //   }}
    // >
    <div
      style={{
        width: '100%',
        // backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4 '>
        <div className='table-responsive'>
          <div className='d-flex justify-content-between'>
            {/* <Space style={{marginBottom: 16}}>
              <Input placeholder='Enter Search Text' type='text' allowClear value={searchText} />
              <Button type='primary' onClick={globalSearch}>
                Search
              </Button>
            </Space> */}
            <Link to='/departments'>
        <a
          style={{fontSize: '16px', fontWeight: '500'}}
          className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'
        >
          Back to list
        </a>
      </Link>
            <Space style={{marginBottom: 16}}>
            <div><strong>{departmentData?.name}</strong></div>
            <Link to='/departments/userpositions/addForm' state={departmentData}>
                <button type='button' className='btn btn-primary me-3'>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Add
                </button>
              </Link>

              {/* <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button> */}
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={departmentPositionData?.data}
            loading={departmentPositionLoading}
            pagination={false}
            className='table-responsive'
          />
        </div>
        {/* <Modal
          open={openNoteModal}
          okText='Ok'
          title='Add Service Category'
          closable={true}
          onCancel={cancelNoteModal}
          footer={null}
        >
          <Form onFinish={submitServiceCategory} form={categoryForm}>
            <Form.Item
              name={'name'}
              label='Service'
              rules={[{required: true, message: 'Please enter service name'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input type='text' style={{width: '100%'}} />
            </Form.Item>
            <Form.Item
              label='Description'
              rules={[{required: true, message: 'Please enter description'}]}
              name={'description'}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <TextArea rows={4} style={{width: '100%'}} />
            </Form.Item>
            <Form.Item wrapperCol={{offset: 2, span: 18}}>
              <Button type='primary' key='submit' htmlType='submit'>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal> */}
      </KTCardBody>
    </div>
  )
}

export {UserPostions}

import { Button, Form, Input, InputNumber, Modal, Space, Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { KTCardBody, KTSVG } from '../../../../_metronic/helpers';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  Api_Endpoint,
  deleteUserApi,
  fetchDepartmentsApi,
  fetchUsersApi,
} from '../../../services/ApiCalls';
import TextArea from 'antd/es/input/TextArea';
import { useAuth } from '../../../modules/auth';
import { ColumnType } from 'antd/es/table';

const Users = () => {
  const [gridData, setGridData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();
  const [img, setImg] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: usersData, isLoading: usersLoading } = useQuery('activeUsers', () => fetchUsersApi('Active'));
  const { data: usersdepartments, isLoading: usersdepartmentsLoading } = useQuery('Departments', fetchDepartmentsApi);
  const { mutate: deleteUserData } = useMutation((id: any) => deleteUserApi(id));
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const parms: any = useParams();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const auditTrailUrl = `${Api_Endpoint}/auditTrail`;

  const deleteUser = (id: any) => {
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure, you want to delete this user?',
      onOk: () => {
        deleteUserData(id, {
          onSuccess: async () => {
            message.info('User deleted successfully!');
            queryClient.invalidateQueries('users');
            const trailData = {
              userId: currentUser?.id,
              action: `User deleted a user with name ${usersData?.data.find((x: any) => x.id === id)?.firstName} ${usersData?.data.find((x: any) => x.id === id)?.lastName}`,
            };
            await axios.post(auditTrailUrl, trailData);
          },
        });
      },
    });
  };

  const columns: ColumnType<any>[] = [
    {
      title: 'Profile',
      dataIndex: 'profilePicture',
      width: 80, // Adjust width as needed
      render: (profilePicture: string | undefined) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {profilePicture ? (
            <img
              src={`${profilePicture}`}
              alt="Profile"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%', // Makes it round
                objectFit: 'cover',
                marginRight: '10px', // Space between image and next column
              }}
            />
          ) : (
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0', // Placeholder color if no image
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '10px',
                color: '#999',
              }}
            >
              No Image
            </div>
          )}
        </div>
      ),
    },
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
      title: 'Position',
      dataIndex: 'position',
      sorter: (a: any, b: any) => a.position.localeCompare(b.position),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text: string) => (
        <Tag color={'green'} key={text}>
          {text.toUpperCase()}
        </Tag>
      ),
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      sorter: (a: any, b: any) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: 'Matricule',
      dataIndex: 'matricule',
      sorter: (a: any, b: any) => a.matricule.localeCompare(b.matricule),
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 120,
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

  const globalSearch = (text: string) => {
    const filtered = usersData?.data?.filter((value: any) => {
      return (
        value.firstName?.toLowerCase().includes(text.toLowerCase()) ||
        value.lastName?.toLowerCase().includes(text.toLowerCase()) ||
        value.username.toLowerCase().includes(text.toLowerCase()) ||
        value.department?.toLowerCase().includes(text.toLowerCase()) ||
        value.position?.toLowerCase().includes(text.toLowerCase()) ||
        value.email?.toLowerCase().includes(text.toLowerCase()) ||
        value.phoneNumber?.includes(text)
      );
    });
    setFilteredData(filtered || []);
  };

  useEffect(() => {
    globalSearch(searchText);
  }, [searchText, usersData?.data]);

  return (
    <div
      style={{
        width: '100%',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4'>
        <div className='table-responsive'>
          <div className='d-flex justify-content-between'>
            <Space style={{ marginBottom: 16 }}>
              <Input
                placeholder='Enter Search Text'
                type='text'
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Space>

            <Space style={{ marginBottom: 16 }}>
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
            // pagination={false}
            className='table-responsive'
          />
        </div>
      </KTCardBody>
    </div>
  );
};

export { Users };
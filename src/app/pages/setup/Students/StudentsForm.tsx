import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Button, message, Select, Modal, Upload } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../../../modules/auth';
import {
  Api_Endpoint,
  fetchAllClasses,
  fetchAllCourses,
  fetchAllSemesterClasses,
  fetchAllUserPositionApi,
  fetchDepartmentsApi,
} from '../../../services/ApiCalls';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface UserFormValues {
  firstName: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  sex: string;
  dob: string;
  aboutYou: string;
  departmentId: string;
  positionId: string;
  courses: string[];
  classes: string;
  semesterId: string;
  phoneNumber: string;
  profilePicture?: File;
}

const StudentsForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: {
      firstName: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      sex: '',
      dob: '',
      aboutYou: '',
      departmentId: '',
      positionId: '',
      courses: [],
      classes: '',
      semesterId: '',
      phoneNumber: '',
      profilePicture: undefined,
    },
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Watch the classes field to get the selected classId
  const selectedClassId = watch('classes');

  // Queries
  const { data: departmentsData } = useQuery('departments', fetchDepartmentsApi);
  const { data: positionsData } = useQuery('userPositions', fetchAllUserPositionApi);
  const { data: coursesData } = useQuery('courses', fetchAllCourses);
  const { data: classesData } = useQuery('classes', fetchAllClasses);
  const { data: semesterClassesData } = useQuery(
    ['semesterClasses', selectedClassId],
    () => fetchAllSemesterClasses(selectedClassId),
    {
      enabled: !!selectedClassId, // Only fetch when selectedClassId is not empty
    }
  );

  // Selected Department
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

  // Watch fields
  const aboutYou = watch('aboutYou');
  const departmentId = watch('departmentId');

  // Calculate word count for aboutYou
  const wordCount = aboutYou ? aboutYou.trim().split(/\s+/).filter(Boolean).length : 0;

  // Prepare courses options for multi-select
  const options =
    coursesData?.data?.map((course: any) => ({
      label: course.name,
      value: course.id.toString(),
    })) || [];

  // Filter positions based on department selection
  const filteredPositions = selectedDepartment
    ? positionsData?.data.filter((pos: any) => pos.departmentId === selectedDepartment)
    : [];

  // Handle department change
  const handleDepartmentChange = (value: string) => {
    const departmentId = parseInt(value);
    setSelectedDepartment(departmentId);
    setValue('departmentId', value, { shouldValidate: true });

    // Clear position, courses, and classes fields when department changes
    setSelectedCategories([]);
    setValue('positionId', '', { shouldValidate: true });
    setValue('courses', [], { shouldValidate: true });
    setValue('classes', '', { shouldValidate: true });
    setValue('semesterId', '', { shouldValidate: true }); // Clear semesterId as well
  };

  // Multi-select change handler
  const handleMultiSelectChange = (newValue: any) => {
    setSelectedCategories(newValue || []);
  };

  // Centralized error handler
  const handleError = (error: any) => {
    const errorMessage = error.response?.data || error.message || 'An unexpected error occurred';
    if (errorMessage.includes('duplicate key') || errorMessage.includes('already exists')) {
      Modal.error({
        title: 'Duplicate Entry',
        content: 'A user with this email or username already exists.',
        okText: 'OK',
      });
    } else if (errorMessage.includes('Invalid file type')) {
      Modal.error({
        title: 'Invalid File',
        content: 'Please upload a valid image file (JPEG, PNG, JPG).',
        okText: 'OK',
      });
    } else if (errorMessage.includes('File size')) {
      Modal.error({
        title: 'File Too Large',
        content: 'The profile picture must be less than 2MB.',
        okText: 'OK',
      });
    } else {
      Modal.error({
        title: 'Error',
        content: `Failed to register user: ${errorMessage}`,
        okText: 'OK',
      });
    }
  };

  // Form Submit Handler
  const OnSubmit = handleSubmit(async (values) => {
    try {
      setLoading(true);

      // Additional validation to ensure all required fields are filled
      if (
        !values.firstName ||
        !values.lastname ||
        !values.email ||
        !values.username ||
        !values.password ||
        !values.sex ||
        !values.dob ||
        !values.aboutYou ||
        !values.departmentId ||
        !values.positionId ||
        !values.phoneNumber
      ) {
        message.error('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      if (selectedDepartment === 34 && (!values.courses || values.courses.length === 0)) {
        message.error('Please select at least one course.');
        setLoading(false);
        return;
      }

      if (selectedDepartment === 35 && !values.classes) {
        message.error('Please select a class.');
        setLoading(false);
        return;
      }

      if (selectedDepartment === 35 && !values.semesterId) {
        message.error('Please select a semester.');
        setLoading(false);
        return;
      }

      const selectedDept = departmentsData?.data.find((d: any) => d.id === parseInt(values.departmentId));
      const selectedPos = positionsData?.data.find((p: any) => p.id === parseInt(values.positionId));

      if (!selectedDept) throw new Error(`No department found for id ${values.departmentId}`);
      if (!selectedPos) throw new Error(`No position found for id ${values.positionId}`);

      // Prepare user details
      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastname);
      formData.append('email', values.email);
      formData.append('departmentId', values.departmentId);
      formData.append('positionId', values.positionId);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('username', values.username);
      formData.append('password', values.password);
      formData.append('sex', values.sex);
      formData.append('dob', values.dob);
      formData.append('aboutYou', values.aboutYou);
      formData.append('createdBy', currentUser?.id.toString() || '');
      if (selectedDepartment === 35) {
        formData.append('classId', values.classes);
        formData.append('semesterId', values.semesterId);
      }
      if (selectedDepartment === 34) {
        formData.append('courses', JSON.stringify(selectedCategories.map((item) => parseInt(item.value))));
      }
      if (values.profilePicture) {
        formData.append('profilePicture', values.profilePicture);
      }

      // Create user
      await axios.post(`${Api_Endpoint}/users`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      // Audit Trail
      const auditTrailUrl = `${Api_Endpoint}/auditTrail`;
      const trailData = {
        userId: currentUser?.id,
        action: `User added new user: ${values.firstName} ${values.lastname} with email ${values.email} at ${selectedDept.name} department as: ${selectedPos.positionName}`,
      };
      await axios.post(auditTrailUrl, trailData);

      message.success('User registered successfully');
      navigate('/StudentsSetup');
      setLoading(false);
    } catch (error: any) {
      handleError(error);
      setLoading(false);
    }
  });

  return (
    <div
      className="col-12"
      style={{
        padding: '40px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <Link to="/StudentsSetup">
        <button className="mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary">
          Back to list
        </button>
      </Link>

      <form onSubmit={OnSubmit}>
        <div className="tab-content">
          <div className="col-12">
            <div className="row mb-0">
              <div className="col-4 mb-7">
                <label className="required form-label">First Name</label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className="form-control form-control-solid"
                />
                {errors.firstName && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.firstName.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label className="required form-label">Last Name</label>
                <input
                  type="text"
                  {...register('lastname', { required: 'Last name is required' })}
                  className="form-control form-control-solid"
                />
                {errors.lastname && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.lastname.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label className="required form-label">Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid email address',
                    },
                  })}
                  className="form-control form-control-solid"
                />
                {errors.email && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>
                )}
              </div>
            </div>

            <div className="row mb-0">
              <div className="col-4 mb-7">
                <label className="required form-label">Username</label>
                <input
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                  className="form-control form-control-solid"
                />
                {errors.username && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.username.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label className="required form-label">Password</label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                  className="form-control form-control-solid"
                />
                {errors.password && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label className="required form-label">Sex</label>
                <select
                  {...register('sex', { required: 'Sex is required' })}
                  className="form-select form-select-solid"
                >
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.sex && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.sex.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label className="required form-label">Date Of Birth</label>
                <input
                  type="date"
                  {...register('dob', { required: 'Date of birth is required' })}
                  className="form-control form-control-solid"
                />
                {errors.dob && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.dob.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label className="required form-label">About You</label>
                <input
                  type="text"
                  {...register('aboutYou', {
                    required: 'About you is required',
                    validate: (value) => {
                      const words = value.trim().split(/\s+/).filter(Boolean).length;
                      return words <= 159 || 'About you must not exceed 159 words';
                    },
                  })}
                  className="form-control form-control-solid"
                />
                <div style={{ fontSize: '12px', color: wordCount > 159 ? 'red' : 'gray' }}>
                  Word count: {wordCount}/159
                </div>
                {errors.aboutYou && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.aboutYou.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label className="required form-label">Department</label>
                <Controller
                  name="departmentId"
                  control={control}
                  rules={{ required: 'Department is required' }}
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onChange={(value) => {
                        field.onChange(value);
                        handleDepartmentChange(value);
                      }}
                      placeholder="Select Department"
                      style={{ width: '100%' }}
                    >
                      {departmentsData?.data.map((dept: any) => (
                        <Option key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.departmentId && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.departmentId.message}</span>
                )}
              </div>

              <div className="col-4 mb-7">
                <label className="required form-label">Position</label>
                <select
                  {...register('positionId', { required: 'Position is required' })}
                  className="form-select form-select-solid"
                >
                  <option value="">Select Position</option>
                  {filteredPositions.map((pos: any) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.positionName}
                    </option>
                  ))}
                </select>
                {errors.positionId && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.positionId.message}</span>
                )}
              </div>

              {/* Courses Multi-Select */}
              {selectedDepartment === 34 && (
                <div className="col-4 mb-7">
                  <label htmlFor="courses" className="required form-label">
                    Courses
                  </label>
                  <Controller
                    name="courses"
                    control={control}
                    rules={{ required: 'At least one course is required' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        allowClear
                        placeholder="Select relevant courses"
                        options={options}
                        value={selectedCategories}
                        onChange={(value) => {
                          const newSelected = options.filter((opt: any) => value.includes(opt.value));
                          handleMultiSelectChange(newSelected);
                          field.onChange(value);
                        }}
                        style={{ width: '100%' }}
                      />
                    )}
                  />
                  {errors.courses && (
                    <span style={{ color: 'red', fontSize: '12px' }}>{errors.courses.message}</span>
                  )}
                </div>
              )}

              {/* Class Select */}
              {selectedDepartment === 35 && (
                <div className="col-4 mb-7">
                  <label htmlFor="classes" className="required form-label">
                    Class
                  </label>
                  <select
                    {...register('classes', { required: 'Class is required' })}
                    className="form-select form-select-solid"
                  >
                    <option value="">Select Class</option>
                    {classesData?.data.map((cls: any) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                  {errors.classes && (
                    <span style={{ color: 'red', fontSize: '12px' }}>{errors.classes.message}</span>
                  )}
                </div>
              )}

              {/* Semester Select */}
              {selectedDepartment === 35 && (
                <div className="col-4 mb-7">
                  <label htmlFor="semesterId" className="required form-label">
                    Semester
                  </label>
                  <select
                    {...register('semesterId', { required: 'Semester is required' })}
                    className="form-select form-select-solid"
                  >
                    <option value="">Select Semester</option>
                    {semesterClassesData?.data?.map((semester: any) => (
                      <option key={semester.id} value={semester.id}>
                        {semester.name}
                      </option>
                    ))}
                  </select>
                  {errors.semesterId && (
                    <span style={{ color: 'red', fontSize: '12px' }}>{errors.semesterId.message}</span>
                  )}
                </div>
              )}

              <div className="col-4 mb-7">
                <label htmlFor="phoneNumber" className="required form-label">
                  Phone Number
                </label>
                <input
                  type="text"
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?\d{1,4}[-.\s]?\d{1,14}$/,
                      message: 'Invalid phone number format (e.g., +1234567890 or 123-456-7890)',
                    },
                  })}
                  className="form-control form-control-solid"
                  placeholder="e.g., +1234567890 or 123-456-7890"
                />
                {errors.phoneNumber && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.phoneNumber.message}</span>
                )}
              </div>

              {/* Profile Picture Upload */}
              <div className="col-4 mb-7">
                <label className="form-label">Profile Picture</label>
                <Controller
                  name="profilePicture"
                  control={control}
                  render={({ field }) => (
                    <Upload
                      beforeUpload={(file) => {
                        const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
                        if (!isImage) {
                          message.error('You can only upload JPEG, PNG, or JPG files!');
                          return false;
                        }
                        const isLt2M = file.size / 1024 / 1024 < 2;
                        if (!isLt2M) {
                          message.error('Image must be smaller than 2MB!');
                          return false;
                        }
                        field.onChange(file);
                        return false;
                      }}
                      onRemove={() => {
                        field.onChange(null);
                      }}
                      maxCount={1}
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
                    </Upload>
                  )}
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
  );
};

export { StudentsForm };
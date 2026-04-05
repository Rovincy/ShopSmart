import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, message, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Api_Endpoint,
  fetchAllClasses,
  fetchAllCourses,
  fetchAllSemesterClasses,
  fetchAllUserPositionApi,
  fetchDepartmentsApi,
} from '../../../services/ApiCalls';
import { useAuth } from '../../../modules/auth';

const { Option } = Select;

// Define the User type based on your backend DTO
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  aboutYou: string;
  departmentId: number;
  positionId: number;
  status: string;
  phoneNumber: string;
  matricule: string;
  wdmS_ID: string;
  dob?: string | null;
  sex?: string | null;
  profilePicture?: string | null;
  classId?: string | null;
  semesterId?: string | null;
  courses?: string[];
}

// Define FormValues for stricter typing
interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  aboutYou: string;
  departmentId: string;
  positionId: string;
  status: string;
  phoneNumber: string;
  matricule: string;
  wdms_id: string;
  dob: string;
  sex: string;
  profilePicture: FileList | null;
  classes: string;
  semesterId: string;
  courses: string[];
  password?: string;
}

const StudentsEditForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      aboutYou: '',
      departmentId: '',
      positionId: '',
      status: '',
      phoneNumber: '',
      matricule: '',
      wdms_id: '',
      dob: '',
      sex: '',
      profilePicture: null,
      classes: '',
      semesterId: '',
      courses: [],
      password: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [existingProfilePicture, setExistingProfilePicture] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { currentUser } = useAuth();
  const location = useLocation();
  const userData = location.state as User | undefined;
  const navigate = useNavigate();

  // Watch fields
  const selectedDept = watch('departmentId') || userData?.departmentId?.toString() || '';
  const selectedClass = watch('classes');
  const aboutYou = watch('aboutYou');
  const selectedClassId = selectedClass || userData?.classId || '';

  // Debugging logs for form changes
  useEffect(() => {
    console.log('Form Values:', watch());
    console.log('Selected Class:', selectedClass);
    console.log('Selected Class ID:', selectedClassId);
  }, [watch, selectedClass, selectedClassId]);

  // Queries
  const { data: userdepartments, isLoading: userdepartmentsLoad } = useQuery('departments', fetchDepartmentsApi);
  const { data: userPositions, isLoading: userPositionsLoad } = useQuery('userPositions', fetchAllUserPositionApi);
  const { data: coursesData } = useQuery('courses', fetchAllCourses);
  const { data: classesData } = useQuery('classes', fetchAllClasses);
  const { data: semesterClassesData } = useQuery(
    ['semesterClasses', selectedClassId],
    () => fetchAllSemesterClasses(selectedClassId),
    {
      enabled: !!selectedClassId,
    }
  );

  // Log query data for debugging
  useEffect(() => {
    console.log('Classes Data:', classesData);
    console.log('Semester Classes Data:', semesterClassesData);
    console.log('Departments Data:', userdepartments);
    console.log('Positions Data:', userPositions);
    console.log('Courses Data:', coursesData);
  }, [classesData, semesterClassesData, userdepartments, userPositions, coursesData]);

  // Calculate word count for aboutYou
  const wordCount = aboutYou ? aboutYou.trim().split(/\s+/).filter(Boolean).length : 0;

  // Prepare courses options for multi-select
  const courseOptions =
    coursesData?.data?.map((course: any) => ({
      label: course.name,
      value: course.id.toString(),
    })) || [];

  // Filter positions based on department selection
  const filteredPositions = userPositions?.data.filter(
    (position: any) => parseInt(String(position.departmentId)) === parseInt(String(selectedDept))
  );

  // Handle department change
  const handleDepartmentChange = (value: string) => {
    setValue('departmentId', value, { shouldValidate: true });
    setValue('positionId', '', { shouldValidate: true });
    setValue('classes', '', { shouldValidate: true });
    setValue('semesterId', '', { shouldValidate: true });
    setValue('courses', [], { shouldValidate: true });
    setSelectedCategories([]);
  };

  // Handle multi-select change for courses
  const handleMultiSelectChange = (newValue: any) => {
    setSelectedCategories(newValue || []);
  };

  // Pre-populate form with userData only on initial load
  useEffect(() => {
    if (userData && !userdepartmentsLoad && !userPositionsLoad && isInitialLoad) {
      reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        username: userData.username || '',
        aboutYou: userData.aboutYou || '',
        departmentId: userData.departmentId?.toString() || '',
        positionId: userData.positionId?.toString() || '',
        status: userData.status || '',
        phoneNumber: userData.phoneNumber || '',
        matricule: userData.matricule || '',
        wdms_id: userData.wdmS_ID || '',
        dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : '',
        sex: userData.sex || '',
        profilePicture: null,
        classes: userData.classId || '',
        semesterId: userData.semesterId || '',
        courses: userData.courses || [],
        password: '',
      });
      setExistingProfilePicture(userData.profilePicture ? `${userData.profilePicture}` : null);
      setProfilePicturePreview(userData.profilePicture ? `${Api_Endpoint}${userData.profilePicture}` : null);

      // Pre-populate courses for departmentId 34
      if (userData.departmentId === 34 && userData.courses) {
        const preSelectedCourses = courseOptions.filter((opt: any) => userData.courses?.includes(opt.value));
        setSelectedCategories(preSelectedCourses);
      }
      setIsInitialLoad(false);
    }
  }, [userData, userdepartmentsLoad, userPositionsLoad, reset, courseOptions, isInitialLoad]);

  // Clear positionId when department changes
  useEffect(() => {
    if (userData && selectedDept !== userData.departmentId?.toString()) {
      setValue('positionId', '');
    }
  }, [selectedDept, setValue, userData]);

  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(newPreviewUrl);
    }
  };

  // Define updateUser mutation
  const { mutate: updateUser } = useMutation(
    (formData: FormData) =>
      axios.put(`${Api_Endpoint}/users`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    {
      onSuccess: async () => {
        message.success('User updated successfully');
        const trailData = {
          userId: currentUser?.id,
          action: `User updated records for ${userData?.firstName} ${userData?.lastName}`,
        };
        await axios.post(`${Api_Endpoint}/auditTrail`, trailData);
        navigate('/StudentsSetup');
        setLoading(false);
      },
      onError: (error: unknown) => {
        console.error(error);
        setLoading(false);
        message.error('Update failed');
      },
    }
  );

  // Form submission handler
  const onSubmit = handleSubmit(async (values: FormValues) => {
    setLoading(true);

    // Validation
    if (values.password && values.password.length <= 6) {
      message.error('Password must have more than 6 characters');
      setLoading(false);
      return;
    }

    if (parseInt(String(selectedDept)) === 34 && (!values.courses || values.courses.length === 0)) {
      message.error('Please select at least one course.');
      setLoading(false);
      return;
    }

    if (parseInt(String(selectedDept)) === 35 && !values.classes) {
      message.error('Please select a class.');
      setLoading(false);
      return;
    }

    if (parseInt(String(selectedDept)) === 35 && !values.semesterId) {
      message.error('Please select a semester.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('id', String(userData?.id));
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('email', values.email);
    formData.append('departmentId', values.departmentId);
    formData.append('positionId', values.positionId);
    formData.append('username', values.username);
    if (values.password) formData.append('password', values.password);
    formData.append('status', values.status);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('wdmS_ID', values.wdms_id);
    formData.append('matricule', values.matricule);
    formData.append('updatedBy', String(currentUser?.id));
    formData.append('dob', values.dob);
    formData.append('aboutYou', values.aboutYou);
    formData.append('sex', values.sex);
    if (values.profilePicture?.[0]) formData.append('profilePicture', values.profilePicture[0]);
    if (parseInt(String(selectedDept)) === 35) {
      formData.append('classId', values.classes);
      formData.append('semesterId', values.semesterId);
    }
    if (parseInt(String(selectedDept)) === 34) {
      formData.append('courses', JSON.stringify(values.courses.map((id: string) => parseInt(id))));
    }

    try {
      updateUser(formData);
    } catch (error) {
      setLoading(false);
      console.error(error);
      message.error('Update failed');
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

      <form onSubmit={onSubmit}>
        <div className="tab-content">
          <div className="col-12">
            <div className="row mb-0">
              <div className="col-4 mb-7">
                <label htmlFor="firstName" className="required form-label">
                  First Name
                </label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  value={watch('firstName')}
                  onChange={(e) => setValue('firstName', e.target.value, { shouldValidate: true })}
                  className="form-control form-control-solid"
                />
                {errors.firstName && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.firstName.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label htmlFor="lastName" className="required form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  value={watch('lastName')}
                  onChange={(e) => setValue('lastName', e.target.value, { shouldValidate: true })}
                  className="form-control form-control-solid"
                />
                {errors.lastName && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.lastName.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label htmlFor="email" className="required form-label">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid email address',
                    },
                  })}
                  value={watch('email')}
                  onChange={(e) => setValue('email', e.target.value, { shouldValidate: true })}
                  className="form-control form-control-solid"
                />
                {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>}
              </div>
            </div>
            <div className="row mb-0">
              <div className="col-4 mb-7">
                <label htmlFor="username" className="required form-label">
                  Username
                </label>
                <input
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                  value={watch('username')}
                  onChange={(e) => setValue('username', e.target.value, { shouldValidate: true })}
                  className="form-control form-control-solid"
                />
                {errors.username && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.username.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label htmlFor="password" className="form-label">
                  Password (Leave empty if unchanged)
                </label>
                <input
                  type="password"
                  {...register('password', {
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                  value={watch('password')}
                  onChange={(e) => setValue('password', e.target.value, { shouldValidate: true })}
                  className="form-control form-control-solid"
                />
                {errors.password && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label className="required form-label">Department</label>
                {userdepartmentsLoad ? (
                  <div>Loading departments...</div>
                ) : (
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
                        {userdepartments?.data.map((dept: any) => (
                          <Option key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                )}
                {errors.departmentId && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.departmentId.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label className="required form-label">Position</label>
                {userPositionsLoad ? (
                  <div>Loading positions...</div>
                ) : (
                  <select
                    {...register('positionId', { required: 'Position is required' })}
                    value={watch('positionId')}
                    onChange={(e) => setValue('positionId', e.target.value, { shouldValidate: true })}
                    className="form-select form-select-solid"
                  >
                    <option value="">Select Position</option>
                    {filteredPositions?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.positionName}
                      </option>
                    ))}
                  </select>
                )}
                {errors.positionId && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.positionId.message}</span>
                )}
              </div>
              {(parseInt(String(selectedDept)) === 35 || parseInt(String(selectedDept)) === 34) && (
                <div className="col-4 mb-7">
                  <label htmlFor="matricule" className="required form-label">
                    Matricule
                  </label>
                  <input
                    type="text"
                    {...register('matricule', { required: 'Matricule is required' })}
                    value={watch('matricule')}
                    onChange={(e) => setValue('matricule', e.target.value, { shouldValidate: true })}
                    className="form-control form-control-solid"
                  />
                  {errors.matricule && (
                    <span style={{ color: 'red', fontSize: '12px' }}>{errors.matricule.message}</span>
                  )}
                </div>
              )}
              <div className="col-4 mb-7">
                <label className="required form-label">Status</label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  value={watch('status')}
                  onChange={(e) => setValue('status', e.target.value, { shouldValidate: true })}
                  className="form-select form-select-solid"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.status.message}</span>
                )}
              </div>
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
                  value={watch('phoneNumber')}
                  onChange={(e) => setValue('phoneNumber', e.target.value, { shouldValidate: true })}
                  className="form-control form-control-solid"
                />
                {errors.phoneNumber && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.phoneNumber.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label htmlFor="wdms_id" className="required form-label">
                  WDMS ID
                </label>
                <input
                  type="number"
                  {...register('wdms_id', { required: 'WDMS ID is required' })}
                  value={watch('wdms_id')}
                  onChange={(e) => setValue('wdms_id', e.target.value, { shouldValidate: true })}
                  className="form-control form-control-solid"
                />
                {errors.wdms_id && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.wdms_id.message}</span>
                )}
              </div>
              <div className="col-4 mb-7">
                <label htmlFor="dob" className="form-label">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register('dob')}
                  value={watch('dob')}
                  onChange={(e) => setValue('dob', e.target.value, { shouldValidate: true })}
                  className="form-control form-control-solid"
                />
              </div>
              <div className="col-4 mb-7">
                <label className="form-label">Sex</label>
                <select
                  {...register('sex')}
                  value={watch('sex')}
                  onChange={(e) => setValue('sex', e.target.value, { shouldValidate: true })}
                  className="form-select form-select-solid"
                >
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-4 mb-7">
                <label className="required form-label">About You</label>
                <input
                  type="text"
                  {...register('aboutYou', {
                    required: 'About you is required',
                    validate: (value: string) => {
                      const words = value.trim().split(/\s+/).filter(Boolean).length;
                      return words <= 159 || 'About you must not exceed 159 words';
                    },
                  })}
                  value={watch('aboutYou')}
                  onChange={(e) => setValue('aboutYou', e.target.value, { shouldValidate: true })}
                  className="form-control form-control-solid"
                />
                <div style={{ fontSize: '12px', color: wordCount > 159 ? 'red' : 'gray' }}>
                  Word count: {wordCount}/159
                </div>
                {errors.aboutYou && (
                  <span style={{ color: 'red', fontSize: '12px' }}>{errors.aboutYou.message}</span>
                )}
              </div>
              {/* Courses Multi-Select for Department 34 */}
              {parseInt(String(selectedDept)) === 34 && (
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
                        mode="multiple"
                        allowClear
                        placeholder="Select relevant courses"
                        options={courseOptions}
                        value={selectedCategories}
                        onChange={(value) => {
                          const newSelected = courseOptions.filter((opt: any) => value.includes(opt.value));
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
              {/* Class Select for Department 35 */}
              {parseInt(String(selectedDept)) === 35 && (
                <div className="col-4 mb-7">
                  <label htmlFor="classes" className="required form-label">
                    Class
                  </label>
                  <select
                    {...register('classes', { required: 'Class is required' })}
                    value={watch('classes')}
                    onChange={(e) => setValue('classes', e.target.value, { shouldValidate: true })}
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
              {/* Semester Select for Department 35 */}
              {parseInt(String(selectedDept)) === 35 && (
                <div className="col-4 mb-7">
                  <label htmlFor="semesterId" className="required form-label">
                    Semester
                  </label>
                  <select
                    {...register('semesterId', { required: 'Semester is required' })}
                    value={watch('semesterId')}
                    onChange={(e) => setValue('semesterId', e.target.value, { shouldValidate: true })}
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
                <label htmlFor="profilePicture" className="form-label">
                  Profile Picture
                </label>
                {existingProfilePicture && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '12px', color: 'gray' }}>Current Profile Picture:</label>
                    <img
                      src={existingProfilePicture}
                      alt="Current Profile"
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block',
                        marginTop: '5px',
                      }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  {...register('profilePicture')}
                  onChange={handleProfilePictureChange}
                  className="form-control form-control-solid"
                />
                {profilePicturePreview && profilePicturePreview !== existingProfilePicture && (
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '12px', color: 'gray' }}>New Profile Picture Preview:</label>
                    <img
                      src={profilePicturePreview}
                      alt="Profile Preview"
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block',
                        marginTop: '5px',
                      }}
                    />
                  </div>
                )}
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

export { StudentsEditForm };
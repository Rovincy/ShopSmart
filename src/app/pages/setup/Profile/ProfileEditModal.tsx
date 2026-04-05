import React, { useState, useEffect } from 'react';
import { 
  Modal, Form, Input, Upload, Button, message, Avatar, Spin, Select 
} from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined, LinkOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Api_Endpoint } from '../../../services/ApiCalls';

interface WhatsAppProfile {
  phoneNumberId: string;
  accessToken?: string;
  name?: string;
  about?: string;
  email?: string;
  website?: string;
  address?: string;
  vertical?: string;
  picture_url?: string;
  picture_handle?: string;
}

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  user: WhatsAppProfile;
  onUpdate: (updatedData: WhatsAppProfile) => void;
}

const VERTICAL_OPTIONS = [
  { value: 'OTHER', label: 'Other' },
  { value: 'AUTO', label: 'Automotive' },
  { value: 'BEAUTY', label: 'Beauty, Spa and Salon' },
  { value: 'APPAREL', label: 'Clothing and Apparel' },
  { value: 'EDU', label: 'Education' },
  { value: 'ENTERTAIN', label: 'Entertainment' },
  { value: 'EVENT_PLAN', label: 'Event Planning and Service' },
  { value: 'FINANCE', label: 'Finance and Banking' },
  { value: 'GROCERY', label: 'Food and Grocery' },
  { value: 'GOVT', label: 'Government & Public Service' },
  { value: 'HOTEL', label: 'Hotel and Lodging' },
  { value: 'HEALTH', label: 'Medical and Health' },
  { value: 'NONPROFIT', label: 'Non-profit' },
  { value: 'PROF_SERVICES', label: 'Professional Services' },
  { value: 'RETAIL', label: 'Shopping and Retail' },
  { value: 'TRAVEL', label: 'Travel and Transportation' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'ALCOHOL', label: 'Alcoholic Beverages' },
];

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ 
  visible, 
  onClose, 
  user, 
  onUpdate 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(user.picture_url);

  // Set form values ONCE when modal becomes visible
  useEffect(() => {
    if (!visible) return;

    // Set values from local database (most reliable for display)
    form.setFieldsValue({
      displayName: user.name || '',
      about: user.about || '',
      email: user.email || '',
      website: user.website || '',
      address: user.address || '',
      vertical: user.vertical || 'OTHER',
    });

    setPreviewUrl(user.picture_url);
    setFileList([]);

    // Optional: Try to refresh from Meta in background (without clearing form on failure)
    const refreshFromMeta = async () => {
      if (!user.accessToken) return;

      try {
        const res = await axios.get(
          `https://graph.facebook.com/v22.0/${user.phoneNumberId}/whatsapp_business_profile`,
          {
            params: {
              fields: "name,about,email,websites,address,vertical,profile_picture_url",
              access_token: user.accessToken,
            },
          }
        );

        const data = res.data;

        // Only update if we actually got meaningful data
        if (data.name || data.about || data.vertical) {
          form.setFieldsValue({
            displayName: data.name || user.name || '',
            about: data.about || user.about || '',
            email: data.email || user.email || '',
            website: data.websites?.[0] || user.website || '',
            address: data.address || user.address || '',
            vertical: data.vertical || user.vertical || 'OTHER',
          });

          if (data.profile_picture_url) {
            setPreviewUrl(data.profile_picture_url);
          }
        }
      } catch (err) {
        console.log("Could not refresh from Meta, using local data");
        // Do NOT clear the form on error
      }
    };

    // Small delay so user sees the local data first
    const timer = setTimeout(refreshFromMeta, 800);

    return () => clearTimeout(timer);
  }, [visible, user, form]);

  const handlePictureChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList.slice(-1));
    const file = newFileList[0]?.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

    const handleSubmit = async (values: any) => {
    if (!user.accessToken) {
      return message.error("Access token is missing");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("phoneNumberId", user.phoneNumberId);
      formData.append("accessToken", user.accessToken);

      if (values.displayName) formData.append("businessName", values.displayName);
      if (values.about) formData.append("about", values.about);
      if (values.email) formData.append("email", values.email);
      if (values.website) formData.append("website", values.website);
      if (values.address) formData.append("address", values.address);
      if (values.vertical) formData.append("vertical", values.vertical);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }

      const res = await axios.post(`${Api_Endpoint}/WhatsApp/update-profile-full`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Send back the updated data + new picture URL from backend
      const updatedProfile: WhatsAppProfile = {
        phoneNumberId: user.phoneNumberId,
        accessToken: user.accessToken,
        name: values.displayName,
        about: values.about,
        email: values.email,
        website: values.website,
        address: values.address,
        vertical: values.vertical,
        picture_url: res.data.profilePictureUrl || user.picture_url,   // This is critical
        picture_handle: res.data.profilePictureHandle,
      };

      onUpdate(updatedProfile);
      setFileList([]);
      onClose();
    } catch (err: any) {
      message.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title="Update WhatsApp Business Profile"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={620}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Profile Picture">
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Avatar
                size={100}
                src={previewUrl}
                icon={<UserOutlined />}
                style={{ border: "2px solid #d9d9d9" }}
              />
            </div>
            <Upload
              accept="image/jpeg,image/png"
              listType="picture-card"
              fileList={fileList}
              onChange={handlePictureChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Change Picture</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="displayName" label="Business Name" rules={[{ required: true }]}>
            <Input placeholder="Enter business display name" />
          </Form.Item>

          <Form.Item name="about" label="About">
            <Input.TextArea rows={3} placeholder="Short business description" />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input placeholder="contact@business.com" prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item name="website" label="Website">
            <Input placeholder="https://yourbusiness.com" prefix={<LinkOutlined />} />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input placeholder="123 Business Street, City" prefix={<EnvironmentOutlined />} />
          </Form.Item>

          <Form.Item 
            name="vertical" 
            label="Business Category" 
            rules={[{ required: true, message: "Please select a business category" }]}
          >
            <Select
              placeholder="Select business category"
              options={VERTICAL_OPTIONS}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              {loading ? "Updating..." : "Update WhatsApp Profile"}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ProfileEditModal;
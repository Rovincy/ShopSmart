import { useState, useEffect } from "react";
import { Avatar, Typography, Button, Space, message, Spin } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import ProfileEditModal from "../../../../../app/pages/setup/Profile/ProfileEditModal";
import { Api_Endpoint } from "../../../../../app/services/ApiCalls";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";

import { useIntl } from 'react-intl';
import { toAbsoluteUrl } from "../../../../helpers";
const { Text } = Typography;

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
  updatedAt?: string;
}

const SidebarMenuMain = () => {
  const intl = useIntl();
  const [profile, setProfile] = useState<WhatsAppProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editVisible, setEditVisible] = useState<boolean>(false);

  const PHONE_NUMBER_ID = "1076356745550959";
  const ACCESS_TOKEN = "EAAUtPZBluGVcBQ4ZAmUSnzEalgnm67FZBIJRaG53uakZCPcl2j5ID2C0jTMS3g4JdfdidRml9AnkXzUnPN5KhPzl0oXsDaSghao0UA1j0SLuobfnAEw2kScZCiGdRRfMhenIgfBiZChsV3CSKunhS3G8gPYVK9G6lJFZBdzUULY8ZBqcVs2PSGmZCE9bf1q3pAgZDZD";

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Api_Endpoint}/WhatsApp/profile`, {
        params: {
          phoneNumberId: PHONE_NUMBER_ID,
          accessToken: ACCESS_TOKEN,
        },
      });

      setProfile({
        ...response.data,
        accessToken: ACCESS_TOKEN,
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      message.error("Failed to load WhatsApp business profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // FIXED: Properly merge new data and refresh from server
  const handleProfileUpdate = async (updatedData: WhatsAppProfile) => {
    try {
      // Immediately show the new text data
      setProfile(prev => ({
        ...prev,
        ...updatedData,
      }));

      // Then refresh full profile from backend to get the latest picture_url
      setTimeout(async () => {
        const response = await axios.get(`${Api_Endpoint}/WhatsApp/profile`, {
          params: {
            phoneNumberId: PHONE_NUMBER_ID,
            accessToken: ACCESS_TOKEN,
          },
        });

        setProfile({
          ...response.data,
          accessToken: ACCESS_TOKEN,
        });
      }, 800); // small delay to let backend finish saving

      message.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to refresh profile:", error);
      message.error("Profile updated, but failed to refresh display");
    }
  };

  const displayName = profile?.name || "Business Name";
  const aboutText = profile?.about;

  return (
    <>
      <div
        style={{
          textAlign: "center",
          padding: "24px 16px",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 16,
        }}
      >
        <Spin spinning={loading} size="large">
          <Avatar
            size={88}
            src={profile?.picture_url}
            icon={<UserOutlined />}
            style={{
              marginBottom: 16,
              border: "3px solid #1890ff",
              backgroundColor: "#f5f5f5",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          />

          <Space direction="vertical" size={6} style={{ width: "100%" }}>
            <Text strong style={{ fontSize: 18, color: "white", display: "block" }}>
              {displayName}
            </Text>
            {aboutText && (
              <Text type="secondary" style={{ color: "white", textAlign: "center", padding: "0 12px" }}>
                {aboutText}
              </Text>
            )}
          </Space>

          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => setEditVisible(true)}
            style={{ marginTop: 12, color: "#fff", fontWeight: 500 }}
          >
            Edit WhatsApp Profile
          </Button>
        </Spin>
      </div>
<SidebarMenuItem
        to="/dashboard"
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
        fontIcon="bi-app-indicator"
      />

      <SidebarMenuItem
        to="HomePage/"
        icon={toAbsoluteUrl("/media/svg/global.svg")}
        title="Sales"
      />
      <SidebarMenuItem
        to="report-page/"
        icon={toAbsoluteUrl("/media/svg/files/dark/doc.svg")}
        title="Reports"
      />

      <SidebarMenuItemWithSub to="#" icon={toAbsoluteUrl("/media/svg/settings.svg")} title="Setup">
        <SidebarMenuItem
          to="Setup/Products/"
          hasBullet={false}
          icon="/media/svg/premium.svg"
          title="Products"
        />
        <SidebarMenuItem
          to="Setup/Stocks/"
          hasBullet={false}
          icon={toAbsoluteUrl('/media/svg/history.svg')}
          title="Stock"
        />
        
      </SidebarMenuItemWithSub>
      <ProfileEditModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        user={profile || { phoneNumberId: PHONE_NUMBER_ID, accessToken: ACCESS_TOKEN }}
        onUpdate={handleProfileUpdate}
      />
    </>
  );
};

export { SidebarMenuMain };
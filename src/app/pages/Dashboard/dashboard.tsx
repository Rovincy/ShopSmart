import React, { useState, useEffect } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Spin,
  Typography,
  Badge,
} from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const { Title, Text } = Typography;
const { Content } = Layout;

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  paidOrders: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    productRetailerId: string;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  monthlyRevenueTrend: Array<{
    month: string;
    revenue: number;
  }>;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('https://api.rovincy.com/api/dashboard/stats');
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      
      const data: DashboardStats = await res.json();
    //   console.log(data)
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching
  if (loading) {
    return (
      <Spin 
        size="large" 
        tip="Loading dashboard statistics..." 
        style={{ display: 'block', margin: '120px auto' }} 
      />
    );
  }

  // Safety check - in case API returns null/empty
  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Text type="danger">Failed to load dashboard data. Please try again.</Text>
      </div>
    );
  }

  // Chart Configuration
  const monthlyChartOptions: ApexOptions = {
    chart: {
      type: 'line' as const,
      height: 350,
      toolbar: { show: true },
    },
    xaxis: {
      categories: stats.monthlyRevenueTrend?.map((m) => m.month) || [],
    },
    yaxis: {
      title: { text: 'Revenue (GHS)' },
    },
    stroke: {
      curve: 'smooth' as const,
    },
    colors: ['#3b82f6'],
    title: {
      text: 'Monthly Revenue Trend (Last 6 Months)',
      align: 'left' as const,
    },
    dataLabels: { enabled: false },
    grid: { borderColor: '#f1f1f1' },
  };

  const monthlySeries = [
    {
      name: 'Revenue',
      data: stats.monthlyRevenueTrend?.map((m) => Number(m.revenue)) || [],
    },
  ];

  // Top Products Columns
  const topProductsColumns = [
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    { 
      title: 'Units Sold', 
      dataIndex: 'totalQuantity', 
      key: 'totalQuantity',
      sorter: (a: any, b: any) => a.totalQuantity - b.totalQuantity,
    },
    { 
      title: 'Revenue Generated', 
      dataIndex: 'totalRevenue', 
      key: 'totalRevenue',
      render: (val: number) => `GHS ${Number(val).toFixed(2)}`,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>ShopSmart Dashboard</Title>
          <Text type="secondary">Business Overview • Real-time Insights</Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* KPI Cards */}
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={stats.totalRevenue}
                precision={2}
                prefix={<DollarOutlined />}
                suffix=" GHS"
                valueStyle={{ color: '#16a34a' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={stats.totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#3b82f6' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending Orders"
                value={stats.pendingOrders}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#f59e0b' }}
              />
              <Badge status="warning" text="Needs Attention" style={{ marginTop: 8 }} />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Avg Order Value"
                value={stats.averageOrderValue}
                precision={2}
                prefix={<DollarOutlined />}
                suffix=" GHS"
              />
            </Card>
          </Col>

          {/* Revenue Trend Chart */}
          <Col span={24}>
            <Card title="Monthly Revenue Trend">
              <ReactApexChart
                options={monthlyChartOptions}
                series={monthlySeries}
                type="line"
                height={350}
              />
            </Card>
          </Col>

          {/* Top Selling Products */}
          <Col xs={24} lg={14}>
            <Card 
              title="Best Selling Products" 
              extra={<Text type="secondary">By quantity sold</Text>}
            >
              <Table
                dataSource={stats.topSellingProducts || []}
                columns={topProductsColumns}
                rowKey="ProductRetailerId"
                pagination={false}
                scroll={{ y: 400 }}
              />
            </Card>
          </Col>

          {/* Order Status */}
          <Col xs={24} lg={10}>
            <Card title="Order Status Breakdown">
              <div style={{ padding: '20px 0', fontSize: 16 }}>
                <p><strong>Pending:</strong> {stats.pendingOrders} orders</p>
                <p><strong>Paid:</strong> {stats.paidOrders} orders</p>
                <p><strong>Total:</strong> {stats.totalOrders} orders</p>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default DashboardPage;
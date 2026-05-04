import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Layout,
  Row,
  Col,
  Card,
  Select,
  InputNumber,
  Button,
  Table,
  Form,
  Radio,
  Space,
  Typography,
  Divider,
  message,
  Spin,
  Alert,
  Modal,
  Tag,
  Popconfirm,
  Badge,
  Drawer,
  Statistic,
  Input,
} from 'antd';
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  ReloadOutlined,
  PlusOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const API_BASE = 'https://api.rovincy.com/api';

const HomePage: React.FC = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Products
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Cart
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('mobile_money');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [cartVisible, setCartVisible] = useState(false);

  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Modals
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Helper to parse price
  const parsePrice = (priceStr: string | number): number => {
    if (!priceStr) return 0;
    const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // Fetch Products with Real Stock
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get(`${API_BASE}/products/with-stock`);

      const mapped = res.data.map((p: any) => ({
        retailerId: p.retailer_id,
        name: p.name,
        price: parsePrice(p.price),
        imageUrl: p.image_url,
        stock: Math.max(0, Number(p.stock) || 0),
        description: p.description || '',
      }));

      setProducts(mapped);
    } catch (err: any) {
      setProductsError('Failed to load products');
      message.error('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrdersError(null);

      const params: any = { page: currentPage, pageSize };
      if (statusFilter) params.status = statusFilter;

      const res = await axios.get(`${API_BASE}/Orders`, { params });

      setOrders(res.data || []);
      setTotalOrders(parseInt(res.headers['x-total-count'] || res.data.length || '0', 10));
    } catch (err: any) {
      setOrdersError(err.response?.data?.message || 'Failed to load orders');
      message.error('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Initial load + auto refresh products
  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch orders when page or filter changes
  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  // Cart Functions
  const addToCart = () => {
    if (!selectedProduct || quantity < 1) {
      return message.warning('Please select a product and quantity');
    }

    const product = products.find((p) => p.retailerId === selectedProduct);
    if (!product) return;

    if (quantity > product.stock) {
      return message.error(`Only ${product.stock} units available in stock`);
    }

    const existing = cart.find((item) => item.retailerId === selectedProduct);

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        return message.error(`Cannot exceed available stock (${product.stock})`);
      }
      setCart(cart.map((i) =>
        i.retailerId === selectedProduct ? { ...i, quantity: newQty } : i
      ));
    } else {
      setCart([...cart, {
        retailerId: product.retailerId,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
        stock: product.stock,
      }]);
    }

    message.success(`Added ${quantity} × ${product.name}`);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const removeFromCart = (retailerId: string) => {
    setCart(cart.filter((i) => i.retailerId !== retailerId));
    message.info('Item removed from cart');
  };

  const updateCartQty = (retailerId: string, newQty: number | null) => {
    if (newQty == null || newQty < 1) return;

    const product = products.find((p) => p.retailerId === retailerId);
    if (!product || newQty > product.stock) {
      return message.error(`Only ${product?.stock || 0} available`);
    }

    setCart(cart.map((i) =>
      i.retailerId === retailerId ? { ...i, quantity: newQty } : i
    ));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Place Order
  const placeOrder = async () => {
    if (cart.length === 0) return message.warning('Cart is empty');

    // Final stock check
    for (const item of cart) {
      const currentProduct = products.find((p) => p.retailerId === item.retailerId);
      if (!currentProduct || item.quantity > currentProduct.stock) {
        return message.error(`Insufficient stock for "${item.name}". Available: ${currentProduct?.stock || 0}`);
      }
    }

    const payload = {
      userId: 1,
      paymentMethod,
      shippingAddress: shippingAddress.trim() || null,
      items: cart.map((item) => ({
        productRetailerId: item.retailerId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl || '',
      })),
    };

    try {
      await axios.post(`${API_BASE}/Orders/dashboard`, payload);
      message.success('Order placed successfully!');

      setCart([]);
      setPaymentMethod('mobile_money');
      setShippingAddress('');
      setCartVisible(false);

      fetchOrders();
      await fetchProducts();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  // Order Actions
  const showOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setViewModalVisible(true);
  };

  const showEditStatus = (order: any) => {
    setSelectedOrder(order);
    editForm.setFieldsValue({ status: order.status });
    setEditModalVisible(true);
  };

  const handleUpdateStatus = async (values: { status: string }) => {
    try {
      await axios.patch(`${API_BASE}/Orders/${selectedOrder.id}/status`, { status: values.status });
      message.success('Status updated');
      setEditModalVisible(false);
      fetchOrders();
    } catch (err) {
      message.error('Failed to update status');
    }
  };

  const handleDeleteOrder = async (id: string | number) => {
    try {
      await axios.delete(`${API_BASE}/Orders/${id}`);
      message.success('Order deleted');
      fetchOrders();
    } catch (err) {
      message.error('Failed to delete order');
    }
  };

  const getStatusTag = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'orange',
      paid: 'blue',
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red',
      refunded: 'magenta',
    };
    return <Tag color={colors[status] || 'default'}>{status.toUpperCase()}</Tag>;
  };

  const orderColumns = [
    { title: 'Order #', dataIndex: 'orderNumber', key: 'orderNumber', render: (t: string) => <strong>{t}</strong> },
    { title: 'User ID', dataIndex: 'userId', key: 'userId' },
    { 
      title: 'Total', 
      dataIndex: 'total', 
      key: 'total', 
      render: (t: number) => <strong>GHS {Number(t).toFixed(2)}</strong> 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: getStatusTag 
    },
    { 
      title: 'Created', 
      dataIndex: 'createdAt', 
      key: 'createdAt', 
      render: (d: string) => new Date(d).toLocaleString() 
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => showOrderDetails(record)}>
            View
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => showEditStatus(record)}>
            Status
          </Button>
          <Popconfirm
            title="Delete this order?"
            onConfirm={() => handleDeleteOrder(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const orderItemColumns = [
    { title: 'Product', dataIndex: 'productName', key: 'productName' },
    { title: 'Retailer ID', dataIndex: 'productRetailerId', key: 'productRetailerId' },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity' },
    { 
      title: 'Price', 
      dataIndex: 'priceAtOrder', 
      key: 'priceAtOrder', 
      render: (p: number) => `GHS ${p.toFixed(2)}` 
    },
    {
      title: 'Image',
      key: 'image',
      render: (_: any, r: any) => (
        <img 
          src={r.imageUrl} 
          alt={r.productName} 
          width={60} 
          style={{ borderRadius: 6, objectFit: 'cover' }} 
        />
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 32px', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
          ShopSmart <span style={{ color: '#3b82f6' }}>Dashboard</span>
        </Title>

        <Space>
          <Button 
            type="primary" 
            icon={<ShoppingCartOutlined />}
            onClick={() => setCartVisible(true)}
            size="large"
          >
            Cart <Badge count={cart.length} style={{ marginLeft: 8 }} />
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            size="large"
            onClick={() => { fetchOrders(); fetchProducts(); }}
          >
            Refresh
          </Button>
        </Space>
      </Header>

      <Layout>
        {/* Sidebar Stats */}
        <Sider width={300} theme="light" style={{ borderRight: '1px solid #e5e7eb', padding: '24px' }}>
          <Title level={5} style={{ marginBottom: 24 }}>Overview</Title>
          
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card>
              <Statistic 
                title="Total Orders" 
                value={totalOrders} 
                prefix={<ShoppingOutlined />} 
                valueStyle={{ color: '#3b82f6' }}
              />
            </Card>

            <Card>
              <Statistic 
                title="Pending Orders" 
                value={orders.filter((o: any) => o.status === 'pending').length} 
                prefix={<DollarOutlined />} 
                valueStyle={{ color: '#f59e0b' }}
              />
            </Card>

            <Card>
              <Statistic 
                title="Available Products" 
                value={products.length} 
                prefix={<ShoppingOutlined />} 
              />
            </Card>
          </Space>
        </Sider>

        {/* Main Content */}
        <Content style={{ padding: '32px' }}>
          <Row gutter={[24, 24]}>
            {/* Orders Section */}
            <Col span={24}>
              <Card
                title={
                  <Space>
                    Recent Orders
                    <Badge 
                      count={orders.filter((o: any) => o.status === 'pending').length} 
                      color="#f59e0b" 
                    />
                  </Space>
                }
                extra={
                  <Select
                    placeholder="Filter by status"
                    allowClear
                    style={{ width: 220 }}
                    onChange={(val) => setStatusFilter(val)}
                  >
                    <Option value="pending">Pending</Option>
                    <Option value="paid">Paid</Option>
                    {/* <Option value="shipped">Shipped</Option>
                    <Option value="delivered">Delivered</Option>
                    <Option value="cancelled">Cancelled</Option> */}
                  </Select>
                }
              >
                {loadingOrders ? (
                  <Spin size="large" style={{ padding: '100px', display: 'block' }} />
                ) : (
                  <Table
                    dataSource={orders}
                    columns={orderColumns}
                    rowKey="id"
                    pagination={{
                      current: currentPage,
                      pageSize,
                      total: totalOrders,
                      onChange: setCurrentPage,
                    }}
                    onRow={(record) => ({
                      onDoubleClick: () => showOrderDetails(record),
                    })}
                  />
                )}
              </Card>
            </Col>

            {/* Product Selection */}
            <Col span={24}>
              <Card 
                title="Add Products to Cart" 
                extra={<Text type="secondary">Stock updates automatically every 30 seconds</Text>}
              >
                {loadingProducts ? (
                  <Spin tip="Loading products..." />
                ) : productsError ? (
                  <Alert message={productsError} type="error" />
                ) : (
                  <Row gutter={16} align="middle">
                    <Col flex="auto">
                      <Select
                        placeholder="Search or select product..."
                        style={{ width: '100%', height:'150%' }}
                        size="large"
                        showSearch
                        optionFilterProp="label"
                        value={selectedProduct}
                        onChange={setSelectedProduct}
                      >
                        {products.map((prod) => (
                          <Option key={prod.retailerId} value={prod.retailerId} label={prod.name}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0' }}>
                              <img
                                src={prod.imageUrl}
                                alt={prod.name}
                                width={56}
                                height={56}
                                style={{ borderRadius: 8, objectFit: 'cover' }}
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/56?text=?')}
                              />
                              <div>
                                <div style={{ fontWeight: 500 }}>{prod.name}</div>
                                <Text type="secondary">
                                  GHS {prod.price.toFixed(2)} • <strong>{prod.stock}</strong> in stock
                                </Text>
                              </div>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Col>

                    <Col>
                      <InputNumber
                        min={1}
                        value={quantity}
                        onChange={(val) => setQuantity(val ?? 1)}
                        size="large"
                        style={{ width: 140 }}
                        addonBefore="Qty"
                      />
                    </Col>

                    <Col>
                      <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={addToCart}
                        disabled={!selectedProduct}
                      >
                        Add to Cart
                      </Button>
                    </Col>
                  </Row>
                )}
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>

      {/* Cart Drawer */}
      <Drawer
        title={
          <Space>
            <ShoppingCartOutlined /> Shopping Cart ({cart.length})
          </Space>
        }
        width={460}
        placement="right"
        onClose={() => setCartVisible(false)}
        open={cartVisible}
        footer={
          <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              <Text strong style={{ fontSize: 18 }}>Total Amount</Text>
              <Text style={{ fontSize: 26, color: '#16a34a', fontWeight: 700 }}>
                GHS {cartTotal.toFixed(2)}
              </Text>
            </Row>

            <Button
              type="primary"
              size="large"
              block
              onClick={placeOrder}
              disabled={cart.length === 0}
            >
              Place Order • GHS {cartTotal.toFixed(2)}
            </Button>
          </div>
        }
      >
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
            Your cart is empty.<br />Add products from the section above.
          </div>
        ) : (
          <>
            <Table
              dataSource={cart}
              rowKey="retailerId"
              pagination={false}
              columns={[
                {
                  title: 'Product',
                  dataIndex: 'name',
                  render: (text, record) => (
                    <Space>
                      <img
                        src={record.imageUrl}
                        alt={text}
                        width={50}
                        height={50}
                        style={{ borderRadius: 6, objectFit: 'cover' }}
                      />
                      <span>{text}</span>
                    </Space>
                  ),
                },
                {
                  title: 'Price',
                  render: (_, r) => `GHS ${r.price.toFixed(2)}`,
                },
                {
                  title: 'Qty',
                  render: (_, r) => (
                    <InputNumber
                      min={1}
                      value={r.quantity}
                      onChange={(v) => updateCartQty(r.retailerId, v)}
                      style={{ width: 80 }}
                    />
                  ),
                },
                {
                  title: 'Subtotal',
                  render: (_, r) => `GHS ${(r.price * r.quantity).toFixed(2)}`,
                },
                {
                  title: '',
                  render: (_, r) => (
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => removeFromCart(r.retailerId)}
                    />
                  ),
                },
              ]}
            />

            <Divider />

            <Form layout="vertical">
              <Form.Item label="Payment Method">
                <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <Space direction="vertical">
                    <Radio value="mobile_money">Mobile Money</Radio>
                    <Radio value="credit_card">Credit / Debit Card</Radio>
                    <Radio value="bank_transfer">Bank Transfer</Radio>
                    <Radio value="cash_on_delivery">Cash on Delivery</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Shipping Address (Optional)">
                <TextArea
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter delivery address..."
                />
              </Form.Item>
            </Form>
          </>
        )}
      </Drawer>

      {/* View Order Modal */}
      <Modal
        title={`Order #${selectedOrder?.orderNumber || 'N/A'}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedOrder && (
          <>
            <Row gutter={24}>
              <Col span={12}>
                <p><strong>User ID:</strong> {selectedOrder.userId}</p>
                <p><strong>Total:</strong> GHS {Number(selectedOrder.total).toFixed(2)}</p>
              </Col>
              <Col span={12}>
                <p><strong>Status:</strong> {getStatusTag(selectedOrder.status)}</p>
                <p><strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </Col>
            </Row>

            <Divider />
            <Title level={5}>Order Items</Title>
            <Table
              dataSource={selectedOrder.items || []}
              rowKey="productRetailerId"
              pagination={false}
              columns={orderItemColumns}
            />
          </>
        )}
      </Modal>

      {/* Edit Status Modal */}
      <Modal
        title="Update Order Status"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => editForm.submit()}
        okText="Update Status"
      >
        <Form form={editForm} onFinish={handleUpdateStatus} layout="vertical">
          <Form.Item name="status" label="New Status" rules={[{ required: true }]}>
            <Select size="large">
              <Option value="pending">Pending</Option>
              <Option value="paid">Paid</Option>
              <Option value="shipped">Shipped</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export { HomePage };
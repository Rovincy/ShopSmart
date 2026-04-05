// src/pages/StockPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Select,
  Space,
  Typography,
  Card,
  message,
  Spin,
  Alert,
  Pagination,
  Input as AntInput,
} from 'antd';
import { PlusOutlined, MinusOutlined, HistoryOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { Search } = AntInput;

const API_BASE = 'https://localhost:7294/api/Stock';

interface Product {
  id: string;
  name: string;
  retailer_id: string;
}

interface StockTransaction {
  id: number;
  productId: number;
  qty: number;
  transactionType: string;
  userId?: number;
  notes?: string;
  createdAt: string;
}

const StockPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [currentStocks, setCurrentStocks] = useState<Record<string, number>>({});
  const [loadingStocks, setLoadingStocks] = useState(true);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionTotal, setTransactionTotal] = useState(0);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  const [addForm] = Form.useForm();
  const [deductForm] = Form.useForm();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deductModalVisible, setDeductModalVisible] = useState(false);

  const [addLoading, setAddLoading] = useState(false);
  const [deductLoading, setDeductLoading] = useState(false);

  const [searchText, setSearchText] = useState('');

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await axios.get(`${API_BASE.replace('/Stock', '/Catalog')}/products`);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err: any) {
        setProductsError('Failed to load products');
        message.error('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Search/filter products
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredProducts(products);
      return;
    }

    const lowerSearch = searchText.toLowerCase().trim();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(lowerSearch) ||
      p.retailer_id.toLowerCase().includes(lowerSearch)
    );

    setFilteredProducts(filtered);
  }, [searchText, products]);

  // Fetch current stock for all products
  useEffect(() => {
    const fetchAllCurrentStock = async () => {
      try {
        setLoadingStocks(true);
        const stockMap: Record<string, number> = {};

        for (const product of products) {
          const res = await axios.get(`${API_BASE}/product/${product.retailer_id}/current`);
          stockMap[product.retailer_id] = res.data.currentStock;
        }

        setCurrentStocks(stockMap);
      } catch (err: any) {
        message.error('Failed to load current stock levels');
      } finally {
        setLoadingStocks(false);
      }
    };

    if (products.length > 0) {
      fetchAllCurrentStock();
    }
  }, [products]);

  // Fetch transaction history
  const fetchTransactions = async (productId: string, page: number = 1) => {
    if (!productId) return;

    setLoadingTransactions(true);
    try {
      const res = await axios.get(`${API_BASE}/product/${productId}`, {
        params: { page, pageSize: 10 },
      });

      setTransactions(res.data.items);
      setTransactionTotal(res.data.totalCount);
      setTransactionPage(page);
    } catch (err: any) {
      message.error('Failed to load transaction history');
    } finally {
      setLoadingTransactions(false);
    }
  };

  const openHistoryModal = (productId: string) => {
    setSelectedProductId(productId);
    fetchTransactions(productId, 1);
    setHistoryModalVisible(true);
  };

  const handleAddStock = async (values: any) => {
    setAddLoading(true);
    try {
      await axios.post(`${API_BASE}/add`, {
        productId: values.productId,
        qty: values.qty,
        notes: values.notes || 'Restock via dashboard',
      });
      message.success('Stock added successfully');
      setAddModalVisible(false);
      addForm.resetFields();

      // Refresh stock
      const res = await axios.get(`${API_BASE}/product/${values.productId}/current`);
      setCurrentStocks(prev => ({
        ...prev,
        [values.productId]: res.data.currentStock,
      }));
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to add stock');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeductStock = async (values: any) => {
    setDeductLoading(true);
    try {
      await axios.post(`${API_BASE}/deduct`, {
        productId: values.productId,
        qty: values.qty,
        notes: values.notes || 'Deduction via dashboard',
      });
      message.success('Stock deducted successfully');
      setDeductModalVisible(false);
      deductForm.resetFields();

      // Refresh stock
      const res = await axios.get(`${API_BASE}/product/${values.productId}/current`);
      setCurrentStocks(prev => ({
        ...prev,
        [values.productId]: res.data.currentStock,
      }));
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to deduct stock');
    } finally {
      setDeductLoading(false);
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Product) => record.name || `ID: ${record.retailer_id}`,
    },
    {
      title: 'Retailer ID',
      dataIndex: 'retailer_id',
      key: 'retailer_id',
    },
    {
      title: 'Current Stock',
      key: 'currentStock',
      render: (_: any, record: Product) => {
        const stock = currentStocks[record.retailer_id];
        return loadingStocks ? <Spin size="small" /> : (stock ?? 'N/A');
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              addForm.setFieldsValue({ productId: record.retailer_id, qty: 1 });
              setAddModalVisible(true);
            }}
            disabled={addLoading || deductLoading}
          >
            Add Stock
          </Button>
          <Button
            type="default"
            danger
            icon={<MinusOutlined />}
            onClick={() => {
              deductForm.setFieldsValue({ productId: record.retailer_id, qty: 1 });
              setDeductModalVisible(true);
            }}
            disabled={(currentStocks[record.retailer_id] ?? 0) <= 0 || addLoading || deductLoading}
          >
            Deduct Stock
          </Button>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => openHistoryModal(record.retailer_id)}
            disabled={addLoading || deductLoading}
          >
            History
          </Button>
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    { title: 'Type', dataIndex: 'transactionType', key: 'transactionType' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        Stock Management
      </Title>

      <Card bordered={false}>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <Search
            placeholder="Search by product name or retailer ID..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 400 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchText(value)}
          />
        </Space>

        {loadingProducts || loadingStocks ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" tip="Loading stock data..." />
          </div>
        ) : productsError ? (
          <Alert message={productsError} type="error" showIcon />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="retailer_id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>

      {/* Add Stock Modal */}
      <Modal
        title="Add Stock"
        open={addModalVisible}
        onCancel={() => !addLoading && setAddModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)} disabled={addLoading}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={addLoading}
            onClick={() => addForm.submit()}
            disabled={addLoading}
          >
            {addLoading ? 'Adding...' : 'Add Stock'}
          </Button>,
        ]}
        maskClosable={!addLoading}
        closable={!addLoading}
      >
        <Form form={addForm} onFinish={handleAddStock} layout="vertical" disabled={addLoading}>
          <Form.Item name="productId" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="qty"
            label="Quantity to Add"
            rules={[
              { required: true, message: 'Enter quantity' },
              { type: 'number', min: 1, message: 'Quantity must be at least 1' },
            ]}
            initialValue={1}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input placeholder="e.g. New shipment" />
          </Form.Item>
        </Form>

        {addLoading && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Spin tip="Adding stock..." />
          </div>
        )}
      </Modal>

      {/* Deduct Stock Modal */}
      <Modal
        title="Deduct Stock"
        open={deductModalVisible}
        onCancel={() => !deductLoading && setDeductModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeductModalVisible(false)} disabled={deductLoading}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            loading={deductLoading}
            onClick={() => deductForm.submit()}
            disabled={deductLoading}
          >
            {deductLoading ? 'Deducting...' : 'Deduct Stock'}
          </Button>,
        ]}
        maskClosable={!deductLoading}
        closable={!deductLoading}
      >
        <Form form={deductForm} onFinish={handleDeductStock} layout="vertical" disabled={deductLoading}>
          <Form.Item name="productId" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="qty"
            label="Quantity to Deduct"
            rules={[
              { required: true, message: 'Enter quantity' },
              { type: 'number', min: 1, message: 'Quantity must be at least 1' },
            ]}
            initialValue={1}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input placeholder="e.g. Sold 10 units" />
          </Form.Item>
        </Form>

        {deductLoading && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Spin tip="Deducting stock..." />
          </div>
        )}
      </Modal>

      {/* Transaction History Modal */}
      <Modal
        title={`Transaction History - ${products.find(p => p.retailer_id === selectedProductId)?.name || 'Product'}`}
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
        width={900}
      >
        {loadingTransactions ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin tip="Loading transaction history..." />
          </div>
        ) : transactions.length === 0 ? (
          <Alert message="No transactions found for this product" type="info" showIcon />
        ) : (
          <>
            <Table
              columns={transactionColumns}
              dataSource={transactions}
              rowKey="id"
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
            <Pagination
              current={transactionPage}
              total={transactionTotal}
              pageSize={10}
              onChange={(page) => fetchTransactions(selectedProductId!, page)}
              style={{ marginTop: 16, textAlign: 'right' }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export { StockPage };
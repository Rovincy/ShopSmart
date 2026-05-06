// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   Space,
//   Typography,
//   Card,
//   Popconfirm,
//   message,
//   Spin,
//   Alert,
//   Image,
//   Upload,
// } from 'antd';

// import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
// import type { UploadFile, UploadProps } from 'antd';
// import Search from 'antd/es/input/Search';

// const { Title } = Typography;
// const { Option } = Select;
// const { TextArea } = Input;

// const API_BASE = 'https://api.rovincy.com/api/products';

// interface Product {
//   id: number | string;           // Local ID
//   retailer_id: string;
//   name: string;
//   price: number;
//   currency: string;
//   image_url: string;
//   description: string;
//   availability: string;
//   status?: string;
// }

// const ProductsPage: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchText, setSearchText] = useState('');

//   const [modalVisible, setModalVisible] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
//   const [form] = Form.useForm();

//   const [actionLoading, setActionLoading] = useState(false);
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

//   // Fetch products
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_BASE);
      
//       const mapped = res.data.map((p: any) => ({
//         id: p.id || p.retailer_id,
//         retailer_id: p.retailer_id || p.id?.toString(),
//         name: p.name,
//         price: typeof p.price === 'string' ? parseFloat(p.price) : p.price || 0,
//         currency: p.currency || 'GHS',
//         image_url: p.image_url,
//         description: p.description || '',
//         availability: p.availability || (p.status === 'active' ? 'in stock' : 'out_of_stock'),
//       }));

//       setProducts(mapped);
//       setFilteredProducts(mapped);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to load products');
//       message.error('Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Search
//   useEffect(() => {
//     if (!searchText.trim()) {
//       setFilteredProducts(products);
//       return;
//     }
//     const lower = searchText.toLowerCase().trim();
//     const filtered = products.filter(p =>
//       p.name.toLowerCase().includes(lower) ||
//       p.retailer_id?.toLowerCase().includes(lower) ||
//       p.description?.toLowerCase().includes(lower)
//     );
//     setFilteredProducts(filtered);
//   }, [searchText, products]);

//   const openModal = (product?: Product) => {
//     setIsEdit(!!product);
//     setCurrentProduct(product || null);
//     form.resetFields();
//     setFileList([]);
//     setUploadedImageUrl('');

//     if (product) {
//       form.setFieldsValue({
//         name: product.name,
//         price: product.price,
//         currency: product.currency,
//         description: product.description,
//         availability: product.availability,
//       });

//       if (product.image_url) {
//         setUploadedImageUrl(product.image_url);
//         setFileList([{
//           uid: '-1',
//           name: 'current-image',
//           status: 'done',
//           url: product.image_url,
//         }]);
//       }
//     }

//     setModalVisible(true);
//   };

//   const uploadProps: UploadProps = {
//     name: 'image',
//     multiple: false,
//     maxCount: 1,
//     listType: 'picture-card',
//     fileList,
//     beforeUpload: (file) => {
//       setUploadingImage(true);
//       const formData = new FormData();
//       formData.append('image', file);

//       // Optional: You can create a dedicated image upload endpoint later
//       // For now, image is sent together with product create/update
//       message.info("Image will be uploaded with the product");
//       setFileList([{
//         uid: file.uid,
//         name: file.name,
//         status: 'done',
//         originFileObj: file,
//       }]);
//       setUploadingImage(false);
//       return false;
//     },
//     onRemove: () => {
//       setFileList([]);
//       setUploadedImageUrl('');
//     },
//   };

//   const handleSubmit = async (values: any) => {
//     setActionLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('name', values.name);
//       formData.append('price', values.price.toString());
//       formData.append('currency', values.currency || 'GHS');
//       formData.append('description', values.description || '');
//       formData.append('availability', values.availability || 'in stock');

//       // Append image if selected
//       if (fileList.length > 0 && fileList[0].originFileObj) {
//         formData.append('image', fileList[0].originFileObj as File);
//       }

//       if (isEdit && currentProduct) {
//         const productId = currentProduct.retailer_id || currentProduct.id;
//         await axios.put(`${API_BASE}/${productId}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         message.success('Product updated successfully');
//       } else {
//         await axios.post(API_BASE, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         message.success('Product created successfully');
//       }

//       setModalVisible(false);
//       fetchProducts();
//     } catch (err: any) {
//       message.error(err.response?.data?.message || 'Operation failed');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async (product: Product) => {
//     try {
//       const productId = product.retailer_id || product.id;
//       await axios.delete(`${API_BASE}/${productId}`);
//       message.success('Product deleted successfully');
//       fetchProducts();
//     } catch (err: any) {
//       message.error(err.response?.data?.message || 'Failed to delete product');
//     }
//   };

//   const columns = [
//     {
//       title: 'Image',
//       dataIndex: 'image_url',
//       key: 'image_url',
//       width: 80,
//       render: (url: string) => (
//         <Image
//           src={url || 'https://via.placeholder.com/60?text=No+Image'}
//           alt="product"
//           width={60}
//           preview={false}
//           style={{ borderRadius: 4, objectFit: 'cover' }}
//         />
//       ),
//     },
//     { title: 'Name', dataIndex: 'name', key: 'name' },
//     { title: 'Retailer ID', dataIndex: 'retailer_id', key: 'retailer_id' },
//     {
//       title: 'Price',
//       key: 'price',
//       render: (_: any, record: Product) => `${record.currency} ${Number(record.price).toFixed(2)}`,
//     },
//     { title: 'Availability', dataIndex: 'availability', key: 'availability' },
//     {
//       title: 'Actions',
//       key: 'actions',
//       width: 180,
//       render: (_: any, record: Product) => (
//         <Space size="middle">
//           <Button type="link" icon={<EditOutlined />} onClick={() => openModal(record)}>
//             Edit
//           </Button>
//           <Popconfirm
//             title="Delete Product?"
//             description="This action cannot be undone."
//             onConfirm={() => handleDelete(record)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button type="link" danger icon={<DeleteOutlined />}>
//               Delete
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
//       <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
//         Product Management
//       </Title>

//       <Card
//         title="Products"
//         extra={
//           <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
//             Add New Product
//           </Button>
//         }
//         bordered={false}
//       >
//         <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
//           <Search
//             placeholder="Search by name, retailer ID or description..."
//             allowClear
//             enterButton="Search"
//             size="large"
//             style={{ width: 400 }}
//             onSearch={(value) => setSearchText(value)}
//             onChange={(e) => setSearchText(e.target.value)}
//           />
//         </Space>

//         {loading ? (
//           <div style={{ textAlign: 'center', padding: '100px 0' }}>
//             <Spin size="large" tip="Loading products..." />
//           </div>
//         ) : error ? (
//           <Alert message={error} type="error" showIcon />
//         ) : (
//           <Table
//             columns={columns}
//             dataSource={filteredProducts}
//             rowKey="retailer_id"
//             pagination={{ pageSize: 10 }}
//             scroll={{ x: 'max-content' }}
//           />
//         )}
//       </Card>

//       {/* Create/Edit Modal */}
//       <Modal
//         title={isEdit ? 'Edit Product' : 'Add New Product'}
//         open={modalVisible}
//         onCancel={() => !actionLoading && setModalVisible(false)}
//         footer={null}
//         width={700}
//         maskClosable={!actionLoading}
//       >
//         <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={actionLoading}>
//           <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
//             <Input placeholder="e.g. Wireless Earbuds" />
//           </Form.Item>

//           <Form.Item name="price" label="Price" rules={[{ required: true }]}>
//             <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} addonAfter="GHS" />
//           </Form.Item>

//           <Form.Item name="currency" label="Currency" initialValue="GHS">
//             <Select>
//               <Option value="GHS">GHS</Option>
//               <Option value="USD">USD</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="availability" label="Availability" initialValue="in stock">
//             <Select>
//               <Option value="in stock">In Stock</Option>
//               <Option value="out of stock">Out of Stock</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="description" label="Description">
//             <TextArea rows={4} placeholder="Enter product description..." />
//           </Form.Item>

//           <Form.Item label="Product Image">
//             <Upload {...uploadProps} accept="image/*" disabled={actionLoading || uploadingImage}>
//               <Button icon={<UploadOutlined />} loading={uploadingImage}>
//                 {uploadingImage ? 'Processing...' : 'Upload Image'}
//               </Button>
//             </Upload>
//           </Form.Item>

//           {(uploadedImageUrl || fileList.length > 0) && (
//             <Image
//               src={uploadedImageUrl || (fileList[0]?.url as string)}
//               alt="preview"
//               width={200}
//               style={{ borderRadius: 8, marginTop: 8 }}
//             />
//           )}

//           <div style={{ marginTop: 24, textAlign: 'right' }}>
//             <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
//               Cancel
//             </Button>
//             <Button type="primary" loading={actionLoading} onClick={() => form.submit()}>
//               {isEdit ? 'Update Product' : 'Create Product'}
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export { ProductsPage };
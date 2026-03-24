import React, { useRef, useState } from 'react';
import { Upload, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useStore } from '../store';

interface ProductFormData {
  id: string;
  name: string;
  price: string;
  stock: number;
  status: string;
  image: string;
  specId?: string;
  spec?: string;
  buyerName?: string;
  buyerPhone?: string;
  address?: string;
  orderId?: string;
  orderTime?: string;
}

export default function ProductsPage({ openTab }: { openTab?: (id: string) => void }) {
  const { products, setProducts, orders, setOrders } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    id: '',
    name: '',
    price: '',
    stock: 0,
    status: '上架中',
    image: 'https://picsum.photos/seed/new/40/40'
  });

  const handleImageClick = (id: string) => {
    setEditingProductId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProductId) {
      const imageUrl = URL.createObjectURL(file);
      setProducts(products.map(p => 
        p.id === editingProductId ? { ...p, image: imageUrl } : p
      ));
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setEditingProductId(null);
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setErrorMsg('');
    setFormData({
      id: Math.floor(Math.random() * 1000000).toString(),
      name: '',
      price: '¥ 0.00',
      stock: 0,
      status: '上架中',
      image: 'https://picsum.photos/seed/new/40/40',
      spec: '',
      buyerName: '',
      buyerPhone: '',
      address: '',
      orderId: `S${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}${Math.floor(Math.random() * 10000)}`,
      orderTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (product: any) => {
    setIsEditing(true);
    setErrorMsg('');
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === '上架中' ? '已下架' : '上架中' };
      }
      return p;
    }));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newProducts = [...products];
    const temp = newProducts[index];
    newProducts[index] = newProducts[index - 1];
    newProducts[index - 1] = temp;
    setProducts(newProducts);

    const newOrders = [...orders].sort((a, b) => {
      const indexA = newProducts.findIndex(p => p.id === a.productId);
      const indexB = newProducts.findIndex(p => p.id === b.productId);
      return indexA - indexB;
    });
    setOrders(newOrders);
  };

  const handleMoveDown = (index: number) => {
    if (index === products.length - 1) return;
    const newProducts = [...products];
    const temp = newProducts[index];
    newProducts[index] = newProducts[index + 1];
    newProducts[index + 1] = temp;
    setProducts(newProducts);

    const newOrders = [...orders].sort((a, b) => {
      const indexA = newProducts.findIndex(p => p.id === a.productId);
      const indexB = newProducts.findIndex(p => p.id === b.productId);
      return indexA - indexB;
    });
    setOrders(newOrders);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    if (!val || val === '¥' || val === '¥ ') {
      setFormData({ ...formData, price: '' });
      return;
    }

    let numStr = val.replace(/[^\d.]/g, '');
    
    const parts = numStr.split('.');
    if (parts.length > 2) {
      numStr = parts[0] + '.' + parts.slice(1).join('');
    }
    
    if (numStr.includes('.')) {
      const [whole, decimal] = numStr.split('.');
      numStr = `${whole}.${decimal.slice(0, 2)}`;
    }

    setFormData({ ...formData, price: numStr ? `¥ ${numStr}` : '' });
  };

  const handlePriceBlur = () => {
    let val = formData.price.replace(/[^\d.]/g, '');
    if (val) {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        setFormData({ ...formData, price: `¥ ${num.toFixed(2)}` });
      }
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      setErrorMsg('请填写商品名称和价格');
      return;
    }

    setErrorMsg('');
    if (isEditing) {
      setProducts(products.map(p => p.id === formData.id ? formData : p));
      // Sync with orders: update all orders that have this productId
      setOrders(orders.map(order => {
        if (order.productId === formData.id) {
          return {
            ...order,
            productName: formData.name,
            spec: formData.spec || order.spec,
            image: formData.image || order.image
          };
        }
        return order;
      }));
    } else {
      setProducts([formData, ...products]);
      
      // Sync with orders
      const newOrder = {
        id: formData.orderId || `S${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}${Math.floor(Math.random() * 10000)}`,
        time: formData.orderTime || new Date().toISOString().replace('T', ' ').slice(0, 19),
        source: '商家订单',
        distributor: '杭州奇禄电子商务有限公司',
        address: formData.address || '默认地址',
        image: formData.image,
        buyerName: formData.buyerName || '默认买家',
        buyerPhone: formData.buyerPhone || '13800000000',
        productName: formData.name,
        productId: formData.id,
        spec: formData.spec || '默认规格',
        quantity: 'x 1',
        shippingStatus: '待发货',
        shippingCompany: '',
        shippingNumber: ''
      };
      setOrders([newOrder, ...orders]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">商品管理</h2>
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="flex justify-between mb-4">
          <input type="text" placeholder="搜索商品名称/ID" className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:border-blue-500" />
          <div className="flex gap-2">
            <button 
              onClick={() => openTab && openTab('import-data')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              导入商品
            </button>
            <button 
              onClick={handleAddClick}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              添加商品
            </button>
          </div>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />

        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 text-gray-600 font-medium w-[12%]">商品ID</th>
              <th className="p-3 text-gray-600 font-medium w-[10%]">商品图片</th>
              <th className="p-3 text-gray-600 font-medium w-[25%]">商品名称</th>
              <th className="p-3 text-gray-600 font-medium w-[12%]">规格</th>
              <th className="p-3 text-gray-600 font-medium w-[12%]">价格</th>
              <th className="p-3 text-gray-600 font-medium w-[10%]">状态</th>
              <th className="p-3 text-gray-600 font-medium w-[14%]">操作</th>
              <th className="p-3 text-gray-600 font-medium w-[5%] text-center">排序</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-gray-800">{product.id}</td>
                <td className="p-3">
                  <div 
                    className="relative w-10 h-10 group cursor-pointer"
                    onClick={() => handleImageClick(product.id)}
                    title="点击更换图片"
                  >
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded border border-gray-200" />
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded">
                      <Upload size={16} className="text-white" />
                    </div>
                  </div>
                </td>
                <td className="p-3 text-gray-800">{product.name}</td>
                <td className="p-3 text-gray-800">{product.spec || '-'}</td>
                <td className="p-3 text-gray-800">{product.price}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${product.status === '上架中' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-3 text-blue-500">
                  <span className="cursor-pointer hover:underline" onClick={() => handleEditClick(product)}>编辑</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="cursor-pointer hover:underline" onClick={() => handleToggleStatus(product.id)}>
                    {product.status === '上架中' ? '下架' : '上架'}
                  </span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="cursor-pointer hover:underline text-red-500" onClick={() => setDeleteConfirmId(product.id)}>
                    删除
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-col items-center gap-1">
                    <button 
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
                      title="上移"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button 
                      onClick={() => handleMoveDown(index)}
                      disabled={index === products.length - 1}
                      className={`p-1 rounded ${index === products.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
                      title="下移"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[450px] shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 shrink-0">
              <h3 className="text-lg font-medium text-gray-800">{isEditing ? '编辑商品' : '添加商品'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-3 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品ID</label>
                <input 
                  type="text" 
                  value={formData.id}
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                  disabled={isEditing}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品名称</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                  placeholder="请输入商品名称"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">规格名称</label>
                  <input 
                    type="text" 
                    value={formData.spec || ''}
                    onChange={(e) => setFormData({...formData, spec: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    placeholder="请输入规格名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">价格</label>
                  <input 
                    type="text" 
                    value={formData.price}
                    onChange={handlePriceChange}
                    onBlur={handlePriceBlur}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    placeholder="例如: ¥ 99.00"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-1">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">订单号</label>
                    <input 
                      type="text" 
                      value={formData.orderId || ''}
                      onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                      placeholder="请输入订单号"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">下单时间</label>
                    <input 
                      type="datetime-local" 
                      value={formData.orderTime ? formData.orderTime.replace(' ', 'T') : ''}
                      onChange={(e) => setFormData({...formData, orderTime: e.target.value.replace('T', ' ')})}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">收货人姓名</label>
                    <input 
                      type="text" 
                      value={formData.buyerName || ''}
                      onChange={(e) => setFormData({...formData, buyerName: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                      placeholder="请输入收货人姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">收货人手机号</label>
                    <input 
                      type="text" 
                      value={formData.buyerPhone || ''}
                      onChange={(e) => setFormData({...formData, buyerPhone: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                      placeholder="请输入手机号"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">收货地址</label>
                  <input 
                    type="text" 
                    value={formData.address || ''}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    placeholder="请输入收货地址"
                  />
                </div>
              </div>
              
              <div className="pt-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">商品图片</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 border border-gray-300 rounded overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs">无图片</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      id="modal-image-upload"
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const imageUrl = URL.createObjectURL(file);
                          setFormData({...formData, image: imageUrl});
                        }
                      }} 
                    />
                    <label 
                      htmlFor="modal-image-upload"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Upload size={14} />
                      选择图片
                    </label>
                    <p className="text-xs text-gray-500 mt-1">支持 jpg, png, gif 格式</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-between items-center shrink-0">
              <div className="text-red-500 text-sm">
                {errorMsg}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[400px] shadow-xl p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">确认删除</h3>
            <p className="text-gray-600 mb-6">确定要删除该商品吗？删除后订单列表中的相关商品内容也会被同步删除。</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setProducts(products.filter(p => p.id !== deleteConfirmId));
                  setOrders(orders.filter(o => o.productId !== deleteConfirmId));
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, FileSpreadsheet } from 'lucide-react';
import { useStore } from '../store';

export default function OrdersPage({ openTab }: { openTab: (id: string) => void }) {
  const { orders } = useStore();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  
  const [searchType, setSearchType] = useState('订单编号');
  const [searchText, setSearchText] = useState('');
  const [productIdFilter, setProductIdFilter] = useState('');
  const [productNameFilter, setProductNameFilter] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('全部');
  
  const [displayOrders, setDisplayOrders] = useState(orders);

  const handleSearch = () => {
    let filtered = orders;

    // Basic search
    if (searchText) {
      if (searchType === '订单编号') {
        filtered = filtered.filter(o => o.id.includes(searchText));
      } else if (searchType === '收货人姓名') {
        filtered = filtered.filter(o => o.buyerName.includes(searchText));
      } else if (searchType === '收货人手机号') {
        filtered = filtered.filter(o => o.buyerPhone.includes(searchText));
      }
    }

    // Product ID filter
    if (productIdFilter) {
      const ids = productIdFilter.split(',').map(id => id.trim());
      filtered = filtered.filter(o => ids.includes(o.productId));
    }

    // Product Name filter
    if (productNameFilter) {
      filtered = filtered.filter(o => o.productName.includes(productNameFilter));
    }

    // Order Status filter
    if (orderStatusFilter !== '全部') {
      filtered = filtered.filter(o => o.shippingStatus === orderStatusFilter);
    }

    setDisplayOrders(filtered);
  };

  const handleReset = () => {
    setSearchText('');
    setProductIdFilter('');
    setProductNameFilter('');
    setOrderStatusFilter('全部');
    setDisplayOrders(orders);
  };

  // Update display orders when store orders change
  React.useEffect(() => {
    setDisplayOrders(orders);
  }, [orders]);

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      {/* Filters Card */}
      <div className="bg-white p-5 rounded-sm shadow-sm mb-4 text-sm">
        {/* Basic Filters */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="flex items-center col-span-2">
            <label className="w-20 text-right mr-2 text-gray-600">订单搜索:</label>
            <div className="flex flex-1">
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-32 border border-gray-300 border-r-0 rounded-l px-2 py-1.5 focus:outline-none focus:border-blue-500 bg-gray-50"
              >
                <option>订单编号</option>
                <option>收货人姓名</option>
                <option>收货人手机号</option>
              </select>
              <input 
                type="text" 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="请输入搜索内容" 
                className="flex-1 border border-gray-300 rounded-r px-2 py-1.5 focus:outline-none focus:border-blue-500" 
              />
            </div>
            <a href="#" className="text-blue-500 ml-2 whitespace-nowrap hover:underline">批量输入订单</a>
          </div>
        </div>

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="flex items-center col-span-2">
                <label className="w-20 text-right mr-2 text-gray-600">下单时间:</label>
                <div className="flex items-center flex-1 gap-2">
                  <input type="datetime-local" defaultValue="2026-03-01T00:00" className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 text-gray-600" />
                  <span className="text-gray-500">至</span>
                  <input type="datetime-local" defaultValue="2026-03-08T23:59" className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 text-gray-600" />
                </div>
              </div>
              <div className="flex items-center col-span-2 gap-1">
                {['今', '昨', '近7天', '近30天', '近三个月', '近半年', '近一年'].map(t => (
                  <button key={t} className="border border-gray-300 px-2 py-1 rounded text-gray-600 hover:text-blue-500 hover:border-blue-500 bg-white transition-colors">{t}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="flex items-center col-span-2">
                <label className="w-20 text-right mr-2 text-gray-600">时间类型:</label>
                <div className="flex flex-1 gap-2 items-center">
                  <select className="w-32 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500">
                    <option>发货时间</option>
                    <option>付款时间</option>
                    <option>完成时间</option>
                  </select>
                  <input type="date" className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 text-gray-400" placeholder="开始日期" />
                  <span className="text-gray-500">至</span>
                  <input type="date" className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 text-gray-400" placeholder="结束日期" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="flex items-center">
                <label className="w-20 text-right mr-2 text-gray-600">商品ID:</label>
                <input 
                  type="text" 
                  value={productIdFilter}
                  onChange={(e) => setProductIdFilter(e.target.value)}
                  placeholder="多个商品ID,英文逗号隔开" 
                  className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div className="flex items-center">
                <label className="w-20 text-right mr-2 text-gray-600">商品名称:</label>
                <input 
                  type="text" 
                  value={productNameFilter}
                  onChange={(e) => setProductNameFilter(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div className="flex items-center">
                <label className="w-20 text-right mr-2 text-gray-600">分销商:</label>
                <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 text-gray-400">
                  <option>请输入分销商名称/简称</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="flex items-center">
                <label className="w-20 text-right mr-2 text-gray-600">订单状态:</label>
                <select 
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
                >
                  <option>全部</option>
                  <option>待付款</option>
                  <option>待发货</option>
                  <option>已发货</option>
                  <option>已完成</option>
                  <option>已关闭</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-20 text-right mr-2 text-gray-600">维权状态:</label>
                <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500">
                  <option>无售后</option>
                  <option>售后处理中</option>
                  <option>退款完成</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-20 text-right mr-2 text-gray-600">发货信息:</label>
                <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500">
                  <option>全部</option>
                  <option>未发货</option>
                  <option>部分发货</option>
                  <option>已发货</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="flex items-center col-span-2">
                <label className="w-20 text-right mr-2 text-gray-600">收货地址:</label>
                <div className="flex flex-1 gap-2">
                  <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"><option>不限</option></select>
                  <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"><option>不限</option></select>
                  <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"><option>不限</option></select>
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-20 text-right mr-2 text-gray-600">订单来源:</label>
                <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500">
                  <option>全部</option>
                  <option>商家订单</option>
                  <option>分销订单</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center pl-22 mt-2">
          <button 
            onClick={handleSearch}
            className="bg-[#1890ff] hover:bg-blue-600 text-white px-6 py-1.5 rounded flex items-center gap-1 transition-colors"
          >
            <Search size={16} /> 查询
          </button>
          <button 
            onClick={handleReset}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-1.5 rounded flex items-center gap-1 ml-3 hover:text-blue-500 hover:border-blue-500 transition-colors"
          >
            重置
          </button>
          <button 
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} 
            className="text-blue-500 ml-4 flex items-center gap-1 hover:underline"
          >
            {isAdvancedOpen ? <>收起 <ChevronUp size={16}/></> : <>展开 <ChevronDown size={16}/></>}
          </button>
        </div>
      </div>

      {/* Table Actions */}
      <div className="flex items-center mb-4 text-sm">
        <button onClick={() => openTab('stock-export')} className="bg-white border border-blue-500 text-blue-500 px-4 py-1.5 rounded-sm hover:bg-blue-50 mr-2 transition-colors">备货并导出</button>
        <button onClick={() => openTab('cancel-stock')} className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-sm hover:text-blue-500 hover:border-blue-500 mr-2 transition-colors">取消备货</button>
        <button onClick={() => openTab('export-orders')} className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-sm hover:text-blue-500 hover:border-blue-500 mr-4 transition-colors">导出订单</button>
        <a href="#" className="text-blue-500 hover:underline mr-auto">查看导出记录</a>
      </div>

      {/* Order Table */}
      <div className="bg-white border border-gray-200 text-sm">
        {/* Table Header */}
        <div className="grid grid-cols-[minmax(460px,3.6fr)_repeat(7,minmax(100px,1fr))] bg-gray-50 border-b border-gray-200 text-gray-600 py-3 font-medium">
          <div className="pl-12 flex items-center gap-2"><input type="checkbox" className="rounded border-gray-300" /> 全选 商品</div>
          <div className="text-center">数量</div>
          <div className="text-center">发货信息</div>
          <div className="text-center">卖家/收货人</div>
          <div className="text-center">运费</div>
          <div className="text-center">配送方式</div>
          <div className="text-center">订单状态</div>
          <div className="text-center">操作</div>
        </div>

        {/* Order Items */}
        {displayOrders.map((order) => (
          <div key={order.id} className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
            {/* Order Header Info */}
            <div className="bg-[#f9f9f9] border-b border-gray-200 p-3 text-xs text-gray-600 flex justify-between items-start">
              <div className="space-y-1.5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="font-medium text-gray-800">订单号: {order.id}</span>
                  </div>
                  <span>下单时间: {order.time}</span>
                </div>
                <div className="flex items-center gap-6 pl-6">
                  <span>订单来源: {order.source}</span>
                  <span>分销商: {order.distributor}</span>
                  <span>收货地址: {order.address}</span>
                </div>
              </div>
              <div className="text-blue-500 cursor-pointer hover:underline">复制 - 备注</div>
            </div>

            {/* Order Content */}
            <div className="grid grid-cols-[minmax(460px,3.6fr)_repeat(7,minmax(100px,1fr))] items-stretch">
              {/* Product */}
              <div className="py-6 pl-12 pr-4 flex gap-6">
                <img src={order.image} alt="product" className="w-16 h-16 object-cover border border-gray-200 rounded" />
                <div className="text-xs flex-1">
                  <div className="text-gray-800 leading-relaxed">
                    {order.productName}
                  </div>
                  <div className="text-gray-500 mt-1">ID: {order.productId}</div>
                  <div className="text-gray-500">规格: {order.spec}</div>
                </div>
              </div>
              
              <div className="py-6 px-4 flex items-center justify-center border-l border-gray-100">{order.quantity}</div>
              
              <div className="py-6 px-4 flex flex-col items-center justify-center border-l border-gray-100 text-xs text-center">
                <span className="text-gray-800 mb-1">{order.shippingStatus}</span>
                {order.shippingCompany && (
                  <span className="text-blue-500 hover:underline cursor-pointer">
                    {order.shippingCompany}:<br/>{order.shippingNumber}
                  </span>
                )}
              </div>
              
              <div className="py-6 px-4 flex flex-col items-center justify-center border-l border-gray-100 text-xs text-center">
                <span className="text-gray-800 mb-1">{order.buyerPhone}</span>
                <span className="text-gray-800">{order.buyerName}</span>
              </div>
              
              <div className="py-6 px-4 flex items-center justify-center border-l border-gray-100">0</div>
              <div className="py-6 px-4 flex items-center justify-center border-l border-gray-100">快递</div>
              <div className="py-6 px-4 flex items-center justify-center border-l border-gray-100">{order.shippingStatus}</div>
              <div className="py-6 px-4 flex flex-col items-center justify-center border-l border-gray-100 gap-2">
                <a href="#" className="text-blue-500 hover:underline text-xs">修改物流</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 bg-white p-3 border border-gray-200 rounded-sm">
        <button className="bg-[#93c5fd] text-white px-4 py-1.5 rounded-sm text-sm hover:bg-blue-400 transition-colors">订单批量备注</button>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>共 {displayOrders.length} 条</span>
          <select className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500">
            <option>30条/页</option>
            <option>50条/页</option>
            <option>100条/页</option>
          </select>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-gray-50 text-gray-400 cursor-not-allowed">&lt;</button>
            {[1, 2, 3, 4, 5].map(page => (
              <button 
                key={page} 
                className={`w-8 h-8 flex items-center justify-center border rounded transition-colors ${
                  page === 1 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : 'border-gray-300 bg-white hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:border-blue-500 hover:text-blue-500 transition-colors">&gt;</button>
          </div>
          <div className="flex items-center gap-2">
            <span>前往</span>
            <input type="text" defaultValue="1" className="w-10 border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:border-blue-500" />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  );
}

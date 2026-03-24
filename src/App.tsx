/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home, Package, FileText, Settings, Users, Menu, X, Tag, Award, Wallet, LayoutGrid, LogOut, User as UserIcon, ChevronDown, Bell, Mail, Search as SearchIcon } from 'lucide-react';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import OrdersPage from './components/OrdersPage';
import StockExportPage from './components/StockExportPage';
import CancelStockPage from './components/CancelStockPage';
import ExportOrdersPage from './components/ExportOrdersPage';
import ImportDataPage from './components/ImportDataPage';
import { StoreProvider } from './store';

type TabId = string;

interface Tab {
  id: TabId;
  title: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [openTabs, setOpenTabs] = useState<Tab[]>([
    { id: 'home', title: '首页' },
    { id: 'products', title: '商品管理' },
    { id: 'orders', title: '订单列表' }
  ]);

  const handleTabClick = (id: TabId) => {
    setActiveTab(id);
    if (!openTabs.find(t => t.id === id)) {
      const titles: Record<string, string> = {
        home: '首页',
        products: '商品管理',
        orders: '订单列表',
        'stock-export': '备货并导出',
        'cancel-stock': '取消备货',
        'export-orders': '导出订单',
        'import-data': '数据表格导入'
      };
      setOpenTabs([...openTabs, { id, title: titles[id] || '新标签页' }]);
    }
  };

  const closeTab = (e: React.MouseEvent, id: TabId) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t.id !== id);
    setOpenTabs(newTabs);
    if (activeTab === id) {
      setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : 'home');
    }
  };

  return (
    <StoreProvider>
      <div className="flex h-screen bg-gray-100 font-sans">
        {/* Sidebar */}
        <div className="w-[84px] bg-[#0c0c14] flex flex-col items-center py-4 text-gray-400">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
            <Tag className="text-[#0c0c14]" size={30} />
          </div>
          <div className="w-full border-t border-white/5 mb-4"></div>
          
          <div className="flex flex-col gap-4 w-full">
            <button 
              onClick={() => handleTabClick('home')}
              className={`w-full flex justify-center py-3 transition-colors ${
                activeTab === 'home'
                  ? 'text-white bg-white/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home size={30} />
            </button>
            <button 
              className="w-full flex justify-center py-3 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Award size={30} />
            </button>
            <button 
              onClick={() => handleTabClick('products')}
              className={`w-full flex justify-center py-3 transition-colors ${
                activeTab === 'products'
                  ? 'text-white bg-white/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Package size={30} />
            </button>
            <button 
              onClick={() => handleTabClick('orders')}
              className={`w-full flex justify-center py-3 transition-colors ${
                activeTab === 'orders'
                  ? 'text-white bg-white/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText size={30} />
            </button>
            <button 
              className="w-full flex justify-center py-3 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Users size={30} />
            </button>
            <button 
              className="w-full flex justify-center py-3 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Wallet size={30} />
            </button>
            <button 
              className="w-full flex justify-center py-3 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LayoutGrid size={30} />
            </button>
            <button 
              className="w-full flex justify-center py-3 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Settings size={30} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer mr-2">
                <Menu size={20} className="text-gray-500" />
              </div>
              <span className="cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleTabClick('home')}>首页</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleTabClick('orders')}>订单</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-gray-900 font-medium">订单列表</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Bar in Header */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
                <SearchIcon size={16} className="text-gray-400" />
                <input type="text" placeholder="搜索功能..." className="bg-transparent border-none focus:outline-none text-xs ml-2 w-40" />
              </div>

              {/* Utility Icons */}
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                  <Mail size={20} />
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 relative group cursor-pointer pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                <div className="relative">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-8 h-8 rounded-full bg-blue-100 border border-gray-200" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs font-bold text-gray-800">管理员</span>
                  <span className="text-[10px] text-gray-500">超级管理员</span>
                </div>
                <div className="p-1 bg-gray-50 rounded ml-1">
                  <Menu size={14} className="text-gray-500" />
                </div>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-10 h-10 rounded-full bg-blue-100" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">管理员</div>
                      <div className="text-xs text-gray-500">wapzpf@gmail.com</div>
                    </div>
                  </div>
                  <div className="py-2">
                    <div className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">个人中心</div>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <UserIcon size={16} className="text-gray-400" /> 个人资料
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Settings size={16} className="text-gray-400" /> 系统设置
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Wallet size={16} className="text-gray-400" /> 财务管理
                    </a>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button 
                      onClick={() => {
                        setIsLoggedIn(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> 退出登录
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Tabs */}
          <div className="flex bg-white border-b border-gray-200 px-4 pt-2 gap-1 shrink-0">
            {openTabs.map(tab => (
              <div 
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer border border-b-0 rounded-t-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-[#e6f7ff] text-[#1890ff] border-[#91d5ff]' 
                    : 'bg-white text-gray-600 border-transparent hover:bg-gray-50'
                }`}
              >
                {tab.title}
                {tab.id !== 'home' && (
                  <X 
                    size={14} 
                    className={`hover:bg-black/10 rounded-full p-0.5 transition-colors ${activeTab === tab.id ? 'text-[#1890ff]' : 'text-gray-400'}`}
                    onClick={(e) => closeTab(e, tab.id)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-[#f0f2f5]">
            {activeTab === 'home' && <OrdersPage openTab={handleTabClick} />}
            {activeTab === 'products' && <ProductsPage openTab={handleTabClick} />}
            {activeTab === 'orders' && <OrdersPage openTab={handleTabClick} />}
            {activeTab === 'stock-export' && <StockExportPage />}
            {activeTab === 'cancel-stock' && <CancelStockPage />}
            {activeTab === 'export-orders' && <ExportOrdersPage />}
            {activeTab === 'import-data' && <ImportDataPage />}
          </main>
        </div>
      </div>

      {/* Simulated Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Tag className="text-white" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">欢迎回来</h2>
              <p className="text-center text-gray-500 mb-8">请输入您的账号信息以登录系统</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">账号</label>
                  <input 
                    type="text" 
                    defaultValue="admin"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="请输入账号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                  <input 
                    type="password" 
                    defaultValue="••••••••"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="请输入密码"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    <span className="text-gray-600">记住我</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:underline">忘记密码?</a>
                </div>
                <button 
                  onClick={() => {
                    setIsLoggedIn(true);
                    setShowLoginModal(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
                >
                  立即登录
                </button>
              </div>
              
              <div className="mt-8 text-center text-sm text-gray-500">
                没有账号? <a href="#" className="text-blue-600 font-medium hover:underline">联系管理员开通</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </StoreProvider>
  );
}

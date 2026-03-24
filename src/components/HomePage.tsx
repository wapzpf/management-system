import React from 'react';
import { TrendingUp, ShoppingBag, Clock, AlertCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">首页概览</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm mb-1">今日订单数</div>
            <div className="text-3xl font-bold text-gray-800">152</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <ShoppingBag className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm mb-1">今日销售额</div>
            <div className="text-3xl font-bold text-gray-800">¥ 34,290.00</div>
          </div>
          <div className="bg-green-50 p-3 rounded-full">
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm mb-1">待发货订单</div>
            <div className="text-3xl font-bold text-gray-800">28</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-full">
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm mb-1">维权中订单</div>
            <div className="text-3xl font-bold text-gray-800">3</div>
          </div>
          <div className="bg-red-50 p-3 rounded-full">
            <AlertCircle className="text-red-500" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}

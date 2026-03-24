import React from 'react';
import { PackageX } from 'lucide-react';

export default function CancelStockPage() {
  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-sm shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <PackageX className="text-gray-700" size={24} />
          <h2 className="text-lg font-medium text-gray-800">取消备货</h2>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded text-sm text-yellow-700 mb-6">
          警告：取消备货后，订单将回退到“待备货”状态。如果仓库已经开始处理，请先与仓库确认。
        </div>

        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center">
            <label className="w-24 text-right mr-4 text-gray-600">操作范围:</label>
            <select className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
              <option>仅取消选中的订单 (0 条)</option>
              <option>按当前筛选条件取消</option>
            </select>
          </div>
          
          <div className="flex items-start">
            <label className="w-24 text-right mr-4 text-gray-600 mt-2">取消原因:</label>
            <textarea 
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 h-24"
              placeholder="请输入取消备货的原因（选填）"
            ></textarea>
          </div>

          <div className="flex items-start mt-6 pt-6 border-t">
            <div className="w-24 mr-4"></div>
            <div className="flex gap-4">
              <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors">确认取消备货</button>
              <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded hover:bg-gray-50 transition-colors">返回</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

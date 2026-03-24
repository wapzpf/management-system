import React from 'react';
import { PackageCheck } from 'lucide-react';

export default function StockExportPage() {
  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-sm shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <PackageCheck className="text-blue-500" size={24} />
          <h2 className="text-lg font-medium text-gray-800">备货并导出</h2>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 p-4 rounded text-sm text-blue-700 mb-6">
          提示：此操作将把选中的订单状态标记为“已备货”，并生成包含详细商品信息的Excel表格供仓库使用。
        </div>

        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center">
            <label className="w-24 text-right mr-4 text-gray-600">导出范围:</label>
            <select className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
              <option>按当前筛选条件导出 (共 20 条)</option>
              <option>仅导出选中的订单 (0 条)</option>
              <option>导出全部待发货订单</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="w-24 text-right mr-4 text-gray-600">模板选择:</label>
            <select className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
              <option>默认备货单模板</option>
              <option>精简版备货单</option>
              <option>含商品条码模板</option>
            </select>
          </div>

          <div className="flex items-start mt-6 pt-6 border-t">
            <div className="w-24 mr-4"></div>
            <div className="flex gap-4">
              <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">确认备货并导出</button>
              <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded hover:bg-gray-50 transition-colors">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

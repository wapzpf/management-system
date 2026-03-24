import React, { useState } from 'react';
import { Download } from 'lucide-react';

// 模拟商品数据库
const KNOWN_PRODUCTS: Record<string, string> = {
  '429309': '学而思学习机12.35寸',
  '429310': '学而思学习机10.4寸',
  '429311': '学而思智能护眼台灯',
  '429312': '学而思错题打印机',
  '429313': '学而思点读笔Pro',
  '429314': '学而思儿童电话手表',
  '429315': '学而思智能词典笔',
  '429316': '学而思早教启蒙机',
  '429317': '学而思编程机器人',
  '429318': '学而思专注力训练仪'
};

const EXPORT_FIELDS = ['订单号', '商品名称', '商品ID', '规格', '单价', '数量', '实付金额', '收货人', '手机号', '收货地址', '物流公司', '物流单号', '下单时间', '付款时间', '订单状态'];

export default function ExportOrdersPage() {
  const [selectedFields, setSelectedFields] = useState<string[]>(EXPORT_FIELDS);
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx');

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleExport = () => {
    // 根据选中的字段生成表头
    const headers = EXPORT_FIELDS.filter(field => selectedFields.includes(field));
    
    // 生成模拟数据
    const sampleRows = Object.entries(KNOWN_PRODUCTS).map(([id, name], index) => {
      const rowData: Record<string, string> = {
        '订单号': `ORD20260318${String(index + 1).padStart(3, '0')}`,
        '商品名称': name,
        '商品ID': id,
        '规格': '默认规格',
        '单价': '199.00',
        '数量': '1',
        '实付金额': '199.00',
        '收货人': `测试用户${index + 1}`,
        '手机号': `1380013800${index}`,
        '收货地址': `北京市海淀区中关村大街${index + 1}号`,
        '物流公司': '顺丰速运',
        '物流单号': `SF100000000${index}`,
        '下单时间': `2026-03-18 10:00:0${index}`,
        '付款时间': `2026-03-18 10:05:0${index}`,
        '订单状态': '已发货'
      };
      
      // 只提取选中的字段数据
      return headers.map(header => rowData[header]).join(',');
    });
    
    const csvContent = '\uFEFF' + headers.join(',') + '\n' + sampleRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `订单导出_${new Date().getTime()}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-sm shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <Download className="text-green-500" size={24} />
          <h2 className="text-lg font-medium text-gray-800">导出订单</h2>
        </div>

        <div className="space-y-6 max-w-3xl">
          <div className="flex items-start">
            <label className="w-24 text-right mr-4 text-gray-600 mt-2">导出字段:</label>
            <div className="flex-1 grid grid-cols-3 gap-3">
              {EXPORT_FIELDS.map(field => (
                <label key={field} className="flex items-center gap-2 text-sm text-gray-700">
                  <input 
                    type="checkbox" 
                    checked={selectedFields.includes(field)}
                    onChange={() => handleFieldToggle(field)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" 
                  />
                  {field}
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="w-24 text-right mr-4 text-gray-600">文件格式:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input 
                  type="radio" 
                  name="format" 
                  checked={format === 'xlsx'}
                  onChange={() => setFormat('xlsx')}
                  className="text-blue-500 focus:ring-blue-500" 
                /> Excel (.xlsx)
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input 
                  type="radio" 
                  name="format" 
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                  className="text-blue-500 focus:ring-blue-500" 
                /> CSV (.csv)
              </label>
            </div>
          </div>

          <div className="flex items-start mt-6 pt-6 border-t">
            <div className="w-24 mr-4"></div>
            <div className="flex gap-4">
              <button 
                onClick={handleExport}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                生成导出文件
              </button>
              <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded hover:bg-gray-50 transition-colors">查看导出记录</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

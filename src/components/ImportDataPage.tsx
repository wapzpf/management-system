import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useStore } from '../store';

export default function ImportDataPage() {
  const { products, setProducts, setOrders } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedData, setImportedData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [matchStats, setMatchStats] = useState({ total: 0, matched: 0, unmatched: 0 });

  const handleDownloadTemplate = (e: React.MouseEvent) => {
    e.preventDefault();
    const templateHeaders = [
      '收件人(必填)', 
      '手机号(必填)', 
      '收货地址(必填)', 
      '商品ID(非必填)', 
      '订单号(非必填)', 
      '商品名称(非必填)', 
      '规格(非必填)', 
      '价格(非必填)',
      '库存(非必填)',
      '状态(非必填)',
      '商品数量(非必填)'
    ];
    
    const sampleData = [
      ['艾博', '18641038501', '辽宁省铁岭市开原市翰林风景小区21号', '429309', 'S20260308285986959220721', '学而思学习机12.35寸', '学而思T4P (不带键盘)', '¥ 3499.00', 999, '上架中', 1],
      ['刘蔚', '18640869592', '辽宁省大连市甘井子区凌水街道普罗旺', '429310', 'S20260309285986929487163', '学而思学习机10.4寸', '学而思旗舰12', '¥ 2499.00', 500, '上架中', 1],
      ['唐光平', '15054114488', '山东省日照市东港区凯莱社区百昌花园', '429311', 'S20260309285959741826072', '学而思智能护眼台灯', '学而思T4', '¥ 399.00', 1200, '上架中', 1]
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet([templateHeaders, ...sampleData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "导入模板");
    
    XLSX.writeFile(workbook, "商品导入模板.xlsx");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus('idle');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Convert sheet to JSON array of arrays
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        
        if (data.length > 0) {
          const parsedHeaders = data[0] as string[];
          const rows = data.slice(1).filter(row => row.length > 0);
          
          const recipientIndex = parsedHeaders.findIndex(h => h.includes('收件人'));
          const phoneIndex = parsedHeaders.findIndex(h => h.includes('手机号'));
          const addressIndex = parsedHeaders.findIndex(h => h.includes('收货地址'));
          const idIndex = parsedHeaders.findIndex(h => h === 'ID' || h.includes('ID') || h.includes('商品ID'));
          const orderIdIndex = parsedHeaders.findIndex(h => h.includes('订单号'));
          const productInfoIndex = parsedHeaders.findIndex(h => h.includes('商品名称') || h.includes('商品信息'));
          const specIndex = parsedHeaders.findIndex(h => h.includes('规格'));
          const priceIndex = parsedHeaders.findIndex(h => h.includes('价格'));
          const stockIndex = parsedHeaders.findIndex(h => h.includes('库存'));
          const statusIndex = parsedHeaders.findIndex(h => h.includes('状态'));
          const quantityIndex = parsedHeaders.findIndex(h => h.includes('商品数量'));
          
          let matchedCount = 0;
          let unmatchedCount = 0;
          
          const newProducts: any[] = [];
          const newOrders: any[] = [];

          const processedRows = rows.map(row => {
            // Ensure row has same length as headers
            const newRow = [...row];
            while (newRow.length < parsedHeaders.length) newRow.push('');

            const productName = productInfoIndex !== -1 ? String(newRow[productInfoIndex] || '').trim() : '';
            const productId = idIndex !== -1 && newRow[idIndex] ? String(newRow[idIndex]).trim() : '';
            const spec = specIndex !== -1 ? String(newRow[specIndex] || '').trim() : '';
            const price = priceIndex !== -1 && newRow[priceIndex] ? String(newRow[priceIndex]).trim() : '';
            const stock = stockIndex !== -1 && newRow[stockIndex] ? Number(newRow[stockIndex]) : NaN;
            const status = statusIndex !== -1 && newRow[statusIndex] ? String(newRow[statusIndex]).trim() : '';
            const quantity = quantityIndex !== -1 && newRow[quantityIndex] ? String(newRow[quantityIndex]).trim() : '1';

            const recipient = recipientIndex !== -1 ? String(newRow[recipientIndex] || '').trim() : '';
            const phone = phoneIndex !== -1 ? String(newRow[phoneIndex] || '').trim() : '';
            const address = addressIndex !== -1 ? String(newRow[addressIndex] || '').trim() : '';

            // If we have ANY information (product or order), we create BOTH to keep counts equal
            if (productId || productName || recipient || phone || address) {
              const finalProductId = productId || `PRD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
              const finalProductName = productName || '未命名商品';
              const finalOrderId = orderIdIndex !== -1 && newRow[orderIdIndex] ? String(newRow[orderIdIndex]).trim() : `IMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

              newProducts.push({
                id: finalProductId,
                name: finalProductName,
                image: 'https://picsum.photos/seed/new/40/40',
                price: price || '¥ 0.00',
                stock: isNaN(stock) ? 999 : stock,
                status: status || '上架中',
                spec: spec
              });

              newOrders.push({
                id: finalOrderId,
                time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
                source: '表格导入',
                distributor: '手动导入',
                address: address || '默认地址',
                image: 'https://picsum.photos/seed/new/60/60',
                buyerName: recipient || '默认买家',
                buyerPhone: phone || '13800000000',
                productName: finalProductName,
                productId: finalProductId,
                spec: spec || '默认规格',
                quantity: `x ${quantity}`,
                shippingStatus: '待发货',
                shippingCompany: '',
                shippingNumber: ''
              });

              matchedCount++;
              return { data: newRow, isMatched: true };
            }

            unmatchedCount++;
            return { data: newRow, isMatched: false };
          });

          setHeaders(parsedHeaders);
          setImportedData(processedRows);
          setMatchStats({
            total: rows.length,
            matched: matchedCount,
            unmatched: unmatchedCount
          });
          setImportStatus('success');
          
          // Add to global store
          if (newProducts.length > 0) {
            // Deduplicate new data by productId to maintain 1:1 relationship
            const uniqueNewPairs = new Map();
            newProducts.forEach((p, index) => {
              uniqueNewPairs.set(p.id, { product: p, order: newOrders[index] });
            });

            setProducts(prev => {
              const updatedPrev = prev.map(p => {
                if (uniqueNewPairs.has(p.id)) {
                  const { product } = uniqueNewPairs.get(p.id);
                  return {
                    ...p,
                    ...product,
                    image: p.image // Preserve existing image
                  };
                }
                return p;
              });

              const trulyNew = Array.from(uniqueNewPairs.values())
                .filter(pair => !prev.some(p => p.id === pair.product.id))
                .map(pair => pair.product);
              
              return [...trulyNew, ...updatedPrev];
            });

            setOrders(prev => {
              const updatedPrev = prev.map(order => {
                if (uniqueNewPairs.has(order.productId)) {
                  const { product, order: importedOrder } = uniqueNewPairs.get(order.productId);
                  // Update the order with both product info and imported order info
                  return {
                    ...order,
                    ...importedOrder,
                    productName: product.name,
                    spec: product.spec || order.spec,
                    // Preserve order image if it's not the default one
                    image: order.image && !order.image.includes('picsum.photos/seed/new') ? order.image : importedOrder.image
                  };
                }
                return order;
              });

              const trulyNew = Array.from(uniqueNewPairs.values())
                .filter(pair => !prev.some(o => o.productId === pair.product.id))
                .map(pair => pair.order);

              return [...trulyNew, ...updatedPrev];
            });
          }
        } else {
          setImportStatus('error');
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        setImportStatus('error');
      } finally {
        setIsImporting(false);
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <FileSpreadsheet className="text-blue-500" size={24} />
          <h2 className="text-lg font-medium text-gray-800">商品数据表格导入</h2>
        </div>
        
        <div className="flex gap-6">
          <div className="flex-1">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
              onChange={handleFileChange} 
            />
            
            <div 
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${isImporting ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'}`}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Upload className="text-blue-500" size={32} />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {isImporting ? '正在处理文件...' : '点击或拖拽文件到此处上传'}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                支持 .csv, .xls, .xlsx 格式文件，单次最多导入 10000 条数据
              </p>
              <button 
                onClick={handleUploadClick}
                disabled={isImporting}
                className={`px-6 py-2 rounded-sm text-white transition-colors ${isImporting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                选择文件
              </button>
            </div>
          </div>
          
          <div className="w-80 bg-gray-50 p-5 rounded-sm border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-500" />
              导入说明
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
              <li>请先下载标准导入模板，按照模板格式填写数据。</li>
              <li>收件人、手机号和收货地址为必填项。</li>
              <li>商品ID、订单号、商品名称、规格、价格、库存、状态为非必填。</li>
              <li>商品数量请填写数字，如：1。</li>
              <li>导入成功后，商品信息将同步更新到商品管理页面，订单将同步到订单列表。</li>
              <li>数据将自动保存，刷新页面不会丢失。</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <a 
                href="#" 
                onClick={handleDownloadTemplate}
                className="text-blue-500 hover:underline text-sm flex items-center gap-1"
              >
                <FileSpreadsheet size={16} />
                下载商品导入模板
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Import Results */}
      {importStatus !== 'idle' && (
        <div className="bg-white p-6 rounded-sm shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">导入结果</h3>
          
          {importStatus === 'success' ? (
            <>
              <div className="flex items-center gap-6 mb-6 bg-green-50 p-4 rounded-sm border border-green-100">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 size={20} />
                  <span className="font-medium">解析成功</span>
                </div>
                <div className="text-sm text-gray-600 flex gap-4">
                  <span>总行数: <strong className="text-gray-800">{matchStats.total}</strong></span>
                  <span>成功导入商品: <strong className="text-green-600">{matchStats.matched}</strong></span>
                  <span>无效数据: <strong className="text-red-500">{matchStats.unmatched}</strong></span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-y border-gray-200">
                      <th className="p-3 text-gray-600 font-medium w-16 text-center">状态</th>
                      {headers.map((header, i) => (
                        <th key={i} className="p-3 text-gray-600 font-medium">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importedData.slice(0, 100).map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-center">
                          {row.isMatched ? (
                            <CheckCircle2 size={16} className="text-green-500 mx-auto" />
                          ) : (
                            <XCircle size={16} className="text-red-400 mx-auto" />
                          )}
                        </td>
                        {row.data.map((cell: any, j: number) => (
                          <td key={j} className="p-3 text-gray-800 truncate max-w-[200px]" title={String(cell)}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importedData.length > 100 && (
                  <div className="text-center py-4 text-gray-500 text-sm border-t border-gray-100">
                    仅显示前 100 条数据
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-sm border border-red-100">
              <XCircle size={20} />
              <span>文件解析失败，请检查文件格式是否正确。</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

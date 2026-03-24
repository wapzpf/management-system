import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Product {
  id: string;
  image: string;
  name: string;
  price: string;
  stock: number;
  status: string;
  spec?: string;
}

export interface Order {
  id: string;
  time: string;
  source: string;
  distributor: string;
  address: string;
  image: string;
  buyerName: string;
  buyerPhone: string;
  productName: string;
  productId: string;
  spec: string;
  quantity: string;
  shippingStatus: string;
  shippingCompany: string;
  shippingNumber: string;
}

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

const INITIAL_PRODUCTS: Product[] = [
  { id: '429313', image: 'https://picsum.photos/seed/tech4/40/40', name: '学而思点读笔Pro', price: '¥ 499.00', stock: 300, status: '已下架' },
  { id: '429314', image: 'https://picsum.photos/seed/tech5/40/40', name: '学而思儿童电话手表', price: '¥ 599.00', stock: 600, status: '上架中' },
  { id: '429315', image: 'https://picsum.photos/seed/tech6/40/40', name: '学而思智能词典笔', price: '¥ 699.00', stock: 450, status: '上架中' },
  { id: '429316', image: 'https://picsum.photos/seed/tech7/40/40', name: '学而思早教启蒙机', price: '¥ 199.00', stock: 2000, status: '上架中' },
  { id: '429317', image: 'https://picsum.photos/seed/tech8/40/40', name: '学而思编程机器人', price: '¥ 899.00', stock: 150, status: '上架中' },
  { id: '429318', image: 'https://picsum.photos/seed/tech9/40/40', name: '学而思专注力训练仪', price: '¥ 799.00', stock: 280, status: '上架中' },
  { id: '429319', image: 'https://picsum.photos/seed/tech10/40/40', name: '学而思智能练习本', price: '¥ 1299.00', stock: 400, status: '上架中' },
  { id: '429320', image: 'https://picsum.photos/seed/tech11/40/40', name: '学而思AR地球仪', price: '¥ 299.00', stock: 1500, status: '上架中' },
  { id: '429321', image: 'https://picsum.photos/seed/tech12/40/40', name: '学而思口算宝', price: '¥ 159.00', stock: 3000, status: '上架中' },
  { id: '429322', image: 'https://picsum.photos/seed/tech13/40/40', name: '学而思智能书包', price: '¥ 399.00', stock: 800, status: '上架中' },
  { id: '429323', image: 'https://picsum.photos/seed/tech14/40/40', name: '学而思智能护眼灯', price: '¥ 299.00', stock: 1200, status: '上架中' },
  { id: '429324', image: 'https://picsum.photos/seed/tech15/40/40', name: '学而思智能纠错本', price: '¥ 89.00', stock: 5000, status: '上架中' },
  { id: '429325', image: 'https://picsum.photos/seed/tech16/40/40', name: '学而思智能听力机', price: '¥ 359.00', stock: 900, status: '上架中' },
  { id: '429326', image: 'https://picsum.photos/seed/tech17/40/40', name: '学而思智能写字板', price: '¥ 199.00', stock: 1500, status: '上架中' },
  { id: '429327', image: 'https://picsum.photos/seed/tech18/40/40', name: '学而思智能显微镜', price: '¥ 599.00', stock: 300, status: '上架中' },
  { id: '429328', image: 'https://picsum.photos/seed/tech19/40/40', name: '学而思智能望远镜', price: '¥ 799.00', stock: 250, status: '上架中' },
  { id: '429329', image: 'https://picsum.photos/seed/tech20/40/40', name: '学而思智能地球仪Pro', price: '¥ 499.00', stock: 600, status: '上架中' },
  { id: '429330', image: 'https://picsum.photos/seed/tech21/40/40', name: '学而思智能计算器', price: '¥ 129.00', stock: 2000, status: '上架中' },
  { id: '429331', image: 'https://picsum.photos/seed/tech22/40/40', name: '学而思智能翻译机', price: '¥ 899.00', stock: 400, status: '上架中' },
  { id: '429332', image: 'https://picsum.photos/seed/tech23/40/40', name: '学而思智能学习桌', price: '¥ 2599.00', stock: 100, status: '上架中' },
  { id: '429333', image: 'https://picsum.photos/seed/tech24/40/40', name: '学而思智能学习椅', price: '¥ 1299.00', stock: 150, status: '上架中' },
  { id: '429334', image: 'https://picsum.photos/seed/tech25/40/40', name: '学而思智能录音笔', price: '¥ 399.00', stock: 700, status: '上架中' },
  { id: '429335', image: 'https://picsum.photos/seed/tech26/40/40', name: '学而思智能投影仪', price: '¥ 1999.00', stock: 200, status: '上架中' },
  { id: '429336', image: 'https://picsum.photos/seed/tech27/40/40', name: '学而思智能音箱', price: '¥ 299.00', stock: 1000, status: '上架中' },
  { id: '429337', image: 'https://picsum.photos/seed/tech28/40/40', name: '学而思智能闹钟', price: '¥ 99.00', stock: 3000, status: '上架中' },
  { id: '429338', image: 'https://picsum.photos/seed/tech29/40/40', name: '学而思智能水杯', price: '¥ 159.00', stock: 1500, status: '上架中' },
  { id: '429339', image: 'https://picsum.photos/seed/tech30/40/40', name: '学而思智能跳绳', price: '¥ 129.00', stock: 2500, status: '上架中' },
  { id: '429340', image: 'https://picsum.photos/seed/tech31/40/40', name: '学而思智能握力器', price: '¥ 79.00', stock: 4000, status: '上架中' },
  { id: '429341', image: 'https://picsum.photos/seed/tech32/40/40', name: '学而思智能体脂秤', price: '¥ 199.00', stock: 800, status: '上架中' },
  { id: '429342', image: 'https://picsum.photos/seed/tech33/40/40', name: '学而思智能按摩仪', price: '¥ 399.00', stock: 500, status: '上架中' }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'S20260308164533992018375',
    time: '2026-03-08 16:45:33',
    source: '分销订单',
    distributor: '上海优学网络科技',
    address: '上海市浦东新区张江高科技园区, 祖冲之路2277号',
    image: 'https://picsum.photos/seed/tech4/60/60',
    buyerName: '赵女士',
    buyerPhone: '13655443322',
    productName: '【学而思点读笔Pro】英语启蒙 绘本点读',
    productId: '429313',
    spec: '英语启蒙款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260309081244558829106',
    time: '2026-03-09 08:12:44',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '江苏省南京市建邺区江东中路347号, 国金中心一期',
    image: 'https://picsum.photos/seed/tech5/60/60',
    buyerName: '陈先生',
    buyerPhone: '15011223344',
    productName: '【学而思儿童电话手表】4G全网通 视频通话',
    productId: '429314',
    spec: '4G全网通款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260309112055667788907',
    time: '2026-03-09 11:20:55',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '四川省成都市武侯区天府大道北段1700号, 环球中心',
    image: 'https://picsum.photos/seed/tech6/60/60',
    buyerName: '刘女士',
    buyerPhone: '18899887766',
    productName: '【学而思智能词典笔】扫描翻译 语音查词',
    productId: '429315',
    spec: '扫描翻译款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '圆通速递',
    shippingNumber: 'YT10000000001'
  },
  {
    id: 'S20260310093011223344508',
    time: '2026-03-10 09:30:11',
    source: '分销订单',
    distributor: '广州市启明教育',
    address: '广东省广州市天河区珠江东路6号, 广州周大福金融中心',
    image: 'https://picsum.photos/seed/tech7/60/60',
    buyerName: '黄先生',
    buyerPhone: '18655667788',
    productName: '【学而思早教启蒙机】儿歌故事 英语启蒙',
    productId: '429316',
    spec: '儿歌故事款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '韵达快递',
    shippingNumber: 'YD10000000001'
  },
  {
    id: 'S20260310154022334455609',
    time: '2026-03-10 15:40:22',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '湖北省武汉市洪山区珞喻路1037号, 华中科技大学',
    image: 'https://picsum.photos/seed/tech8/60/60',
    buyerName: '周女士',
    buyerPhone: '15988776655',
    productName: '【学而思编程机器人】图形化编程 益智玩具',
    productId: '429317',
    spec: '图形化编程款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260311105033445566711',
    time: '2026-03-11 10:50:33',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '陕西省西安市雁塔区丈八沟街道, 锦业路1号',
    image: 'https://picsum.photos/seed/tech9/60/60',
    buyerName: '吴先生',
    buyerPhone: '13566778899',
    productName: '【学而思专注力训练仪】脑波反馈 提升专注',
    productId: '429318',
    spec: '脑波反馈款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '极兔速递',
    shippingNumber: 'JT10000000001'
  },
  {
    id: 'S20260312091544112233445',
    time: '2026-03-12 09:15:44',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '浙江省宁波市海曙区中山西路, 鼓楼大厦',
    image: 'https://picsum.photos/seed/tech10/60/60',
    buyerName: '孙女士',
    buyerPhone: '13311223344',
    productName: '【学而思智能练习本】护眼墨水屏 智能批改',
    productId: '429319',
    spec: '墨水屏款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260312142055223344556',
    time: '2026-03-12 14:20:55',
    source: '分销订单',
    distributor: '深圳博学教育',
    address: '广东省深圳市福田区深南大道, 汉国中心',
    image: 'https://picsum.photos/seed/tech11/60/60',
    buyerName: '郑先生',
    buyerPhone: '13222334455',
    productName: '【学而思AR地球仪】3D互动 趣味百科',
    productId: '429320',
    spec: 'AR互动款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '申通快递',
    shippingNumber: 'ST10000000001'
  },
  {
    id: 'S20260313084511334455667',
    time: '2026-03-13 08:45:11',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '福建省厦门市思明区软件园二期, 观日路',
    image: 'https://picsum.photos/seed/tech12/60/60',
    buyerName: '冯女士',
    buyerPhone: '13133445566',
    productName: '【学而思口算宝】智能出题 秒批纠错',
    productId: '429321',
    spec: '智能出题款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '天天快递',
    shippingNumber: 'TT10000000001'
  },
  {
    id: 'S20260313163022445566778',
    time: '2026-03-13 16:30:22',
    source: '分销订单',
    distributor: '成都锦程教育',
    address: '四川省成都市高新区锦城大道, 奥克斯广场',
    image: 'https://picsum.photos/seed/tech13/60/60',
    buyerName: '沈先生',
    buyerPhone: '13044556677',
    productName: '【学而思智能书包】人体工学 护脊减负',
    productId: '429322',
    spec: '护脊减负款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260314080000111111111',
    time: '2026-03-14 08:00:00',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '北京市海淀区中关村大街, 搜狐网络大厦',
    image: 'https://picsum.photos/seed/tech14/60/60',
    buyerName: '王先生',
    buyerPhone: '13911223344',
    productName: '【学而思智能护眼灯】国AA级 智能感光',
    productId: '429323',
    spec: '国AA级款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260314103000222222222',
    time: '2026-03-14 10:30:00',
    source: '分销订单',
    distributor: '上海优学网络科技',
    address: '上海市静安区南京西路, 恒隆广场',
    image: 'https://picsum.photos/seed/tech15/60/60',
    buyerName: '李女士',
    buyerPhone: '13811223344',
    productName: '【学而思智能纠错本】错题打印 智能分析',
    productId: '429324',
    spec: '智能分析款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '中通快递',
    shippingNumber: 'ZT10000000001'
  },
  {
    id: 'S20260315091500333333333',
    time: '2026-03-15 09:15:00',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '浙江省杭州市西湖区文三路, 东方通信大厦',
    image: 'https://picsum.photos/seed/tech16/60/60',
    buyerName: '张先生',
    buyerPhone: '13711223344',
    productName: '【学而思智能听力机】复读跟读 纯净听力',
    productId: '429325',
    spec: '纯净听力款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260315144500444444444',
    time: '2026-03-15 14:45:00',
    source: '分销订单',
    distributor: '广州市启明教育',
    address: '广东省广州市越秀区中山五路, 中旅商业城',
    image: 'https://picsum.photos/seed/tech17/60/60',
    buyerName: '刘先生',
    buyerPhone: '13611223344',
    productName: '【学而思智能写字板】压感书写 一键清除',
    productId: '429326',
    spec: '压感书写款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '顺丰速运',
    shippingNumber: 'SF10000000001'
  },
  {
    id: 'S20260316082000555555555',
    time: '2026-03-16 08:20:00',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '江苏省苏州市工业园区, 现代大道',
    image: 'https://picsum.photos/seed/tech18/60/60',
    buyerName: '陈女士',
    buyerPhone: '13511223344',
    productName: '【学而思智能显微镜】高清成像 手机互联',
    productId: '429327',
    spec: '高清成像款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260316161000666666666',
    time: '2026-03-16 16:10:00',
    source: '分销订单',
    distributor: '深圳博学教育',
    address: '广东省深圳市南山区科苑路, 讯美科技广场',
    image: 'https://picsum.photos/seed/tech19/60/60',
    buyerName: '杨先生',
    buyerPhone: '13411223344',
    productName: '【学而思智能望远镜】星空观测 自动寻星',
    productId: '429328',
    spec: '自动寻星款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '德邦快递',
    shippingNumber: 'DB10000000001'
  },
  {
    id: 'S20260317094000777777777',
    time: '2026-03-17 09:40:00',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '四川省成都市青羊区人民中路, 泰丰大厦',
    image: 'https://picsum.photos/seed/tech20/60/60',
    buyerName: '赵先生',
    buyerPhone: '13311223344',
    productName: '【学而思智能地球仪Pro】语音交互 知识问答',
    productId: '429329',
    spec: '语音交互款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260317152500888888888',
    time: '2026-03-17 15:25:00',
    source: '分销订单',
    distributor: '成都锦程教育',
    address: '四川省成都市金牛区一环路, 龙湖上城',
    image: 'https://picsum.photos/seed/tech21/60/60',
    buyerName: '周先生',
    buyerPhone: '13211223344',
    productName: '【学而思智能计算器】函数运算 智能纠错',
    productId: '429330',
    spec: '函数运算款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '百世快递',
    shippingNumber: 'BS10000000001'
  },
  {
    id: 'S20260318085500999999999',
    time: '2026-03-18 08:55:00',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '湖北省武汉市江汉区建设大道, 招银大厦',
    image: 'https://picsum.photos/seed/tech22/60/60',
    buyerName: '吴女士',
    buyerPhone: '13111223344',
    productName: '【学而思智能翻译机】多语种翻译 离线可用',
    productId: '429331',
    spec: '多语种翻译款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260318141500101010101',
    time: '2026-03-18 14:15:00',
    source: '分销订单',
    distributor: '上海优学网络科技',
    address: '上海市徐汇区虹桥路, 港汇恒隆广场',
    image: 'https://picsum.photos/seed/tech23/60/60',
    buyerName: '孙先生',
    buyerPhone: '13011223344',
    productName: '【学而思智能学习桌】电动升降 护眼桌面',
    productId: '429332',
    spec: '电动升降款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '安能物流',
    shippingNumber: 'AN10000000001'
  },
  {
    id: 'S20260319090500111111112',
    time: '2026-03-19 09:05:00',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '浙江省杭州市滨江区网商路, 阿里巴巴园区',
    image: 'https://picsum.photos/seed/tech24/60/60',
    buyerName: '冯先生',
    buyerPhone: '13922334455',
    productName: '【学而思智能学习椅】人体工学 动态护脊',
    productId: '429333',
    spec: '动态护脊款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260319153500121212121',
    time: '2026-03-19 15:35:00',
    source: '分销订单',
    distributor: '广州市启明教育',
    address: '广东省广州市海珠区新港中路, 丽影广场',
    image: 'https://picsum.photos/seed/tech25/60/60',
    buyerName: '沈女士',
    buyerPhone: '13822334455',
    productName: '【学而思智能录音笔】高清降噪 实时转写',
    productId: '429334',
    spec: '实时转写款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '优速快递',
    shippingNumber: 'US10000000001'
  },
  {
    id: 'S20260320084000131313131',
    time: '2026-03-20 08:40:00',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '江苏省南京市玄武区中山东路, 德基广场',
    image: 'https://picsum.photos/seed/tech26/60/60',
    buyerName: '韩先生',
    buyerPhone: '13722334455',
    productName: '【学而思智能投影仪】护眼光源 智能对焦',
    productId: '429335',
    spec: '护眼光源款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260320162000141414141',
    time: '2026-03-20 16:20:00',
    source: '分销订单',
    distributor: '深圳博学教育',
    address: '广东省深圳市龙岗区龙翔大道, 万科广场',
    image: 'https://picsum.photos/seed/tech27/60/60',
    buyerName: '朱女士',
    buyerPhone: '13622334455',
    productName: '【学而思智能音箱】智能助手 优质音效',
    productId: '429336',
    spec: '智能助手款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '宅急送',
    shippingNumber: 'ZJS10000000001'
  },
  {
    id: 'S20260321095000151515151',
    time: '2026-03-21 09:50:00',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '四川省成都市成华区二环路, 万象城',
    image: 'https://picsum.photos/seed/tech28/60/60',
    buyerName: '秦先生',
    buyerPhone: '13522334455',
    productName: '【学而思智能闹钟】语音提醒 睡眠监测',
    productId: '429337',
    spec: '语音提醒款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260321141000161616161',
    time: '2026-03-21 14:10:00',
    source: '分销订单',
    distributor: '成都锦程教育',
    address: '四川省成都市双流区天府五街, 银泰城',
    image: 'https://picsum.photos/seed/tech29/60/60',
    buyerName: '尤女士',
    buyerPhone: '13422334455',
    productName: '【学而思智能水杯】定时提醒 水质监测',
    productId: '429338',
    spec: '定时提醒款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '全峰快递',
    shippingNumber: 'QF10000000001'
  },
  {
    id: 'S20260322083000171717171',
    time: '2026-03-22 08:30:00',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '湖北省武汉市硚口区京汉大道, 恒隆广场',
    image: 'https://picsum.photos/seed/tech30/60/60',
    buyerName: '许先生',
    buyerPhone: '13322334455',
    productName: '【学而思智能跳绳】计数精准 蓝牙连接',
    productId: '429339',
    spec: '计数精准款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260322155500181818181',
    time: '2026-03-22 15:55:00',
    source: '分销订单',
    distributor: '上海优学网络科技',
    address: '上海市长宁区长宁路, 龙之梦购物中心',
    image: 'https://picsum.photos/seed/tech31/60/60',
    buyerName: '何女士',
    buyerPhone: '13222334455',
    productName: '【学而思智能握力器】力量训练 数据同步',
    productId: '429340',
    spec: '力量训练款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '快捷快递',
    shippingNumber: 'KJ10000000001'
  },
  {
    id: 'S20260323092000191919191',
    time: '2026-03-23 09:20:00',
    source: '商家订单',
    distributor: '杭州奇禄电子商务有限公司',
    address: '浙江省杭州市下城区延安路, 嘉里中心',
    image: 'https://picsum.photos/seed/tech32/60/60',
    buyerName: '吕先生',
    buyerPhone: '13122334455',
    productName: '【学而思智能体脂秤】精准测量 身体分析',
    productId: '429341',
    spec: '身体分析款...',
    quantity: 'x 1',
    shippingStatus: '待发货',
    shippingCompany: '',
    shippingNumber: ''
  },
  {
    id: 'S20260323164000202020202',
    time: '2026-03-23 16:40:00',
    source: '分销订单',
    distributor: '广州市启明教育',
    address: '广东省广州市白云区云城东路, 万达广场',
    image: 'https://picsum.photos/seed/tech33/60/60',
    buyerName: '施女士',
    buyerPhone: '13022334455',
    productName: '【学而思智能按摩仪】缓解疲劳 多档调节',
    productId: '429342',
    spec: '缓解疲劳款...',
    quantity: 'x 1',
    shippingStatus: '已发货',
    shippingCompany: '跨越速运',
    shippingNumber: 'KY10000000001'
  }
];

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    const initial = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    // Filter out deleted products and ensure we have at least the initial 30
    const filtered = initial.filter((p: Product) => !['429309', '429310', '429311', '429312'].includes(p.id));
    if (filtered.length < 30) {
      const existingIds = new Set(filtered.map((p: Product) => p.id));
      const missing = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
      return [...filtered, ...missing].slice(0, 30);
    }
    return filtered;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    const initial = saved ? JSON.parse(saved) : INITIAL_ORDERS;
    // Filter out deleted orders and ensure we have at least the initial 30
    const filtered = initial.filter((o: Order) => !['429309', '429310', '429311', '429312'].includes(o.productId));
    if (filtered.length < 30) {
      const existingIds = new Set(filtered.map((o: Order) => o.id));
      const missing = INITIAL_ORDERS.filter(o => !existingIds.has(o.id));
      return [...filtered, ...missing].slice(0, 30);
    }
    return filtered;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  return (
    <StoreContext.Provider value={{ products, setProducts, orders, setOrders }}>
      {children}
    </StoreContext.Provider>
  );
};

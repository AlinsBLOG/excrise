const ApiRootUrl = 'https://alpha-mall.7linkshop.com/';
const uploadUrl = 'https://platform.i51c.com/';

module.exports = {
  getCheckCode: ApiRootUrl + 'um/api/user/applyChecknum', //获取验证码
  register: ApiRootUrl + 'um/api/user/register', //注册
  login: ApiRootUrl + 'um/api/user/loginByAccount', //登陆
  userInfo: ApiRootUrl + 'um/api/user/info', //用户信息 userId
  getInqueryList: ApiRootUrl + 'req/api/require/search', //询价大厅 tenantId
  getInqueryDetail: ApiRootUrl + 'req/api/require/detail', //询价详情 id
  getInqueryDetailItem: ApiRootUrl + 'req/api/require/items', //报价详情 reqId providerId
  getInqueryDetailItemOffer: ApiRootUrl + 'req/api/require/itemOffer', //询价单详情 reqId
  userProvider: ApiRootUrl + 'pvm/api/provider/userProvider', //查看认证用户 userId
  authorize: ApiRootUrl + 'pvm/pvProviderApply/save', //认证
  uploadFile: uploadUrl + 'dcs/api/fc/fileUpload?applyCode=image',
  offerSave: ApiRootUrl + 'req/api/offer/save', //提交报价
  publishP: ApiRootUrl + 'req/api/require/save', //发布询价
  list2: ApiRootUrl + 'req/reqGroup/list2', //品质范围
  getProdModel: ApiRootUrl + 'pm/pmProdModel/list2', //适用机型
  getCategory: ApiRootUrl + 'pm/pmCategory/list2', //配件
  getsearchOfferReq: ApiRootUrl + 'req/api/require/searchOfferReq', //获取我的报价单
  getsearch: ApiRootUrl + 'req/api/require/search', //获取我的询价单
  getUser: ApiRootUrl + 'pvm/api/provider/providerUser', //员工管理
  delUser: ApiRootUrl + 'pvm/pvProviderAuth/deleteOne', //删除员工
  findUser: ApiRootUrl + 'um/api/user/find', //查找员工
  addUser: ApiRootUrl + 'pvm/pvProviderAuth/addStaff', //添加员工
  modifyUser: ApiRootUrl +'um/api/user/modProfile', //修改用户
  confirm: ApiRootUrl + 'req/api/offer/confirm', //提交报价
  providerInfo: ApiRootUrl + 'pvm/api/provider/info', //服务商信息
  getCode: ApiRootUrl + "sm/sysDistrict/getAreaByName", //获取地区code
  getBanner: ApiRootUrl + 'cfg/api/banner', //获取首页banner

  getAllClass: ApiRootUrl + 'pm/api/category/nav', //获取全部分类
  getProduct: ApiRootUrl + 'pm/api/product/search', //获取产品列表
  getNavTop: ApiRootUrl + 'pm/api/category/navTop', //获取首页一级分类
  getCfgGroup: ApiRootUrl + 'cfg/api/group/list', //获取分组项
  getCfgFloor: ApiRootUrl + 'cfg/api/floor/list', //获取分层项
  getProductDetail: ApiRootUrl + 'pm/api/product/detail', //获取产品详情
  getProdSku: ApiRootUrl + 'pm/api/product/prodSku', //获取产品规格
  getOrder: ApiRootUrl + 'om/subOrder/list2', //订单列表

  getApplyInfo: ApiRootUrl + 'pvm/api/provider/applyInfo', //获取服务商资料

  getQuery: ApiRootUrl + 'req/reqRequireItem/query', //获取需求项 reqId
  
  getqueryInfo: ApiRootUrl + 'req/api/require/info', 
};
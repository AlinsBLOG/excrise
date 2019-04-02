// const ApiRootUrl = 'https://test.7linkshop.com/mall-portal/';
const ApiRootUrl = 'http://www.i51c.com/mall-portal/';
// const ApiRootUrl = 'http://local.7linkshop.com:8070/mall-portal/';
// const CfgRootUrl = 'http://www.i51c.com/cfg/';
const CfgRootUrl = 'http://rap2api.taobao.org';

module.exports = {
  IndexUrl: ApiRootUrl + 'index.json', //首页数据
  CatalogList: ApiRootUrl + 'prodCategory/list',  //全部目录分类
  GoodsDetail: ApiRootUrl + 'detail/',  //获得服务详情
  ProviderDetails: ApiRootUrl + 'provider/',  //获得服务商详情
  Login: ApiRootUrl + 'authorize/loginByUNP',  //登录
  QueryServeListByProvider: ApiRootUrl + 'product/queryByProviderMoreInfo/', //查询服务商下面的服务
  CatalogCurrent: ApiRootUrl + 'catalog/current',  //分类目录当前分类数据接口
  AuthLoginByWeixin: ApiRootUrl + 'auth/loginByWeixin', //微信登录
  ServiceArea: ApiRootUrl + 'product/',
  CartAdd: ApiRootUrl + 'cart/', // 添加商品到购物车
  buyerList: ApiRootUrl + 'buyer/', //查询指定用户下的买家信息
  ForgetPasswordGetCode: ApiRootUrl + 'sys/checknum/applyWithCheck/',  //忘记密码申请验证码
  ForgetPasswordNext: ApiRootUrl + 'sys/checknum/verify/',  //忘记密码点击下一步
  ForgetPasswordCertion: ApiRootUrl + 'account/resetPassword',  //忘记密码确认修改
  QueryOrderList: ApiRootUrl + 'subsOrder/',  //获取指定用户的订单列表
  QueryServeList: ApiRootUrl + 'serviceOrder/',  //获取指定用户的服务单列表
  OrderDetail: ApiRootUrl + 'subsOrder/',  //订单详情
  ServeConfirm: ApiRootUrl + 'serviceOrder/', //补充付款前确认
  CancelOrder: ApiRootUrl + 'subsOrder/',      //取消订单
  CartList: ApiRootUrl + 'cart/', //获取购物车的数据
  RemoveCartList: ApiRootUrl + 'cart/', //移出购物车的数据
  UpdataCartList: ApiRootUrl + 'cart/', //更新购物车的数据
  IsAccountExists: ApiRootUrl + 'account/isAccountExists/', //检测手机号码是否已注册
  RegisterCode: ApiRootUrl + 'sys/checknum/applyWithoutCheck/', //发送注册验证码
  Register: ApiRootUrl + 'account/registerWithMNC', //注册帐号
  CheckPrice: ApiRootUrl + 'product/',  //查询指定规格商品的下单金额
  DirectlyPrepare: ApiRootUrl + 'subsOrder/',  //立即购买
  ApplyAuthen: ApiRootUrl + 'platform/',
  Prepare: ApiRootUrl + "subsOrder/",
  BrandList: ApiRootUrl + 'brand/list',  //品牌列表
  BrandDetail: ApiRootUrl + 'prodCategory/',  //查询指定商品归类的详细信息
  GoodsList: ApiRootUrl + 'product/queryByCategory/',  //按条件查询归类目录下的服务商品
  CommonServe: ApiRootUrl + 'prodCategory/common',  //常用服务
  HotProvider: ApiRootUrl + 'index/hotProvider',  //热门服务商
  Advertisement: CfgRootUrl + '/app/mock/22199/api/advertisement/query'
};
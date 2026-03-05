import ArticleRoute from './ArticleRouter'
import AuthRoute from './AuthRouter'
import AppCheckRoute from './AppCheckRouter'
import MarketRouter from './MarketRouter'
import MyProfileRoute from './MyProfileRouter'
import NewsRoute from './NewsRouter'
import ChatRoute from './ChatRouter'
import ScreenerRoute from './ScreenerRouter'
import UploadRoute from './UploadRouter'
import UserRoute from './UserRouter'
import LogRoute from './LogRouter'
import StatsRoute from './StatsRouter'
import SubscriptionRoute from './SubscriptionRouter'
import WeaviateRoute from './WeaviateRouter'

const RoutesRegistry = {
  AppCheckRoute,
  ArticleRoute,
  AuthRoute,
  MyProfileRoute,
  NewsRoute,
  MarketRouter,
  ChatRoute,
  ScreenerRoute,
  UploadRoute,
  UserRoute,
  LogRoute,
  StatsRoute,
  SubscriptionRoute,
  WeaviateRoute
}

export default RoutesRegistry

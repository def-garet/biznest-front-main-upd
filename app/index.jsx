import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './Biznest'
import CustomerLogin from './customerlogin';
import { AuthProvider } from '../auth/AuthContext';
import CustomerSignup from './CustomerSignup';
import { ProductDetails,Setting,ProductByCategory, Profile, MyCart, UserLike, Notifications, Checkout, Chat,SellerChat, Chatbot} from '../screens';
import { MyAddress,EditProfile, PurchaseHistory, CustomerService, OrderTracking } from '../screens/settings';
import { StartSelling, SellerDashboard, SellerOrderManagement, ProductManagement, SalesReports, SellerTradeManagementScreen } from '../screens/SellerSide';
import { ChatConversation,SellerChatConversation } from '../screens/HomeScreen/component';
import SplashScreen from './SplashScreen';
import { TradeScreen, TradeOffer, TradeConfirmationScreen,AvailableTradesScreen } from '../screens/Trading';
import { ViewShop, AllProducts, } from '../screens/ShopSide';
import { SearchResults } from '../screens/SearchComponents';
import { DinagyangProducts } from '../screens/SeasonalCompenents';


const Stack = createStackNavigator();

export default function App({linking}) {
  return (
    <AuthProvider>


      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown:false}} />
        <Stack.Screen name="Home" component={TabNavigator}  options={{ headerShown: false}}  />     
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{headerShown:false}} />
        <Stack.Screen name="CustomerLogin" component={CustomerLogin}  options={{ headerShown: false}} />
        <Stack.Screen name="CustomerSignup" component={CustomerSignup} options={{headerShown:false}} />
        <Stack.Screen name="ProductByCategory" component={ProductByCategory} options={{headerShown:false}} />
        <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}} />
        <Stack.Screen name="Setting" component={Setting} options={{headerShown:false}} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown:false}} />
        <Stack.Screen name="MyCart" component={MyCart} options={{headerShown:false}} />
        <Stack.Screen name="MyAddress" component={MyAddress} options={{headerShown:false}} />
        <Stack.Screen name="StartSelling" component={StartSelling} options={{headerShown:false}} />
        <Stack.Screen name="UserLike" component={UserLike} options={{headerShown:false}} />
        <Stack.Screen name="Notifications" component={Notifications} options={{headerShown:false}} />
        <Stack.Screen name="Checkout" component={Checkout} options={{headerShown:false}} />
        <Stack.Screen name="SellerDashboard" component={SellerDashboard} options={{headerShown:false}} />
        <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} options={{headerShown:false}} />
        <Stack.Screen name="Chat" component={Chat} options={{headerShown:false}} />
        <Stack.Screen name="SellerChat" component={SellerChat} options={{headerShown:false}} />
        <Stack.Screen name="ChatConversation" component={ChatConversation} options={{headerShown:false}} />
        <Stack.Screen name="SellerChatConversation" component={SellerChatConversation} options={{headerShown:false}} />
        <Stack.Screen name="SellerOrderManagement" component={SellerOrderManagement} options={{headerShown:false}} />
        <Stack.Screen name="ProductManagement" component={ProductManagement} options={{headerShown:false}} />
        <Stack.Screen name="SalesReports" component={SalesReports} options={{headerShown:false}} />
        <Stack.Screen name="TradeScreen" component={TradeScreen} options={{headerShown:false}} />
        <Stack.Screen name="TradeOffer" component={TradeOffer} options={{headerShown:false}} />
        <Stack.Screen name="CustomerService" component={CustomerService} options={{headerShown:false}} />
        <Stack.Screen name="OrderTracking" component={OrderTracking} options={{headerShown:false}} />
        <Stack.Screen name="ViewShop" component={ViewShop} options={{headerShown:false}} />
        <Stack.Screen name="SearchResults" component={SearchResults} options={{headerShown:false}} />
        <Stack.Screen name="DinagyangProducts" component={DinagyangProducts} options={{headerShown:false}} />
        <Stack.Screen name="Chatbot" component={Chatbot} options={{headerShown:false}} /> 
        <Stack.Screen name="AllProducts" component={AllProducts} options={{headerShown:false}} />
        <Stack.Screen name="TradeConfirmationScreen" component={TradeConfirmationScreen} options={{headerShown:false}} />
        <Stack.Screen name="SellerTradeManagementScreen" component={SellerTradeManagementScreen} options={{headerShown:false}} />
        <Stack.Screen name="AvailableTradesScreen" component={AvailableTradesScreen} options={{headerShown:false}} />        
      </Stack.Navigator>

    </AuthProvider>
   
  );
}

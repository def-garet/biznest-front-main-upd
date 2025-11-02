import React,{useState,useContext,useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../auth/AuthContext';
import API_URL  from '../api/api_urls';
import { COLORS } from '../style/theme';

const API = API_URL + "/api/v1/Register%20Buyer/buyer_register"


const CustomerSignup = () => {
  const navigation = useNavigation();
  const {customerRegister}=useContext(AuthContext)
  const [fName,setFname]=useState("");
  const [lName,setLname]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [rePassword,setReEPassword]=useState("");
  const [tokenRegistration,setTokenRegistration]=useState(null);
  
  const [reEnterPass,setReEnterPass]=useState(false);
  const [showPass, setShowPass] =useState(false);

  const register= async()=>{
    const result= await customerRegister(fName,lName,email,password,rePassword,tokenRegistration);
    if (result){
      alert(result.success)
    }
  }
  
  useEffect(() => {
       Regisrationtoken();
        }, []);
    
        const Regisrationtoken = async () => {
            try {
                const response = await fetch(API);
                const data = await response.json();
                setTokenRegistration(data.registerToken);                
              } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name={"arrow-undo-outline"}
              color={"white"}
              size={30}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.text}>Sign Up</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.push('index')}>
          <Ionicons
            name={"help-circle-outline"}
            color={"white"}
            size={30}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* LOGO */}
        <View style={styles.LogoContainer}>
          <Image source={require("../assets/imgs/biznest-new.png")} style={styles.logo} />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons
              name={"person-outline"}
              size={25}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Full Name'
              value={fName}
              onChangeText={f_name=>setFname(f_name)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name={"person-outline"}
              size={25}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Full Name'
              value={lName}
              onChangeText={l_name=>setLname(l_name)}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons
              name={"mail-outline"}
              size={25}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Email Address'
              value={email}
              onChangeText={email=>setEmail(email)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name={"lock-closed-outline"}
              size={25}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Password'
              secureTextEntry={!showPass}
              value={password}
              onChangeText={pass=>setPassword(pass)}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeIcon}>
              <Ionicons
                name={showPass ? "eye-outline" : "eye-off-outline"}
                size={20}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name={"lock-closed-outline"}
              size={25}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Enter Password'
              secureTextEntry={!reEnterPass}
              value={reEnterPass}
              onChangeText={repass=>setReEPassword(repass)}
            />
             <TouchableOpacity onPress={() => setReEnterPass(!reEnterPass)} style={styles.eyeIcon}>
              <Ionicons
                name={reEnterPass ? "eye-outline" : "eye-off-outline"}
                size={20}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View>
            <TouchableOpacity style={styles.signupButton} onPress={()=>{register()}}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue with */}
        <View>
          <Text style={styles.contWith}>━━━━━━ Or continue with ━━━━━━</Text>
        </View>

        {/* Icons */}
        <View style={styles.appIconContainer}>
          <TouchableOpacity>
            <Image source={require("../assets/imgs/facebook.png")} style={styles.appIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../assets/imgs/google.png")} style={styles.appIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../assets/imgs/apple-logo.png")} style={styles.appIcon} />
          </TouchableOpacity>
        </View>

        {/* Already have an account? */}
        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginTouch}> Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomerSignup;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20, // Ensure there's some bottom padding for scrolling
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8,
  },
  logo: {
    height: 250,
    width: 225,
    marginVertical: -10,
  },
  LogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 10,
    paddingVertical: 5,
  },
  textInput: {
    color: "black",
    flex: 1,
    paddingHorizontal: 10,
  },
  separator: {
    height: 0,  // Reduce height to fix the visual issue
    width: '100%',
    backgroundColor: 'transparent',
    marginVertical: 10,
  },
  signupButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginVertical: 10,
  },
  signupText: {
    color:'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contWith: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
  },
  appIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 15,
  },
  appIcon: {
    width:40,
    height: 40,
    resizeMode: 'contain',
  },
  loginTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 20,
  },
  loginTouch: {
    fontSize: 20,
    fontWeight: 'bold',
    // textDecorationLine: 'underline',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
});

import React, { Suspense, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, PanResponder, LogBox } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF, Stage } from '@react-three/drei/native';

LogBox.ignoreLogs(['EXGL: gl.pixelStorei', 'THREE.WebGLRenderer']);

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

const ARLiveView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { productModel } = route.params || { 
    productModel: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb'
  };

  const [permission, requestPermission] = useCameraPermissions();
  const groupRef = useRef(null);
  

  const currentRotation = useRef({ x: 0, y: 0 });
  const currentScale = useRef(1);
  const initialPinchDistance = useRef(null);
  const initialScale = useRef(1);


  const getDistance = (touches) => {
    const [a, b] = touches;
    return Math.sqrt(Math.pow(a.pageX - b.pageX, 2) + Math.pow(a.pageY - b.pageY, 2));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt) => {
      },

      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        
        if (groupRef.current) {
          
          if (touches.length === 1) {
            initialPinchDistance.current = null;

            const sensitivity = 0.008; 
            const nextRotX = currentRotation.current.x + (gestureState.dy * sensitivity);
            const nextRotY = currentRotation.current.y + (gestureState.dx * sensitivity);

            groupRef.current.rotation.x = nextRotX;
            groupRef.current.rotation.y = nextRotY;
          } 
          else if (touches.length === 2) {
            const dist = getDistance(touches);

            if (initialPinchDistance.current == null) {
              initialPinchDistance.current = dist;
              initialScale.current = currentScale.current;
            } 
            else {
              const factor = dist / initialPinchDistance.current;
              const nextScale = Math.max(0.5, Math.min(4.0, initialScale.current * factor));
              
              groupRef.current.scale.set(nextScale, nextScale, nextScale);
            }
          }
        }
      },
      
      onPanResponderRelease: () => {
        if (groupRef.current) {
          currentRotation.current.x = groupRef.current.rotation.x;
          currentRotation.current.y = groupRef.current.rotation.y;
          currentScale.current = groupRef.current.scale.x;
        }
        initialPinchDistance.current = null;
      }
    })
  ).current;

  if (!permission) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#2563EB" /></View>;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is needed for AR.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      <View style={styles.gestureLayer} {...panResponder.panHandlers}>

        <Canvas 
          key={productModel} 
          dpr={[1, 1.5]} 
          gl={{ antialias: false, powerPreference: 'high-performance' }} 
          camera={{ position: [0, 0, 4] }}
        >
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1000} />
          
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6} shadows={false}>
              <group ref={groupRef}>
                <Model url={productModel} />
              </group>
            </Stage>
          </Suspense>
        </Canvas>
      </View>

      <SafeAreaView style={styles.uiContainer} pointerEvents="box-none">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Feather name="x" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.liveBadge}>
            <View style={styles.redDot} />
            <Text style={styles.liveText}>3D AR View</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.instructionTag}>
            <MaterialIcons name="3d-rotation" size={20} color="#FFF" />
            <Text style={styles.instructionText}>1 Finger: Rotate • 2 Fingers: Resize</Text>
          </View>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert("Snapshot", "Position captured!")}
          >
            <Text style={styles.actionButtonText}>Place Item Here</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#1E293B' },
  permissionText: { color: '#FFF', marginBottom: 20, fontSize: 16 },
  permissionButton: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8 },
  permissionBtnText: { color: '#FFF', fontWeight: 'bold' },
  gestureLayer: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  uiContainer: { flex: 1, justifyContent: 'space-between', zIndex: 2, pointerEvents: 'box-none' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 0, 0, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 0, 0, 0.5)' },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginRight: 6 },
  liveText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  footer: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  instructionTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 20 },
  instructionText: { color: '#FFF', marginLeft: 8, fontSize: 14, fontWeight: '500' },
  actionButton: { backgroundColor: '#FFFFFF', width: '100%', paddingVertical: 16, borderRadius: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  actionButtonText: { color: '#1E293B', fontSize: 16, fontWeight: 'bold' },
});

export default ARLiveView;
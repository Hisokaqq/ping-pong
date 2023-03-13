import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View,  } from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

export default function App() {
  const normVec = vector => {
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    return ({
      x: vector.x/magnitude,
      y: vector.y/magnitude
    })
  }
  const targetPositionX = useSharedValue(150)
  const targetPositionY = useSharedValue(150)
  const direction = useSharedValue(normVec({x: Math.random(), y: Math.random() }))
  const {height, width} = useWindowDimensions()
  useEffect(()=>{
    const interval = setInterval(update, DELTA)
    return ()=>clearInterval(interval)
  },[])
  const FPS = 60
  const DELTA = 1000/FPS
  const SPEED = 10
  const islandDim = {x:100, y:300, width: 100, height: 20}
  const update = () =>{
    const nextX = targetPositionX.value+ direction.value.x * SPEED
    const nextY = targetPositionY.value+ direction.value.y * SPEED
    if (nextY<0 || nextY + 25 >height){
      direction.value = {x: direction.value.x, y: -direction.value.y}
    }
    if (nextX<0 || nextX + 25>width){
      direction.value = {x: -direction.value.x, y: direction.value.y}
    }
    targetPositionX.value = withTiming(nextX, {duration: DELTA, easing: Easing.linear})
    targetPositionY.value = withTiming(nextY, {duration: DELTA, easing: Easing.linear})
    
  }
  const ballAnimatedStyles = useAnimatedStyle(()=>{
    return {
      top: targetPositionY.value, 
      left: targetPositionX.value,
    }
  })
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ball, ballAnimatedStyles]}/>
      <View style={{top: islandDim.y, left: islandDim.x, width: islandDim.width, height: islandDim.height, backgroundColor: "#000"}}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ball: {
    width: 25,
    aspectRatio: 1,
    borderRadius: "50%",
    backgroundColor: 'black',
    position: "absolute",
  },
  // island: {
  //   width: 100,
  //   height: 30,
  //   backgroundColor:  "#000",
  //   borderRadius: 20,
  // }
});

import React, { useState } from 'react';
import { Image } from 'expo-image';
import {
  Pressable,
  Modal,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AppImage({
  src,
  style,
  disableFullScreen = false,
}: {
  src?: string;
  style?: any;
  disableFullScreen?: boolean;
}) {
  console.log(src);
  const [modalVisible, setModalVisible] = useState(false);

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const handlePress = () => {
    if (!disableFullScreen && src) {
      setModalVisible(true);
    }
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        disabled={disableFullScreen || !src}
        android_ripple={{
          color: 'rgba(255, 255, 255, 0.3)',
          borderless: false,
        }}
        style={({ pressed }) => [
          {
            opacity: Platform.OS === 'ios' && pressed ? 0.7 : 1,
          },
        ]}
      >
        <Image
          style={style}
          source={src}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
            activeOpacity={0.7}
          >
            <View style={styles.closeButtonCircle}>
              <Ionicons name="close" size={28} color="#fff" />
            </View>
          </TouchableOpacity>

          <Image
            style={styles.fullScreenImage}
            source={src}
            placeholder={{ blurhash }}
            contentFit="contain"
            transition={500}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    right: 20,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

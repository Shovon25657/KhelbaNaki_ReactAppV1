import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive sizing functions
export const responsiveWidth = (size) => (width / 375) * size;
export const responsiveHeight = (size) => (height / 812) * size;
export const responsiveFont = (size) => (width / 375) * size;
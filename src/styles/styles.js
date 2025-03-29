import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgb(15, 7, 29)',
  },
  title: {
    fontSize: 30,
    fontWeight: 'regular',
    textAlign: 'left',
    color: 'rgb(255, 255, 255)',
    marginBottom: 20,
  },
  
  input: {
    height: 50,                                // Height of the input field
    color: 'rgb(255, 255, 255)',               // White text color
    backgroundColor: 'rgba(101, 100, 107, 0.3)',    // Slightly transparent black background (you can adjust opacity)
    borderColor: '#ccc',                      // Light gray border
    borderWidth: 1,                           // Border width
    borderRadius: 10,                         // Rounded corners
    paddingLeft: 10,                          // Padding inside the input for left alignment of text
    marginBottom: 20,                         // Space between input fields
    fontSize: 16,                             // Font size for the text
    paddingRight: 10,                         // Padding on the right (helps if there is any inner element like an icon)
  },
  
  buttontext: {
    height: 50,
    borderColor: '#ccc',
    backgroundColor: 'rgb(255, 255, 255)',
    borderWidth: 1,
    borderRadius: 111,
    paddingLeft: 10,
    marginBottom: 20,
  },

  panel: {
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    padding:'5%',
    height: '70%',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderColor: 'rgba(255, 255, 255, 0.31)',
    borderWidth: 1,
  },
  text: {
    color: 'rgb(202, 201, 201)',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default styles;

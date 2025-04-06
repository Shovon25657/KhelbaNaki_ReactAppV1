import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6a4cfc', // Gradient background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6a4cfc',
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  forgotText: {
    color: '#6a4cfc',
    textDecorationLine: 'underline',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#6a4cfc',
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  socialContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  icon: {
    width: 35,
    height: 35,
    marginHorizontal: 10,
  },
  signUpText: {
    marginTop: 20,
    color: '#6a4cfc',
    textDecorationLine: 'underline',
  },
});

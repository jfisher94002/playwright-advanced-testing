// Test Environment Configuration
export const TEST_CONFIG = {
  baseUrls: {
    client: 'https://rahulshettyacademy.com/client',
    loginPractice: 'https://rahulshettyacademy.com/loginpagePractise/',
    seleniumPractice: 'https://rahulshettyacademy.com/seleniumPractise/#/offers',
    automation: 'https://rahulshettyacademy.com/AutomationPractice/',
    uploadDownload: 'https://rahulshettyacademy.com/upload-download-test/index.html',
    angular: 'https://rahulshettyacademy.com/angularpractice/',
    home: 'https://rahulshettyacademy.com/'
  },
  
  testData: {
    validUser: {
      email: 'anshika@gmail.com',
      password: 'Iamking@000'
    },
    testUser: {
      email: 'jfisher94002@gmail.com',
      password: 'M0ch!190'
    },
    products: {
      zaraCoat: 'ZARA COAT 3',
      iphone: 'iphone 13 pro',
      adidas: 'ADIDAS ORIGINAL'
    }
  },

  timeouts: {
    default: 30000,
    navigation: 10000,
    element: 5000
  }
};

export default TEST_CONFIG;

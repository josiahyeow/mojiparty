export const config =
  process.env.NODE_ENV === 'development'
    ? {
        SERVER_URL: 'http://localhost:5001',
        CLIENT_URL: 'http://localhost:3000',
        GA_TRACKING_ID: '',
      }
    : {
        SERVER_URL: 'https://mojiparty.herokuapp.com',
        CLIENT_URL: 'https://mojiparty.herokuapp.com',
        GA_TRACKING_ID: 'UA-163616376-2',
      }

export default config

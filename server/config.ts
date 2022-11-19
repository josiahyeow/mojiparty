export const googleServiceAccountCredentials = (private_key: string) => ({
  type: "service_account",
  project_id: "mojiparty",
  private_key_id: "01c43852c7bc89b1d84c23ad6ca9c8d67369a954",
  private_key,
  client_email: "emojiset@mojiparty.iam.gserviceaccount.com",
  client_id: "102531640761122675791",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/emojiset%40mojiparty.iam.gserviceaccount.com",
});

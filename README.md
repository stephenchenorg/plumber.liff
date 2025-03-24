# LINE LIFF Application

This is a simple LINE LIFF (LINE Frontend Framework) application that demonstrates basic LIFF functionality.

## Features

- User profile display
- Send messages through LINE
- Modern and responsive UI

## Setup Instructions

1. Create a LINE LIFF application:
   - Go to the [LINE Developers Console](https://developers.line.biz/console/)
   - Create a new provider (if you don't have one)
   - Create a new LIFF app
   - Get your LIFF ID

2. Configure the application:
   - Replace `YOUR_LIFF_ID` in `liff.js` with your actual LIFF ID
   - Set the Endpoint URL in LINE Developers Console to your deployed URL

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the application locally:
   ```bash
   npm start
   ```

5. Access the application:
   - Open the URL in your LINE app
   - Or scan the QR code from LINE Developers Console

## Development

- The application uses vanilla JavaScript and HTML
- LIFF SDK is loaded from LINE's CDN
- The UI is styled with modern CSS

## Security Notes

- Always use HTTPS in production
- Keep your LIFF ID secure
- Follow LINE's security best practices

## License

MIT 
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

## Build & Deploy

### Deploy the app using 'Deploy to Netlify' button

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/stephenchenorg/plumber.liff.git)

1. Click **Deploy to Netlify** above.
2. On the "Create New App" page in Netlify, fill in the required information.
3. Click **Deploy app**.

### Build and deploy the app with Netlify CLI tools

1. Install Netlify CLI tool from npm.

```sh
$ npm install netlify-cli -g
```

2. Run following command to build project.

```sh
$ LIFF_ID="your LIFF ID" npm run build
```

3. Make sure you have signed in your Netlify account.

```sh
$ netlify login
```

4. Deploy to Netlify

```sh
$ netlify deploy
```

5. Create your site name and choose the source path `dist` to deploy.

6. You can see the stating(draft) site URL, once you confirm it you can deploy it to production stie.

```sh
$ netlify deploy --prod
```

## Demo site

You can also check official site before you trying it.

https://liff-starter.netlify.app


# Ecosapiens Auto Bot

An automated bot for scanning products on the Ecosapiens platform with support for both canvas-generated and URL-based product images.

## Register

- https://prod.ecosapiens.xyz/mobile/login/register/?referral_code=ICLGSOVW

## Features

- **Automated Product Scanning**: Automatically scan products using the Ecosapiens API
- **Canvas Image Generation**: Generate realistic product images on-the-fly
- **URL-based Images**: Use pre-defined product images from URLs
- **Configurable**: Customizable scan count and image sources
- **Retry Logic**: Built-in retry mechanisms for failed operations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Valid Ecosapiens account with session cookie

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/airdropbomb/Ecosapiens.git && cd Ecosapiens 
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure your environment**:
   Edit `.env` file and add your session cookie:
   ```env
   COOKIE=your_ecosapiens_session_cookie_here
   ```

## Getting Your Session Cookie

1. Open your browser and navigate to [Ecosapiens](https://prod.ecosapiens.xyz/)
2. Log in to your account
3. Open Developer Tools (F12)
4. Go to Application/Storage → Cookies
5. Find and copy the `_ecolink_session` cookie value
6. Paste it in your `.env` file

## Usage

### Basic Usage

Run the bot:
```bash
npm start
```

### Command Line Options

The bot will prompt you for:
- **Image Source**: Choose between canvas-generated or URL-based images
- **Scan Count**: Number of scans to perform

### Example Run

```bash
$ npm start

-------------------------------------------------
   Ecosapiens Auto Bot - Airdrop Insiders
-------------------------------------------------

[➤] Getting user information...
User Information:
Name: John Doe
Email: john@example.com
User ID: 12345
Referral Code: ABC123
Wallet: 0x1234...

Select image source:
1. Canvas-generated images
2. URL-based images (default)
Enter option number (1 or 2): 1

How many scans do you want to perform? 5

[✅] Starting 5 scans with canvas-generated images...

[➤] Performing scan 1/5...
[➤] Generating canvas image for soap...
[✅] Canvas image generated: soap_1703123456789.jpg
[⟳] Uploading image for scanning...
[✅] Scan initiated with ID: scan_123
[⟳] Waiting for scan to complete...
[✅] Scan 1 completed successfully!
```

## Configuration

### Product Types

The bot supports scanning these product types:
- Soap
- Cigarette
- Lollipop
- Toothpaste
- Shampoo
- Snacks
- Drinks
- Cookies
- Candy
- Chocolate

### Canvas Generation Features

- **Realistic Product Images**: Generates product-specific designs
- **Brand Information**: Includes brand names, sizes, and taglines
- **Visual Effects**: Gradients, shadows, and product-specific elements
- **Warning Labels**: Adds appropriate warnings (e.g., for cigarettes)

## Error Handling

- **Network Failures**: Automatic retry with exponential backoff
- **Image Download Errors**: Fallback to canvas generation
- **API Rate Limiting**: Built-in delays between requests
- **Scan Timeouts**: Configurable timeout for scan completion

## Troubleshooting

### Common Issues

1. **"Invalid cookie format" error**:
   - Ensure your cookie includes the `_ecolink_session` value
   - Check that the cookie hasn't expired

2. **"Failed to download image" error**:
   - Switch to canvas-generated images
   - Check your internet connection

3. **"Scan timeout" error**:
   - The Ecosapiens server might be busy
   - Try reducing the number of concurrent scans

### Debug Mode

If you encounter issues, the bot automatically displays debug information including:
- Base URL configuration
- User agent string
- Cookie presence status
- HTTP response details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This bot is for educational purposes only. Use responsibly and in accordance with Ecosapiens' terms of service. The authors are not responsible for any misuse or violations of platform policies.

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the Ecosapiens platform documentation

---

**⭐ If this project helped you, please give it a star on GitHub!**

const axios = require('axios');
const FormData = require('form-data');
const readline = require('readline');
const { createCanvas } = require('canvas');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

const logger = {
  info: (msg) => console.log(`${colors.green}[✓] ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}[⚠] ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}[✗] ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}[✅] ${msg}${colors.reset}`),
  loading: (msg) => console.log(`${colors.cyan}[⟳] ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.white}[➤] ${msg}${colors.reset}`),
  banner: () => {
    console.log(`${colors.cyan}${colors.bold}`);
    console.log(`-------------------------------------------------`);
    console.log(`   Ecosapiens Auto Bot - Airdrop Insiders`);
    console.log(`-------------------------------------------------${colors.reset}`);
    console.log();
  }
};

class EcosapiensBot {
  constructor() {
    this.baseURL = 'https://api.prod.ecosapiens.xyz';
    this.cookie = process.env.COOKIE;
    this.userAgent = this.getRandomUserAgent();

    this.productImages = [
      'https://images.pexels.com/photos/4705879/pexels-photo-4705879.jpeg?auto=compress&cs=tinysrgb&w=400', 
      'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400', 
      'https://images.pexels.com/photos/634146/pexels-photo-634146.jpeg?auto=compress&cs=tinysrgb&w=400', 
      'https://images.pexels.com/photos/4434469/pexels-photo-4434469.jpeg?auto=compress&cs=tinysrgb&w=400', 
      'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=400', 
      'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400', 
      'https://images.pexels.com/photos/128402/pexels-photo-128402.jpeg?auto=compress&cs=tinysrgb&w=400', 
      'https://images.pexels.com/photos/2144200/pexels-photo-2144200.jpeg?auto=compress&cs=tinysrgb&w=400', 
      'https://images.pexels.com/photos/583680/pexels-photo-583680.jpeg?auto=compress&cs=tinysrgb&w=400', 
      'https://images.pexels.com/photos/264905/pexels-photo-264905.jpeg?auto=compress&cs=tinysrgb&w=400' 
    ];
    
    this.productNames = [
      'soap', 'cigarette', 'lollipop', 'toothpaste', 'shampoo',
      'snacks', 'drinks', 'cookies', 'candy', 'chocolate'
    ];

    this.productDetails = {
      soap: { brand: 'PureClean', size: '100g', tagline: 'Natural Glow', color: '#87CEEB' },
      cigarette: { brand: 'Saga Bold', size: '20 Filter', tagline: 'Premium Blend', color: '#8B0000' },
      lollipop: { brand: 'SweetSwirl', size: '50g', tagline: 'Fruity Delight', color: '#FF69B4' },
      toothpaste: { brand: 'BrightSmile', size: '75ml', tagline: 'Fresh Mint', color: '#00CED1' },
      shampoo: { brand: 'SilkShine', size: '250ml', tagline: 'Smooth & Strong', color: '#9932CC' },
      snacks: { brand: 'CrunchyBites', size: '150g', tagline: 'Tasty Crunch', color: '#FFA500' },
      drinks: { brand: 'CoolSplash', size: '500ml', tagline: 'Refresh Now', color: '#1E90FF' },
      cookies: { brand: 'GoldenCrisp', size: '200g', tagline: 'Buttery Bliss', color: '#DAA520' },
      candy: { brand: 'SugarRush', size: '100g', tagline: 'Sweet Escape', color: '#FF4500' },
      chocolate: { brand: 'RichCocoa', size: '100g', tagline: 'Pure Indulgence', color: '#8B4513' }
    };
  }

  getRandomUserAgent() {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Safari/605.1.15'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  getHeaders() {
    return {
      'accept': 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'sec-ch-ua': '"Chromium";v="120", "Google Chrome";v="120", "Not(A:Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'x-requested-with': 'XMLHttpRequest',
      'user-agent': this.userAgent,
      'cookie': this.cookie,
      'Referer': 'https://prod.ecosapiens.xyz/',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
  }

  async downloadImageToBuffer(url, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios({
          method: 'GET',
          url: url,
          responseType: 'arraybuffer',
          timeout: 10000
        });
        return Buffer.from(response.data);
      } catch (error) {
        if (attempt === retries) {
          logger.error(`Failed to download image from ${url} after ${retries} attempts: ${error.message}`);
          throw error;
        }
        logger.warn(`Attempt ${attempt} failed for ${url}: ${error.message}. Retrying...`);
        await this.sleep(2000);
      }
    }
  }

  generateProductImage(productName) {
    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext('2d');
    const details = this.productDetails[productName] || this.productDetails.soap;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#F5F5F5');
    gradient.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    const productGradient = ctx.createLinearGradient(60, 60, 60, 340);
    productGradient.addColorStop(0, '#E0E0E0');
    productGradient.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = productGradient;
    ctx.fillRect(60, 60, 280, 280);

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = details.color;
    ctx.fillRect(60, 60, 280, 40);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(details.brand.toUpperCase(), 200, 140);

    ctx.font = '20px Arial';
    ctx.fillText(details.size, 200, 180);
    ctx.font = 'italic 18px Arial';
    ctx.fillText(details.tagline, 200, 210);

    if (productName === 'cigarette') {
      ctx.fillStyle = '#FFFF99';
      ctx.fillRect(60, 260, 280, 40);
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.fillText('WARNING: SMOKING IS HARMFUL', 200, 280);
    } else if (productName === 'soap') {
      ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
      ctx.beginPath();
      ctx.arc(100, 100, 20, 0, Math.PI * 2);
      ctx.arc(300, 300, 15, 0, Math.PI * 2);
      ctx.fill();
    } else if (productName === 'shampoo') {
      ctx.fillStyle = details.color + '80';
      ctx.beginPath();
      ctx.moveTo(60, 300);
      ctx.quadraticCurveTo(100, 280, 140, 300);
      ctx.fill();
    }

    ctx.fillStyle = '#000000';
    for (let i = 0; i < 30; i++) {
      if (Math.random() > 0.5) {
        ctx.fillRect(100 + i * 4, 310, 2, 20);
      }
    }

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    return canvas.toBuffer('image/jpeg');
  }

  async getUserInfo() {
    try {
      const response = await axios.get(`${this.baseURL}/api/session`, {
        headers: this.getHeaders(),
        timeout: 5000
      });
      return response.data.current_user;
    } catch (error) {
      logger.error(`Failed to get user info: ${error.message}`);
      throw error;
    }
  }

  async uploadImageBuffer(imageBuffer, filename) {
    try {
      const formData = new FormData();
      formData.append('image', imageBuffer, {
        filename: filename,
        contentType: 'image/jpeg'
      });

      const response = await axios.post(`${this.baseURL}/api/scans`, formData, {
        headers: {
          ...this.getHeaders(),
          ...formData.getHeaders(),
          'content-type': `multipart/form-data; boundary=${formData.getBoundary()}`
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      logger.error(`Failed to upload image: ${error.message}`);
      throw error;
    }
  }

  async checkScanResult(scanId) {
    try {
      const response = await axios.get(`${this.baseURL}/api/scans/${scanId}`, {
        headers: this.getHeaders(),
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      logger.error(`Failed to check scan result for ID ${scanId}: ${error.message}`);
      throw error;
    }
  }

  async waitForScanComplete(scanId, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const result = await this.checkScanResult(scanId);
        
        if (result.status === 'completed') {
          return result;
        } else if (result.status === 'failed') {
          throw new Error(`Scan failed: ${result.failure_reason || 'Unknown reason'}`);
        }
        
        logger.loading(`Waiting for scan ${scanId} to complete... (${i + 1}/${maxAttempts})`);
        await this.sleep(2000);
      } catch (error) {
        logger.warn(`Attempt ${i + 1} failed: ${error.message}`);
        await this.sleep(2000);
      }
    }
    
    throw new Error('Scan timeout');
  }

  async performScan(useCanvas = false) {
    try {
      const randomIndex = Math.floor(Math.random() * this.productImages.length);
      const productName = this.productNames[randomIndex];
      const filename = `${productName}_${Date.now()}.jpg`;
      let imageBuffer;

      if (useCanvas) {
        logger.step(`Generating canvas image for ${productName}...`);
        imageBuffer = this.generateProductImage(productName);
        logger.success(`Canvas image generated: ${filename}`);
      } else {
        const imageUrl = this.productImages[randomIndex];
        logger.step(`Preparing to scan ${productName}...`);
        logger.info(`Using image: ${imageUrl}`);
        logger.loading('Downloading product image...');
        imageBuffer = await this.downloadImageToBuffer(imageUrl);
        logger.success(`Image downloaded: ${filename}`);
      }

      logger.loading('Uploading image for scanning...');
      const scanResult = await this.uploadImageBuffer(imageBuffer, filename);
      logger.success(`Scan initiated with ID: ${scanResult.id}`);

      logger.loading('Waiting for scan to complete...');
      const completedScan = await this.waitForScanComplete(scanResult.id);

      if (completedScan.product) {
        logger.info(`Product Scanned: ${completedScan.product.name || 'Unknown'}`);
        logger.info(`Score: ${completedScan.product.score || 'Not available'}`);
        if (completedScan.product.description) {
          logger.info(`Description: ${completedScan.product.description}`);
        }
      } else {
        logger.warn('No product information available in scan result');
      }
      
      return completedScan;
    } catch (error) {
      logger.error(`Scan failed: ${error.message}`);
      throw error;
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getUserInput(question) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise(resolve => {
      rl.question(question, answer => {
        rl.close();
        resolve(answer);
      });
    });
  }

  async validateCookie() {
    if (!this.cookie) {
      logger.error('No cookie provided in .env file. Please set COOKIE environment variable.');
      return false;
    }
    if (!this.cookie.includes('_ecolink_session')) {
      logger.error('Invalid cookie format. Cookie must include "_ecolink_session".');
      return false;
    }
    return true;
  }

  async run() {
    try {
      logger.banner();

      if (!(await this.validateCookie())) {
        return;
      }

      logger.step('Getting user information...');
      let userInfo = null;
      try {
        userInfo = await this.getUserInfo();
        
        console.log(`${colors.cyan}${colors.bold}User Information:${colors.reset}`);
        console.log(`Name: ${userInfo?.name || userInfo?.first_name || 'Unknown'}`);
        console.log(`Email: ${userInfo?.email || 'Unknown'}`);
        console.log(`User ID: ${userInfo?.id || 'Unknown'}`);
        console.log(`Referral Code: ${userInfo?.referral_code || 'Unknown'}`);
        console.log(`Wallet: ${userInfo?.wallet_address || 'Not set'}`);
        console.log();
      } catch (error) {
        logger.warn('Could not fetch user info, continuing with scan only mode...');
        console.log();
      }

      console.log(`${colors.yellow}Select image source:${colors.reset}`);
      console.log('1. Canvas-generated images');
      console.log('2. URL-based images (default)');
      const imageSource = await this.getUserInput(
        `${colors.yellow}Enter option number (1 or 2): ${colors.reset}`
      );
      const useCanvas = parseInt(imageSource) === 1;
      if (![1, 2].includes(parseInt(imageSource))) {
        logger.info('Invalid option, defaulting to URL-based images');
      }
      console.log();

      const scanCount = await this.getUserInput(`${colors.yellow}How many scans do you want to perform? ${colors.reset}`);
      const numScans = parseInt(scanCount);

      if (isNaN(numScans) || numScans <= 0) {
        logger.error('Invalid number of scans');
        return;
      }

      logger.success(`Starting ${numScans} scans ${useCanvas ? 'with canvas-generated images' : 'with URL-based images'}...`);
      console.log();

      let successCount = 0;
      let failCount = 0;

      for (let i = 1; i <= numScans; i++) {
        try {
          logger.step(`Performing scan ${i}/${numScans}...`);
          
          const result = await this.performScan(useCanvas);
          logger.success(`Scan ${i} completed successfully!`);
          successCount++;

          if (i < numScans) {
            logger.loading('Waiting before next scan...');
            await this.sleep(3000 + Math.random() * 2000); 
          }
          
        } catch (error) {
          logger.error(`Scan ${i} failed: ${error.message}`);
          failCount++;
        }
      }

      console.log();
      logger.success(`Scanning completed!`);
      logger.info(`Successful scans: ${successCount}`);
      if (failCount > 0) {
        logger.warn(`Failed scans: ${failCount}`);
      }

    } catch (error) {
      logger.error(`Bot error: ${error.message}`);

      console.log(`${colors.yellow}Debug Info:${colors.reset}`);
      console.log(`- Base URL: ${this.baseURL}`);
      console.log(`- User Agent: ${this.userAgent}`);
      console.log(`- Cookie: ${this.cookie ? 'Present' : 'Missing'}`);
      
      if (error.response) {
        console.log(`- Response Status: ${error.response.status}`);
        console.log(`- Response Data: ${JSON.stringify(error.response.data)}`);
      }
    }
  }
}

const bot = new EcosapiensBot();
bot.run().catch(error => {
  console.error('Bot crashed:', error);
});
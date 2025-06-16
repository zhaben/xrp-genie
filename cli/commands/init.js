const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

async function initCommand(projectName = 'my-xrp-app') {
  console.log('🧞‍♂️ Welcome to XRP Genie Setup!\n');

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Choose your wallet setup mode:',
      choices: [
        { name: '🟢 Faucet Mode - XRPL Testnet with automatic wallet funding', value: 'faucet' },
        { name: '🔵 Xaman Mode - Connect with Xaman (XUMM) wallet via QR code', value: 'xaman' },
        { name: '🟣 Web3Auth Mode - Social login with account abstraction', value: 'web3auth' },
        { name: '💰 USDC Trustline - USDC trustline management with Circle integration', value: 'usdc-trustline' }
      ]
    }
  ]);

  // Ask for network selection if Xaman or Web3Auth mode is chosen
  let network = 'testnet'; // default
  if (answers.mode === 'xaman') {
    const networkAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'network',
        message: 'Choose XRPL network for Xaman integration:',
        choices: [
          { name: '🧪 Testnet - For development and testing', value: 'testnet' },
          { name: '🌐 Mainnet - For production use', value: 'mainnet' }
        ]
      }
    ]);
    network = networkAnswer.network;
  } else if (answers.mode === 'web3auth') {
    const web3authEnvAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'web3authEnv',
        message: 'Choose Web3Auth infrastructure environment:',
        choices: [
          { name: '🧪 Sapphire Devnet - Development (most new projects)', value: 'devnet' },
          { name: '🌐 Sapphire Mainnet - Production (established projects)', value: 'mainnet' }
        ]
      }
    ]);

    const networkAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'network',
        message: 'Choose XRPL network for Web3Auth integration:',
        choices: [
          { name: '🧪 Testnet - For development and testing (with faucet)', value: 'testnet' },
          { name: '🌐 Mainnet - Production use (real XRP required)', value: 'mainnet' }
        ]
      }
    ]);
    
    network = networkAnswer.network;
    answers.web3authEnv = web3authEnvAnswer.web3authEnv;
  }

  const { mode } = answers;
  const projectPath = path.resolve(projectName);

  console.log(`\n✨ ${getModeDescription(mode)} selected.`);
  console.log(`📁 Scaffolding project in: ${projectPath}\n`);

  try {
    // Clone template from specific branch
    console.log(`📥 Downloading ${mode} template...`);
    const repoUrl = 'https://github.com/zhaben/xrp-genie.git';
    const branchName = `template/${mode}`;
    
    // Clone the specific template branch
    execSync(`git clone -b ${branchName} --depth 1 ${repoUrl} "${projectPath}"`, { 
      stdio: 'pipe' // Hide git output for cleaner CLI experience
    });
    
    // Remove .git directory to clean up
    await fs.remove(path.join(projectPath, '.git'));
    
    console.log(`✅ Template downloaded successfully!`);

    // Copy .env.local.example to .env.local
    const envExamplePath = path.join(projectPath, '.env.local.example');
    const envPath = path.join(projectPath, '.env.local');
    
    if (await fs.pathExists(envExamplePath)) {
      await fs.copy(envExamplePath, envPath);
    }

    // Update package.json name
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    // Configure network settings for Xaman and Web3Auth modes
    if (mode === 'xaman') {
      await configureXamanNetwork(projectPath, network);
    } else if (mode === 'web3auth') {
      await configureWeb3AuthNetwork(projectPath, network, answers.web3authEnv);
    }

    console.log('✅ Project scaffolded successfully!');
    console.log('\n📦 Installing dependencies...');
    
    // Install dependencies
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });

    console.log('\n🎉 Setup complete!');
    console.log('\n📋 Next steps:');
    console.log(`   cd ${projectName}`);
    
    if (mode !== 'faucet') {
      console.log('   📝 Edit .env.local with your API keys');
    }
    
    console.log('   🚀 npm run dev');
    console.log('\n🔗 Visit: http://localhost:3000');
    
    if (mode !== 'faucet') {
      console.log('\n⚠️  Remember to configure your API keys in .env.local');
      showModeSpecificInstructions(mode, network);
    }

  } catch (error) {
    console.error('❌ Error creating project:', error.message);
    process.exit(1);
  }
}

function getModeDescription(mode) {
  const descriptions = {
    faucet: 'Faucet Mode',
    xaman: 'Xaman Mode', 
    web3auth: 'Web3Auth Mode',
    'usdc-trustline': 'USDC Trustline Mode'
  };
  return descriptions[mode];
}

async function configureXamanNetwork(projectPath, network) {
  const websocketUrl = network === 'mainnet' 
    ? 'wss://xrplcluster.com'
    : 'wss://s.altnet.rippletest.net:51233';
  
  // Update the account-info API route
  const accountInfoPath = path.join(projectPath, 'app/api/xrpl/account-info/route.ts');
  if (await fs.pathExists(accountInfoPath)) {
    let content = await fs.readFile(accountInfoPath, 'utf8');
    content = content.replace(
      /const client = new Client\('.*?'\)/,
      `const client = new Client('${websocketUrl}')`
    );
    content = content.replace(
      /This account may not be activated yet on .*?\./,
      `This account may not be activated yet on ${network}.`
    );
    await fs.writeFile(accountInfoPath, content);
  }

  // Update the hook error message
  const hookPath = path.join(projectPath, 'hooks/useXamanWallet.ts');
  if (await fs.pathExists(hookPath)) {
    let content = await fs.readFile(hookPath, 'utf8');
    content = content.replace(
      /You need to receive at least 10 XRP to activate your account on .*?\./,
      `You need to receive at least 10 XRP to activate your account on ${network}.`
    );
    await fs.writeFile(hookPath, content);
  }
}

async function configureWeb3AuthNetwork(projectPath, network, web3authEnv) {
  // Update the Web3Auth hook with network configuration
  const hookPath = path.join(projectPath, 'hooks/useWeb3AuthWallet.ts');
  if (await fs.pathExists(hookPath)) {
    let content = await fs.readFile(hookPath, 'utf8');
    
    // Update chain config based on network
    let chainConfigLine;
    if (network === 'mainnet') {
      chainConfigLine = 'const chainConfig = getXrplChainConfig(0x1)!'; // Mainnet
    } else {
      // Testnet (default)
      chainConfigLine = 'const chainConfig = getXrplChainConfig(0x2)!'; // Testnet 
    }
    
    content = content.replace(
      /const chainConfig = getXrplChainConfig\(.*?\)!/,
      chainConfigLine
    );
    
    // Update Web3Auth environment
    const web3authNetworkLine = web3authEnv === 'mainnet' 
      ? 'web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,'
      : 'web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,';
    
    content = content.replace(
      /web3AuthNetwork: WEB3AUTH_NETWORK\.SAPPHIRE_[A-Z]+,/,
      web3authNetworkLine
    );

    // Update comment with network info
    content = content.replace(
      /\/\/ Use testnet by default \(will be configurable by CLI\)|\/\/ Using .* \(configured by CLI\)/,
      `// Using XRPL ${network} with Web3Auth ${web3authEnv} (configured by CLI)`
    );
    
    // Update faucet URL based on network
    let faucetUrl;
    if (network === 'testnet') {
      faucetUrl = 'https://faucet.altnet.rippletest.net/accounts';
    } else {
      // Mainnet - disable faucet
      faucetUrl = null;
    }
    
    if (faucetUrl) {
      content = content.replace(
        /const response = await fetch\(".*?"/,
        `const response = await fetch("${faucetUrl}"`
      );
    } else {
      // For mainnet, replace faucet function with error message
      content = content.replace(
        /\/\/ Use XRPL testnet faucet[\s\S]*?xrpAmount: "1000" \/\/ Request 1000 XRP from testnet faucet/,
        `// Mainnet - no faucet available
      throw new Error("Faucet not available on mainnet. Please use real XRP to fund your account.")`
      );
    }
    
    await fs.writeFile(hookPath, content);
  }

  // Update environment file
  const envPath = path.join(projectPath, '.env.local');
  if (await fs.pathExists(envPath)) {
    let content = await fs.readFile(envPath, 'utf8');
    if (content.includes('XRPL_NETWORK=')) {
      content = content.replace(/^.*XRPL_NETWORK=.*/m, `NEXT_PUBLIC_XRPL_NETWORK=${network}`);
    } else {
      content += `\nNEXT_PUBLIC_XRPL_NETWORK=${network}`;
    }
    content += `\nNEXT_PUBLIC_WEB3AUTH_ENV=${web3authEnv}\n`;
    await fs.writeFile(envPath, content);
  }
}

function showModeSpecificInstructions(mode, network) {
  if (mode === 'xaman') {
    console.log('\n📱 Xaman Setup:');
    console.log('   1. Sign up at https://apps.xumm.dev/');
    console.log('   2. Create a new app and get your API key & secret');
    console.log('   3. Add them to .env.local');
    if (network === 'mainnet') {
      console.log('   ⚠️  Mainnet: Real XRP transactions will occur');
    }
  } else if (mode === 'web3auth') {
    console.log('\n🔐 Web3Auth Setup:');
    console.log('   1. Sign up at https://dashboard.web3auth.io/');
    console.log('   2. Create a new project and get your client ID');
    console.log('   3. Replace the clientId in hooks/useWeb3AuthWallet.ts');
    console.log('   4. Note: Web3Auth client ID is safe to expose publicly');
    
    if (network === 'mainnet') {
      console.log('   ⚠️  Mainnet: Real XRP required - no faucet available');
    } else {
      console.log('   🧪 Testnet: Faucet funding available for testing');
    }
  }
}

module.exports = { initCommand };
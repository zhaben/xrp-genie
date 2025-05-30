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
        { name: '🟣 Web3Auth Mode - Social login with account abstraction', value: 'web3auth' }
      ]
    }
  ]);

  const { mode } = answers;
  const projectPath = path.resolve(projectName);

  console.log(`\n✨ ${getModeDescription(mode)} selected.`);
  console.log(`📁 Scaffolding project in: ${projectPath}\n`);

  try {
    // Copy template
    const templatePath = path.join(__dirname, '../../templates', mode);
    await fs.copy(templatePath, projectPath);

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
      showModeSpecificInstructions(mode);
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
    web3auth: 'Web3Auth Mode'
  };
  return descriptions[mode];
}

function showModeSpecificInstructions(mode) {
  if (mode === 'xaman') {
    console.log('\n📱 Xaman Setup:');
    console.log('   1. Sign up at https://apps.xumm.dev/');
    console.log('   2. Create a new app and get your API key & secret');
    console.log('   3. Add them to .env.local');
  } else if (mode === 'web3auth') {
    console.log('\n🔐 Web3Auth Setup:');
    console.log('   1. Sign up at https://dashboard.web3auth.io/');
    console.log('   2. Create a new project and get your client ID');
    console.log('   3. Add it to .env.local');
  }
}

module.exports = { initCommand };
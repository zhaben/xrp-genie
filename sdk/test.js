const { XRPGenie, FaucetProvider } = require('./dist/index.js');

async function testSDK() {
  console.log('🧞‍♂️ Testing XRP Genie SDK...\n');

  try {
    // Test 1: Create SDK instance
    console.log('1. Creating Faucet provider...');
    const genie = XRPGenie.faucet({ network: 'testnet' });
    console.log('✅ SDK instance created');

    // Test 2: Check connection status
    console.log('\n2. Checking connection status...');
    console.log('Connected:', genie.isConnected());
    console.log('✅ Connection status checked');

    // Test 3: Try to connect (will create a new wallet)
    console.log('\n3. Connecting to create testnet wallet...');
    const wallet = await genie.connect();
    console.log('✅ Wallet created:');
    console.log('  Address:', wallet.address);
    console.log('  Has seed:', !!wallet.seed);

    // Test 4: Check balance
    console.log('\n4. Checking wallet balance...');
    const balance = await genie.getBalance(wallet.address);
    console.log('✅ Balance:', balance.xrp, 'XRP');

    // Test 5: Check connection status again
    console.log('\n5. Checking connection status after connect...');
    console.log('Connected:', genie.isConnected());

    // Test 6: Disconnect
    console.log('\n6. Disconnecting...');
    await genie.disconnect();
    console.log('✅ Disconnected');
    console.log('Connected:', genie.isConnected());

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSDK();
const ethers = require('ethers');
const BigNumber = require('bignumber.js');
require('dotenv').config();
const fs = require('fs');

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const adminWallet = new ethers.Wallet(process.env.ADMIN_KEY, provider);

let constructorParameters = [
   {
      "Underlying asset":"Komodo Corn (kZC=F)",
      "Strike asset":"USDC",
      "Strike price":535000000,
      "Expiration date":1640995199,
      "Symbol":"kZC=F:USDC",
      "Option Type":"Call (1)",
      "Underlying Address (Kovan)":"0xDB7afCc07D54aAf5C8ec618EbB4843f00Eec4003",
      "Strike Address (Kovan)":"0xe22da380ee6b445bb8273c81944adeb6e8450422",
      "Option Address (Kovan)":"0xaA6143A5E8D40F3e5cba7446BF845A6219A665D9",
      "Pool Address (Kovan)":"0xa4b7f978db7b7963dfb231bf341eed3866b20f17",
      "IV":20.47
   },
   {
      "Underlying asset":"Komodo Corn (kZC=F)",
      "Strike asset":"USDC",
      "Strike price":500000000,
      "Expiration date":1640995199,
      "Symbol":"kZC=F:USDC",
      "Option Type":"Call (1)",
      "Underlying Address (Kovan)":"0xDB7afCc07D54aAf5C8ec618EbB4843f00Eec4003",
      "Strike Address (Kovan)":"0xe22da380ee6b445bb8273c81944adeb6e8450422",
      "Option Address (Kovan)":"0x5Ae7284d32BB843B7a6CE2fC7082B2402dEED175",
      "Pool Address (Kovan)":"0x8c2115ab84ff998424229c18d7d0f05469e79cb9",
      "IV":20.47
   },
   {
      "Underlying asset":"Komodo Corn (kZC=F)",
      "Strike asset":"USDC",
      "Strike price":475000000,
      "Expiration date":1638316799,
      "Symbol":"kZC=F:USDC",
      "Option Type":"Call (1)",
      "Underlying Address (Kovan)":"0xDB7afCc07D54aAf5C8ec618EbB4843f00Eec4003",
      "Strike Address (Kovan)":"0xe22da380ee6b445bb8273c81944adeb6e8450422",
      "Option Address (Kovan)":"0xcE37f77BD050D22AEaA2e67daa3cFed66f85eb00",
      "Pool Address (Kovan)":"0xddd51da84d6f0fbd26840a6cb6ad6b3f407b7dfa",
      "IV":20.47
   },
]


const optionAMMFactoryABI = [  {    "inputs": [      {        "internalType": "contract IConfigurationManager",        "name": "_configurationManager",        "type": "address"      },      {        "internalType": "address",        "name": "_feePoolBuilder",        "type": "address"      }    ],    "stateMutability": "nonpayable",    "type": "constructor"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "address",        "name": "deployer",        "type": "address"      },      {        "indexed": false,        "internalType": "address",        "name": "pool",        "type": "address"      },      {        "indexed": false,        "internalType": "address",        "name": "option",        "type": "address"      }    ],    "name": "PoolCreated",    "type": "event"  },  {    "inputs": [],    "name": "configurationManager",    "outputs": [      {        "internalType": "contract IConfigurationManager",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_optionAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_stableAsset",        "type": "address"      },      {        "internalType": "uint256",        "name": "_initialIV",        "type": "uint256"      }    ],    "name": "createPool",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [],    "name": "feePoolBuilder",    "outputs": [      {        "internalType": "contract IFeePoolBuilder",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_optionAddress",        "type": "address"      }    ],    "name": "getPool",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  }]
const optionAMMFactoryAddress = "0x6F23e5f46022A612E86C24F05Aa80Ce2B42d96ab"

const start = async () => {
	const optionAMMFactory = new ethers.Contract(optionAMMFactoryAddress, optionAMMFactoryABI, adminWallet)

	for (var i=0; i< constructorParameters.length; i++){
		try {
      const newPool = await optionAMMFactory.createPool(
        constructorParameters[i]["Option Address (Kovan)"],
        constructorParameters[i]["Strike Address (Kovan)"],
        new BigNumber(constructorParameters[i]["IV"]).times(new BigNumber(10).pow(18)).toString(),
  			{
  				gasPrice:10000000000,
  				gasLimit:12500000
  			}
  		);

      const finishPool = await newPool.wait();

      let iface = new ethers.utils.Interface(optionAMMFactoryABI);

      console.log("Created Pool: ", iface.parseLog(finishPool.logs, finishPool.logs[0]).args.pool);

      const pool = iface.parseLog(finishPool.logs[0]).args.pool;
      constructorParameters[i]["Pool Address (Kovan)"] = pool;


    } catch(e){
      console.log(e)
    }

	}

  fs.writeFileSync("poolResults.json", JSON.stringify(constructorParameters));
}


start();


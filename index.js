import {ethers} from "./ethers-5.2.esm.min.js"
import {abi,contractAddress} from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fund")
connectButton.onclick =  connect
fundButton.onclick = fund
const balanceButton = document.getElementById("balanceButton")
balanceButton.onclick = getBalance
const withdrawb = document.getElementById("withdraw")
withdrawb.onclick  = withdraw
console.log(ethers)
async function connect(){
    if(typeof window.ethereum !== "undefined"){
      await window.ethereum.request({method:"eth_requestAccounts"})
      document.getElementById("connectButton").innerHTML= "connnected"
      console.log("connected")
    }else{
        console.log("no metamask")
    }
}
// fund function
async function fund(){
    const ethAmount = document.getElementById("ethAmount").value
    // console.log(`funding with ${ethAmount}`)
    if(typeof window.ethereum !== "undefined"){
        // provider / connection to blockchain
        // signer/ wallet / some one with the gas
        // contract that we are intreaction with 
        // ABI & address
        
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress,abi,signer)

        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
        })
        await listenForTransactionMine(transactionResponse, provider)
        console.log("done")
    }
}
async function getBalance(){
    if(typeof window.ethereum !== "undefined"){
     
        
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))

    }
}
async function withdraw(){
    if(typeof window.ethereum !== "undefined"){
        console.log('withdraw')
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress,abi,signer)
        try{
            const transactionResponse   = await contract.withdraw()
            await listenForTransactionMine(transactionResponse,provider)
        }catch(error){
            console.log(error)
        }
    }
}
function listenForTransactionMine(transactionResponse, provider){
    return new Promise((resolve, reject)=>{
        provider.once(transactionResponse.hash, (transactionReceipt)=>{
            console.log(`completed with ${transactionReceipt.confirmations}`)
            resolve()
        })
        
    })
   
}
import { useState, useEffect } from 'react';
import {ethers} from 'ethers';
import {contractAbi, contractAddress} from './Constant/Constant';
import Login from './Components/Login';
import Connected from './Components/Connected';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');

  useEffect( () => {
    if (window.ethereum){
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return() => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      } 
    }
  });

  async function getCandidates () {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract (
      contractAddress, contractAbi, signer
    );
    const candidateList = await contractInstance.getallVotesOfCandiates();
  }

  async function getCurrentStatus(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract (
      contractAddress, contractAbi, signer
    );
    const status = await contractInstance.getVotingStatus();
    setVotingStatus(status);
  }

  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract (
      contractAddress, contractAbi, signer
    );
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts) {
    if (handleAccountsChanged.length > 0 && account !== account[0] ) {
      setAccount(accounts[0]);
    } else{
        setIsConnected(false);
        setAccount(null);
      }
  }
  
  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Connected : " + address);
        setIsConnected(true);
      }
      catch(err){
        console.error(err);
      }
    } else{
      console.error("Metamask is not detected in this browser")
    }
  }

  return (
    <div className='App'>
      {isConnected ? (<Connected account = {account}/>) : (<Login connectWallet = {connectToMetamask}/>)}
      {/* <Connected account={67}/> */}
    </div>
  );
}

export default App;
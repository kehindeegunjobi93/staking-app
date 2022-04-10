import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Web3 from "web3";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import Main from './Main';

function App() {
  const [account, setAccount] = useState();
  const [tether, setTether] = useState({});
  const [rwd, setRwd] = useState({});
  const [decBank, setDecBank] = useState({});
  const [tetherBal, setTetherBal] = useState("0");
  const [rwdBalance, setRwdBalance] = useState("0");
  const [stakingBal, setStakingBal] = useState("0");
  const [loading, setLoading] = useState(true);

  const loadWallet = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereum wallet detected");
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const walletAccount = await web3.eth.getAccounts();
    setAccount(walletAccount[0]);
    const networkId = await web3.eth.net.getId();

    //load tether token
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      setTether(tether);
      let tetherBalancee = await tether.methods
        .balanceOf(walletAccount[0])
        .call();
      setTetherBal(tetherBalancee.toString());
      console.log(tetherBalancee.toString());
    } else {
      window.alert("Error! Tether contract not deployed");
    }

    //load rwd token
    const rwdTokenData = RWD.networks[networkId];
    if (rwdTokenData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdTokenData.address);
      setRwd(rwd);
      let rwdTokenBalance = await rwd.methods
        .balanceOf(walletAccount[0])
        .call();
      setRwdBalance(rwdTokenBalance.toString());
      console.log("rwd", rwdTokenBalance.toString());
    } else {
      window.alert("Reward Token contract not deployed to detect network");
    }

    //Load DecentralBank
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      setDecBank(decentralBank);
      let stakingBalance = await decentralBank.methods
        .stakingBalance(walletAccount[0])
        .call();
        setStakingBal(stakingBalance.toString());
    } else {
      window.alert("TokenForm contract not deployed to detect network");
    }
    setLoading(false)
  };

  useEffect(() => {
    loadWallet();
    loadBlockchainData();
  }, []); 
  
  const stakeTokens = (amount) => {
    setLoading(true)
    tether.methods.approve(decBank._address, amount).send({from: account}).on('transactionHash', (hash) => {
      decBank.methods.depositTokens(amount).send({from: account}).on('transactionHash', (hash) => {
        setLoading(false)
      })
    }) 
  }

  const unstakeTokens = () => {
    setLoading(true)
    decBank.methods.unstakeTokens().send({from: account}).on('transactionHash', (hash) => {
      setLoading(false)
    }) 
  }

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
       <div className="row content">
         <main role='main' className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '600px', minWidth: '100vm',}}>
           <div>
             {
               loading ?
               <p className="text-center" style={{margin: '30px'}}>Loading please...</p>
               : <Main
               tetherBalance={tetherBal}
rwdBalance={rwdBalance}
stakingBalance={stakingBal}
stakeTokens={stakeTokens}
unstakeTokens={unstakeTokens}
decentralBankContract={decBank}
               />
             }
           
           </div>
         </main>
       </div>
      </div>
    </div>
  );
}

export default App;

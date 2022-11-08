import React, { useEffect, useState } from 'react'
import Web3Modal from 'web3modal';
import WalletConnect from "@walletconnect/web3-provider";
import { ethers } from 'ethers';
import { getXdcModal } from 'xdcpay-web3modal'
import detectEthereumProvider from '@metamask/detect-provider'
import styles from './styles.module.css'
import { contractData, coingekoIds } from './contract/data';


export default function Paypli(props) {

  const [disable, setDisable] = useState(false)
  const [btnLabel, setbtnLabel] = useState()
  const [provider, setprovider] = useState({})
  const [coingekoID, setcoingekoID] = useState({})
  const [amount, setamount] = useState("0")
  const [basePrice, setbasePrice] = useState(0)







  useEffect(() => {
    if (!props.amount || props.amount === "") {
      errorResponse.amount = errorMsg["amount"]
      return null;
    }
    var findIds = coingekoIds[props.paymethod];
    console.log("Find IDS", findIds)
    if (findIds) {
      setcoingekoID(findIds)
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${findIds}&vs_currencies=${props.fiatcurrency}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          var resAmount = data[findIds][props.fiatcurrency];
          setbasePrice(resAmount)
          var calculate = parseFloat(props.amount) * parseFloat(resAmount).toFixed(4)

          setamount(calculate.toString())
          setbtnLabel(`Pay ${calculate} ${props.paymethod}`)
        })
        .catch((err) => console.log(err))
    } else {
      props.onError({ paymethod: "Pay Method Not Available" });
      return null;
    }


  }, [])


  //Check Web3 Exist
  detectEthereumProvider().then(res => {
    if (!res) {
      setDisable(true)
    }
  })

  const errorMsg = {
    chainId: "Chain ID is required",
    receiverAddress: "Receiver Address is required",
    amount: "Amount is required"
  }


  var errorResponse = {}

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    disableInjectedProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnect, // required
        options: {
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
          rpc: {
            50: "https://xdcpayrpc.blocksscan.io/",
            51: "https://apothemxdcpayrpc.blocksscan.io/",
          },
        }
      },
      'custom-xdc': getXdcModal,
    }
  });

  const onConnect = async () => {

    if (!props.chainId || props.chainId === "") {
      errorResponse.chainId = errorMsg["chainId"]
    }
    if (!props.receiverAddress || props.receiverAddress === "") {
      errorResponse.receiverAddress = errorMsg["receiverAddress"]
    }
    if (!props.amount || props.amount === "") {
      errorResponse.amount = errorMsg["amount"]
    }
    if (!props.paymethod || props.paymethod === "") {
      errorResponse.paymethod = errorMsg["paymethod"]
    }

    if (parseFloat(amount) === 0) {
      props.onError({ amount: "Amount must be greater than 0" });

    }

    try {
      //THROW ONERROR IF EXISTS
      if (Object.keys(errorResponse).length > 0) {
        props.onError(errorResponse);
        return;
      }

      const instance = await web3Modal.connect();
      const providerConnect = new ethers.providers.Web3Provider(instance);
      setprovider(providerConnect)
      const { chainId } = await providerConnect.getNetwork();

      if (props.chainId != chainId) {
        errorResponse.chainId = "Network Mismatched"
        props.onError(errorResponse);
        return;
      }
      //CHECK LOGIN OR NOT
      const accounts = await providerConnect.listAccounts();
      if (accounts.length === 0) {
        errorResponse.msg = "Xdc Pay Not LoggedIn"
        props.onError(errorResponse);
        return;
      }

      //SEND XDC
      const signer = providerConnect.getSigner();
      const address = await signer.getAddress();

      setbtnLabel("Processing...")
      var transactionHash;
      //CALL TRANSACTION
      if (props.paymethod === "XDC") {
        const params = [{
          from: address,
          to: props.receiverAddress,
          value: ethers.utils.parseUnits(amount, 'ether').toHexString()
        }];
        transactionHash = await providerConnect.send('eth_sendTransaction', params)

      } else if (props.paymethod != "XDC") {

        var temppaymethod = props.paymethod;
        var findpay = contractData[temppaymethod]
        if (!findpay) {
          props.onError({ paymethod: "Pay Method Not Available" });
          setbtnLabel(`Pay ${amount} ${props.paymethod}`)
          return null;
        }


        // const { contractData } = require(`./contract/PLI`)
        var ADDRESS = findpay[chainId].ADDRESS;
        var ABI = findpay[chainId].ABI
        var paymentTokenInstance = new ethers.Contract(
          ADDRESS,
          ABI,
          signer
        );
        //CHECK BALANCE
        var tokenbalance = await paymentTokenInstance
          .balanceOf(address)
        const tokenValue = ethers.utils.formatEther(tokenbalance);

        if (parseFloat(tokenValue) < parseFloat(amount)) {
          props.onError({ msg: "Low Token Balance" });
          setbtnLabel(`Pay ${amount} ${props.paymethod}`)
          return;
        }
        var amountInWei = ethers.utils.parseUnits(amount, 18)
        transactionHash = await paymentTokenInstance
          .transfer(props.receiverAddress, amountInWei)
        transactionHash = transactionHash.hash
      } else {
        props.onError({ paymethod: "Pay Method Not Available" });
        setbtnLabel(`Pay ${amount} ${props.paymethod}`)
        return null;
      }


      //CHECK TRANSACTION STATUS
      const [txhash, status] = await getTxnStatus(transactionHash, providerConnect);
      if (!status) {
        props.onFailure({ hash: transactionHash, success: false, msg: "Error Occured on Blockchain", })
        return
      }
      props.onSuccess({ hash: transactionHash, success: true, fiatcurrency: props.fiatcurrency, amount: props.amount, paymethod: props.paymethod, receiverAddress: props.receiverAddress })
      setbtnLabel(`Pay ${amount} ${props.paymethod}`)

    } catch (err) {
      console.log("err", err)
      props.onError(err);
      setbtnLabel(`Pay ${amount} ${props.paymethod}`)

    }
  }

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const getTxnStatus = async (txHash, provider) => {
    let transactionReceipt = null
    while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
      transactionReceipt = await provider.getTransactionReceipt(txHash);
      await sleep(3000)
    }
    if (transactionReceipt.status) {
      return [txHash, true];
    } else {
      return [txHash, false];
    }
  }

  return (
    <React.Fragment>
      <button
        onClick={onConnect}
        disabled={disable}
        className={`${props.style} ${disable && styles.btn_disabled}`}
      >
        {btnLabel}
      </button><br />
      <small style={{ fontSize: 10 }}>1 {props.fiatcurrency} = {basePrice} {props.paymethod}</small>
    </React.Fragment>
  )
}


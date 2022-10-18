import React from 'react'

import Paypli from 'pli-pay'
import 'pli-pay/dist/index.css'

const App = () => {
  return <Paypli
    chainId={50}
    paymethod={"PLI"}
    receiverAddress={"0xb22e6413893a796714132a309cd7d4ec2ac4587b"}
    amount={"1"}
    onSuccess={(data) => console.log("onSuccess", data)}
    onFailure={(data) => console.log("onFailure", data)}
    onError={(data) => console.log("onError", data)}
  />
}

export default App

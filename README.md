
# PLI Crypto Payment Gateway

A package to accept PLI token as Payment in your website or web application
 

## Installation

Install my-project with npm

```bash
  npm install --save pli-pay
```
    
## Usage/Examples

```javascript
import Paypli from 'pli-pay'
import 'pli-pay/dist/index.css'

function App() {
  return <Paypli
    chainId={51}
    paymethod={"PLI"}
    receiverAddress={"0xb22e6413893a796714132a309cd7d4ec2ac4587b"}
    amount={"10"}
    onSuccess={(data) => console.log("onSuccess", data)}
    onFailure={(data) => console.log("onFailure", data)}
    onError={(data) => console.log("onError", data)}
  />
}
```


## Required Parameter

| Parameter | Type     | Description                | Values                      |
| :-------- | :------- | :------------------------- |:----------------------------
| `chainId` | `string` | **Specify network**.                     |  50(Mainnet)  (or) 51(Apothem)
| `paymethod` | `string` | **Specify payment method**.                   |  XDC  (or) PLI
| `receiverAddress` | `string` | **Valid Wallet Address**. |  XDC Wallet Address
| `amount` | `string` | **Amount to received**.                      |  eg:10
| `onSuccess` | `function` |                |  Capture Success Response
| `onFailure` | `function` |                    |  Capture Failure Response
| `onError` | `function` |                    |  Capture Error Response





## Run Locally

Clone the project

```bash
  git clone https://github.com/GoPlugin/pli-pay
```

Go to the project directory

```bash
  cd example
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## License

MIT © [GoPlugin](https://github.com/GoPlugin/)
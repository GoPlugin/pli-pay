
# PLI Crypto Payment Gateway

A package to accept XDC or XRC20 token as Payment method in your website or web application in few lines of code.

**Currently supports XDC and PLI token.**

 

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
    chainId={50}
    paymethod={"XDC"}
    fiatcurrency={"usd"}
    style={`apple_pay_button apple_pay_button_black`}
    receiverAddress={"0x117c691d76c1d9c68e3709a87f7d496097f2b56f"}
    amount={"1"}
    onSuccess={(data) => console.log("onSuccess", data)}
    onFailure={(data) => console.log("onFailure", data)}
    onError={(data) => console.log("onError", data)}
  />
}
```


## API Reference

#### Checkout below Api for supported fiat currency

```http
  curl -X 'GET' \ 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies' \ -H 'accept: application/json'
```


## Required Parameter

| Parameter | Type     | Description                | Values                      |
| :-------- | :------- | :------------------------- |:----------------------------
| `chainId` | `string` | **Specify network**.                     |  50(Mainnet)  (or) 51(Apothem)
| `paymethod` | `string` | **Specify payment method**.                   |  XDC  (or) PLI
| `fiatcurrency` | `string` | **Specify fiat currency specify in lowercase**. |  "usd","aed","inr","ars","aud","eur" ..etc
| `style` | `string` |      **Add your own style class**              |  |
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

## Developed By

 - [Jurjees](https://github.com/jurjees23/)


## License

MIT © [GoPlugin](https://github.com/GoPlugin/)


## Acknowledgements

 - [Coingecko](https://www.coingecko.com/en/api/documentation)


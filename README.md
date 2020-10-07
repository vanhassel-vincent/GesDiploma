# GesDiploma

Proof of diploma certified by the GES school on the bitcoin blockchain.

### Smart-contract

#### Installation

1. First, install dependencies:
    ```bash 
    npm install
    ```

2. Then, run nodejs in api-nodejs:
   ```bash
   cd api-nodejs
   node main.js
   ```

3. Then, run the local Truffle blockchain:
    ```bash
    truffle develop
    ```
    **Or on a public node:**
    ```bash
    truffle console --network rsk
    ```

* In Truffle development console execute this command to compile the contracts: `compile`
* Then migrate them on the local blockchain:
`migrate`

    - Or on the public node: `migrate --reset`

    #### if you want to interact with the contract in truffle console :
    * Declare variable for local instance:
    `var gescontract`
    * Finally define the variable as the local instance:

        `Gescontract.deployed().then(instance => gescontract = instance)`

    3. now you can use the smart contract method like this:
        * `gescontract.newCertified("")`
        * `gescontract.isCertified("")`

#### Testing smart-contract

*  Just lauch this command in the project folder
    ```bash
        truffle test
    ```
# Contract test audit

![SCA](./sca.jpg)

https://hackmd.io/@idealatom/Sk1YbYH7j

Audit date 04/01/2023

Audit Methodology: Manual review combined with static analysis \
(Fuzzing and symbolic analysis not used as complete unit tests - because these tests are time consuming, it is unnecessary for a test task, but mandatory for production)

Contract SHA256 Checksum:
78d53b77fddf4da7d4ddb5a2088f6437e12a0ef6cac27da24e393b61fd5e5bcd

![HIGH](https://placehold.co/15x15/d00000/d00000.png) `HIGH`\
![MED](https://placehold.co/15x15/ffb703/ffb703.png) `MEDIUM`\
![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `LOW`\
![INFO](https://placehold.co/15x15/48cae4/48cae4.png) `INFORMATIONAL`

---

- ![INFO](https://placehold.co/15x15/48cae4/48cae4.png) `No comments in code`

- ![INFO](https://placehold.co/15x15/48cae4/48cae4.png) `No documentation for contract (only specification)`

- ![INFO](https://placehold.co/15x15/48cae4/48cae4.png) `No NatSpec (Ethereum Natural Language Specification Format)`

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `Incomprehensible marketplace logic. When put up for sale, NFT is not blocked by the marketplace and may not belong to the seller or be approved by the time of sale.`

---

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `SWC-103 Ethereum Smart Contract Best Practices - Lock pragmas to specific compiler version`

```shell
3  |    pragma solidity ^0.8.0;
```

---

- ![INFO](https://placehold.co/15x15/48cae4/48cae4.png) `Imported interface that is not used in calls (Gas optimization)`

```shell
6  |    import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
```

---

- ![INFO](https://placehold.co/15x15/48cae4/48cae4.png) `The library is not used in code. And in general, SafeMath is not needed for the announced version of Solidity. "unchecked" is not using in code (Gas optimization)`

```shell
8  |    import "@openzeppelin/contracts/utils/math/SafeMath.sol";
...
17 |    using SafeMath for uint256;
```

---

- ![INFO](https://placehold.co/15x15/48cae4/48cae4.png) `SWC-108 Ethereum Smart Contract Best Practices - Explicitly mark visibility in functions and state variables`

```shell
21 |    struct Reward {
```

---

- ![HIGH](https://placehold.co/15x15/d00000/d00000.png) `It is possible to call a function for another user (Access control).`

```shell
42 |    function claim(address user) external {
```

---

- ![HIGH](https://placehold.co/15x15/d00000/d00000.png) `SWC-113. Iterating over an array with a call of transfer() function can lead to an excess of gas per block (DoS with Failed Call).`

  ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `An invalid array index was also used. The last element of the array has index [length - 1], but the first iteration of [length - i] with i=0 will out of array index (Bug).`

  ![INFO](https://placehold.co/15x15/48cae4/48cae4.png) `Reward variable is made as storage. Variable is better to store in memory, because in this function, it does not change (Gas optimization).`

```shell
46 |    for (uint256 i = 0; i < length; i++) {
47 |        Reward storage reward = _rewards[user][length - i];
```

---

- ![MED](https://placehold.co/15x15/ffb703/ffb703.png) ![HIGH](https://placehold.co/15x15/d00000/d00000.png) `Block content manipulation`
  `SWC-116 Block values as a proxy for time`

  `SWC-120 Weak Sources of Randomness from Chain Attributes`

  `Miners can manipulate the block date, for important operations recommended to use external sources of entropy (random numbers)`

```shell
57 |    uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, SEED)));
```

---

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `Not needed to delete a single array element for 2 reasons:`

  `1. the array in the parent function claim() is already cleared after the loop (Bug).`

  `2. In the same parent function, the array is iterated by index (starting from the top to the bottom), and deleting the elements of the array will violate the sequence of enumerating the elements of the array (Bug).`

  ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `And it is better to change the implementation, calculate the total amount of rewards in a loop and do the TRANSFER tokens ONCE, and then delete the array (Gas optimization).`

  ![HIGH](https://placehold.co/15x15/d00000/d00000.png) `But in general, it's better to get rid of iterating over arrays. In most cases, using the EnumerableSet library is sufficient. Sometimes iteration functions can be thrown to the front or backend. But if iterating over the array is obligatorily, I would recommend using pagination. Add a parameter to the function with a limit of iterations and if needed call with limitation (DoS).`

```shell
66 |    _rewards[user].pop();
```

---

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `I would recommend transferring tokens after other operations (`

  `_rewardsAmount += amount; `

  `_rewards[user].push(Reward(block.timestamp, amount));)`

  `This doesn't look like a reentrancy vulnerability, but calls to other contracts still pose additional security risks.`

  `Since there is no implementation of PAYMENT_TOKEN, vulnerabilities are possible`

```shell
73 |    PAYMENT_TOKEN.transferFrom(payer, address(this), amount);
```

---

- ![INFO](https://placehold.co/15x15/48cae4/48cae4.png) `One error() used in different cases`

```shell
84 |    error InvalidSale();
```

---

- ![INFO](https://placehold.co/15x15/48cae4/48cae4.png) `Unused error()`

```shell
85 |    error AlreadyOnSale();
```

---

- ![INFO](https://placehold.co/15x15/48cae4/48cae4.png) `It's more efficient to use immutable for NFT_TOKEN (Gas optimization)`

```shell
93 |    IERC721 internal NFT_TOKEN;
```

---

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `Tested Code MUST NOT contain the assembly {} instruction unless it meets the Set of Overriding Requirements.`

  `If the location of the structure fields changes, then this code will stop working, because slot number is used.`

```shell
124|    assembly {
125|      let s := add(item.slot, 2)
126|      sstore(s, add(sload(s), postponeSeconds))
127|    }
```

---

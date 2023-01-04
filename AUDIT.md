# Contract audit

https://hackmd.io/@idealatom/Sk1YbYH7j

![HIGH](https://placehold.co/15x15/d00000/d00000.png) `HIGH`\
![MED](https://placehold.co/15x15/ffb703/ffb703.png) `MEDIUM`\
![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `LOW`

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `No comments in code`

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `No documentation for contract (only specification)`

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `No NatSpec (Ethereum Natural Language Specification Format)`

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `Incomprehensible marketplace logic. When put up for sale, NFT is not blocked by the marketplace and may not belong to the seller or be approved by the time of sale.`

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `SWC-103 Ethereum Smart Contract Best Practices - Lock pragmas to specific compiler version`

```shell
3 pragma solidity ^0.8.0;
```

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `It is not clear why this interface is imported if there is no call to the functions described in it.`

```shell
6 import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
```

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `The library is not used in code. And in general, Solidity is not needed for the announced version`

```shell
17 using SafeMath for uint256;
```

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `SWC-108 Ethereum Smart Contract Best Practices - Explicitly mark visibility in functions and state variables`

```shell
21 struct Reward {
```

- ![HIGH](https://placehold.co/15x15/d00000/d00000.png) `It is possible to call a function for another user.`

```shell
42 function claim(address user) external {
```

- ![HIGH](https://placehold.co/15x15/d00000/d00000.png) `SWC-113 DoS with Failed Call. Iterating over an array with a call to the transfer functions in a loop can lead to an excess of gas per block.`

  `An invalid array index was also used. The last element of the array has index [length - 1], but the first iteration of [length - i] with i=0 will out of array index.`

  `And for some reason, the reward variable is made as storage. It is better to do it memory, because in this function, it does not change. Excess gas is being used.`

```shell
46    for (uint256 i = 0; i < length; i++) {
47        Reward storage reward = _rewards[user][length - i];
```

- ![MED](https://placehold.co/15x15/ffb703/ffb703.png) `Block content manipulation`
  `SWC-116 Block values as a proxy for time`

  `SWC-120 Weak Sources of Randomness from Chain Attributes`

  `Miners can manipulate the block date, for important operations recommended to use external sources of entropy (random numbers)`

```shell
57 uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, SEED)));
```

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `Not needed to delete a single array element for 2 reasons:`

  `1. the array in the parent function claim() is already cleared after the loop.`

  `2. In the same parent function, the array is iterated by index (starting from the top to the bottom), and deleting the elements of the array will violate the sequence of enumerating the elements of the array.`

  `And it is better to change the implementation, calculate the total amount of rewards in a loop and do the TRANSFER tokens ONCE, and then delete the array.`

  `But in general, it's better to get rid of iterating over arrays. In most cases, using the EnumerableSet library is sufficient. Sometimes iteration functions can be thrown to the front or backend. But if iterating over the array is obligatorily, I would recommend using pagination. Add a parameter to the function with a limit on the number of iterations and control from the frontend, if there are not many elements in the array, call the function without a parameter, if there are many elements, call with a limit. And delete not the whole array, but element by element.`

```shell
66 _rewards[user].pop();
```

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `I would recommend transferring tokens after other operations (`

  `_rewardsAmount += amount; `

  `_rewards[user].push(Reward(block.timestamp, amount));)`

  `This doesn't look like a reentrancy vulnerability, but calls to other contracts still pose additional security risks.`

  `Since there is no implementation of PAYMENT_TOKEN, vulnerabilities are possible`

```shell
73 PAYMENT_TOKEN.transferFrom(payer, address(this), amount);
```

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `One error() used in different cases`

```shell
84 error InvalidSale();
```

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `Unused error()`

```shell
85 error AlreadyOnSale();
```

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `It's more efficient to use immutable for NFT_TOKEN`

```shell
93 IERC721 internal NFT_TOKEN;

```

- ![LOW](https://placehold.co/15x15/2d6a4f/2d6a4f.png) `Tested Code MUST NOT contain the assembly {} instruction unless it meets the Set of Overriding Requirements.`

  `If the location of the structure fields changes, then this code will stop working, because slot number is used.`

```shell
124 assembly {
125   let s := add(item.slot, 2)
126   sstore(s, add(sload(s), postponeSeconds))
127 }
```

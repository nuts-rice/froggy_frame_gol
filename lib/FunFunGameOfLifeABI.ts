export const abi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "getBoard",
    inputs: [{ name: "board_id", type: "string", internalType: "string" }],
    outputs: [
      {
        name: "Board",
        type: "tuple[][]",
        internalType: "struct Board",
        components: [
          { name: "grid", type: "tuple[][]", internalType: "CellGrid" },
          { name: "time", type: "uint256", internalType: "uint256" },
          { name: "generation", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "newBoard",
    inputs: [
      {
        name: "address",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "price",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "board_id",
        type: "string",
        indexed: true,
        internalType: "string",
      },
    ],
  },
  {
    type: "function",
    name: "get_current_gen",
    inputs: [{ name: "board_id", type: "string", internalType: "string" }],
    outputs: [{ name: "generation", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },

  {
    type: "function",
    name: "evolve",
    inputs: [
      { name: "board_id", type: "string", internalType: "string" },
      {
        name: "adddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "event",
    name: "NewBoardEvent",
    inputs: [
      {
        name: "userAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "price",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],

    outputs: [
      {
        name: "Board",
        type: "tuple[][]",
        internalType: "struct Board",
        components: [
          { name: "grid", type: "tuple[][]", internalType: "CellGrid" },
          { name: "time", type: "uint256", internalType: "uint256" },
          { name: "generation", type: "uint256", internalType: "uint256" },
          {
            name: "board_id",
            type: "string",
            indexed: false,
            internalType: "string",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EvolveBoardEvent",
    inputs: [
      {
        name: "userAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "price",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "board_id",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
];
export default abi;

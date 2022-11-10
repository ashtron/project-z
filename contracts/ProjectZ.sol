// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import "hardhat/console.sol";

contract ProjectZ {
    struct Agreement {
        address buyer;
        address payable seller;
        bool buyerSigned;
        bool sellerSigned;
        uint256 price;
        uint8 sellerYieldPercentage;
        uint256 expirationBlock;
    }

    Agreement[] public agreements;

    modifier onlyBuyer(address buyer) {
        require(msg.sender == buyer, "Only the Buyer can create a new Agreement.");
        _;
    }

    modifier onlySeller(address seller) {
        require(msg.sender == seller, "Only the Seller can sign an Agreement.");
        _;
    }

    modifier fundedCorrectly(address buyer, uint256 price) {
        require(msg.value == price, "Incorrect amount sent for funding.");
        _;
    }

    constructor() {}

    function createAgreement(address buyer, address payable seller, uint256 price, uint8 sellerYieldPercentage, uint256 numBlocks) public payable onlyBuyer(buyer) fundedCorrectly(buyer, price) {
        Agreement memory newAgreement = Agreement(buyer, seller, true, false, price, sellerYieldPercentage, block.timestamp + numBlocks);
        agreements.push(newAgreement);
    }

    function signAgreement(uint256 index) public onlySeller(msg.sender) {
        Agreement storage agreement = agreements[index];

        require(msg.sender == agreement.seller, "Only the Seller can sign an Agreement.");

        agreement.sellerSigned = true;
    }

    function claimFunds(uint256 index) public {
        Agreement storage agreement = agreements[index];

        require(msg.sender == agreement.seller, "Only the Seller can claim funds from an Agreement.");
        require(block.timestamp >= agreement.expirationBlock, "This Agreement has not expired yet.");

        agreement.seller.transfer(agreement.price);
    }

    function supplyETH(address pool, address token, address user, uint256 amount) public {
        IPool(pool).supply(token, amount, user, 0);
    }
}

// Pool contract address: 0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6
// WETH token address: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
// WETH-AToken-Aave: 0x27B4692C93959048833f40702b22FE3578E77759
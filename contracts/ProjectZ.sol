// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract ProjectZ {
    struct Agreement {
        address buyer;
        address seller;
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

    function createAgreement(address buyer, address seller, uint256 price, uint8 sellerYieldPercentage, uint256 numBlocks) public payable onlyBuyer(buyer) fundedCorrectly(buyer, price) {
        Agreement memory newAgreement = Agreement(buyer, seller, true, false, price, sellerYieldPercentage, block.timestamp + numBlocks);
        agreements.push(newAgreement);
    }

    function signAgreement(uint256 index) public onlySeller(msg.sender) {
        Agreement storage agreement = agreements[index];

        require(msg.sender == agreement.seller, "Only the Seller can sign an Agreement.");

        agreement.sellerSigned = true;
    }
}
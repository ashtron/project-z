// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract ProjectZ {
    struct Agreement {
        address buyer;
        address seller;
        bool buyerApproved;
        bool sellerApproved;
        uint256 price;
        uint8 sellerYieldPercentage;
        uint256 expirationBlock;
    }

    Agreement[] public agreements;

    constructor() {}

    function createAgreement(address buyer, address seller, uint256 price, uint8 sellerYieldPercentage, uint256 numBlocks) public {
        bool buyerApproved = false;
        bool sellerApproved = false;

        if (msg.sender == buyer) {
            buyerApproved = true;
        } else if (msg.sender == seller) {
            sellerApproved = true;
        }

        Agreement memory newAgreement = Agreement(buyer, seller, buyerApproved, sellerApproved, price, sellerYieldPercentage, numBlocks);
        agreements.push(newAgreement);
    }
}
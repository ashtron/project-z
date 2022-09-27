const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")

describe("ProjectZ contract", function() {
    async function deployTokenFixture() {
        const [signer1, signer2] = await ethers.getSigners()

        const ProjectZFactory = await ethers.getContractFactory("ProjectZ")
        const ProjectZ = await ProjectZFactory.deploy()
        await ProjectZ.deployed()

        return { ProjectZ, signer1, signer2 }
    }

    it("Can create a new Agreement", async function() {
        const { ProjectZ, signer1, signer2 } = await loadFixture(deployTokenFixture)

        const [addr1, addr2, price, sellerYieldPercentage, expirationBlock] = [
            signer1.address,
            signer2.address,
            ethers.utils.parseUnits("1", "ether"),
            50,
            21
        ]
        
        await ProjectZ.createAgreement(addr1, addr2, price, sellerYieldPercentage, expirationBlock, { value: ethers.utils.parseUnits("1", "ether") })
        const agreement = await ProjectZ.agreements(0)

        expect(agreement.buyer).to.equal(signer1.address)
        expect(agreement.seller).to.equal(signer2.address)
        expect(agreement.price).to.equal(ethers.utils.parseUnits("1", "ether"))
        expect(agreement.sellerYieldPercentage).to.equal(50)
        expect(agreement.expirationBlock).to.equal(21)
    })
    
    it("Sets the buyer and seller appropriately", async function() {
        const { ProjectZ, signer1, signer2 } = await loadFixture(deployTokenFixture)

        const [addr1, addr2, price, sellerYieldPercentage, expirationBlock] = [
            signer1.address,
            signer2.address,
            ethers.utils.parseUnits("1", "ether"),
            50,
            21
        ]

        await ProjectZ.createAgreement(addr1, addr2, price, sellerYieldPercentage, expirationBlock, { value: ethers.utils.parseUnits("1", "ether") })
        const firstAgreement = await ProjectZ.agreements(0)

        expect(await firstAgreement.buyerApproved).to.equal(true)

        await ProjectZ.connect(signer2).createAgreement(addr1, addr2, price, sellerYieldPercentage, expirationBlock)
        const secondAgreement = await ProjectZ.agreements(1)

        expect(await secondAgreement.sellerApproved).to.equal(true)
    })
})




// await SetInStone.connect(signer2).rejectPact(1)
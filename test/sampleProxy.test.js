const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SampleProxy", function () {
  before(async function () {});

  beforeEach(async function () {});

  it("SampleProxy", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const bob = signers[1];

    this.SampleProxy = await ethers.getContractFactory("SampleProxy");
    this.LogicContract = await ethers.getContractFactory("LogicContract");
    this.logicContract = await this.LogicContract.deploy("MyPool");

    await this.logicContract.deployed();

    this.sampleProxy = await this.SampleProxy.deploy(
      this.logicContract.address
    );
    await this.sampleProxy.deployed();
    this.sampleProxyWithInterface = await this.LogicContract.attach(
      this.sampleProxy.address
    );

    /** testing for universal public function */
    /** the first way to send transaction */
    const pubCallData = this.LogicContract.interface.encodeFunctionData(
      "publicFunc",
      ["Public Name through low level call", 123]
    );
    const tx = await alice.sendTransaction({
      to: this.sampleProxy.address,
      data: pubCallData,
      value: 12345,
    });
    await tx.wait();

    expect(await this.sampleProxyWithInterface.publicStr()).to.be.equal(
      "Public Name through low level call"
    );
    expect(await this.sampleProxyWithInterface.publicNumber()).to.be.equal(123);
    expect(await this.sampleProxyWithInterface.publicValue()).to.be.equal(
      12345
    );

    expect(
      await ethers.provider.getBalance(this.sampleProxy.address)
    ).to.be.equal(12345);

    /** second way */
    await this.sampleProxyWithInterface.publicFunc(
      "Public Name through interface",
      345,
      { value: 45678 }
    );

    expect(await this.sampleProxyWithInterface.publicStr()).to.be.equal(
      "Public Name through interface"
    );
    expect(await this.sampleProxyWithInterface.publicNumber()).to.be.equal(345);
    expect(await this.sampleProxyWithInterface.publicValue()).to.be.equal(
      45678
    );

    expect(
      await ethers.provider.getBalance(this.sampleProxy.address)
    ).to.be.equal(12345 + 45678);

    /** testing for onlyOwner modifier */
    await expect(
      this.sampleProxyWithInterface.connect(bob).ownerFunc("Owner string", 123)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await this.sampleProxyWithInterface
      .connect(alice)
      .ownerFunc("Owner string", 123, { value: 3000 });
    // expect(await this.sampleProxyWithInterface.ownerFunc()).to.be.equal("Owner string");
    // expect(await this.sampleProxyWithInterface.ownerNumber()).to.be.equal(123);
    // expect(await this.sampleProxyWithInterface.ownerValue()).to.be.equal(3000);
  });
});

const GesDiploma = artifacts.require('./GesDiploma');
const chai = require('chai');
const truffleAssert = require('truffle-assertions');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
chai.should();

contract('GesDiploma', () => {
    const firstHashTest = '2429e58733dd373a409120303fec6ec46d70cc18fe7d265cad51e997c1f317aa';
    const secondHashTest = '2429e58733dd373a409120303fec6ec46d70cc18fe7d265cad51e997c1f317ab';
    const hashTestWith9441Chars = Array(9441).join('x');
    const hashTestWith9442Chars = Array(9442).join('x');

    let instance;

    before(async () => {
        instance = await GesDiploma.deployed();
    });

    it('should put a hash in the array', async () => {
        const event = await instance.createAnchor(firstHashTest);
        expect(event).to.be.a('object');
        expect(event).to.haveOwnProperty('tx');
        expect(event).to.haveOwnProperty('receipt');
        expect(event.logs[0].args[0]).to.equal(firstHashTest);
    });

    it('should fail if args type is int', async () => {
        await instance.createAnchor(123).should.be.rejected;
    });

    it('should fail if args type is bool', async () => {
        await instance.createAnchor(true).should.be.rejected;
    });

    it('should verify hash is present in the array', async () => {
        await instance.hasAnchor(firstHashTest).should.eventually.be.true;
    });

    it('should verify hash is not present in the array', async () => {
        await instance.hasAnchor(secondHashTest).should.eventually.be.false;
    });

    it('should put hash with long length', async () => {
        await instance.createAnchor(hashTestWith9441Chars).should.be.fulfilled;
    });

    it('should fail if hash length is greater than 9441', async () => {
        await instance.createAnchor(hashTestWith9442Chars).should.be.rejected;
    });

    it('should verify hash with long length', async () => {
        await instance.hasAnchor(hashTestWith9441Chars).should.eventually.be.true;
    });

    it('should fail if hash length is greater than 9441', async () => {
        await instance.hasAnchor(hashTestWith9442Chars).should.eventually.be.false;
    });

    it('should verify event is well emitted', async () => {
        let hash = await instance.createAnchor(firstHashTest);
        truffleAssert.eventEmitted(hash, 'hashAdded', (ev) => {
            return ev.hashValue === firstHashTest;
        })
    });

})

import { Inject, Injectable } from '@nestjs/common';
import Web3 from 'web3';

import { MintNftDto } from '../audit/dtos/mint-nft';
import certificateABI from './abi/detrash-certificate.json';

@Injectable()
export class Web3Service {
  constructor(
    @Inject('Web3')
    private readonly web3: Web3,
    @Inject('Config')
    private readonly config: { wallet: string; privateKey: string },
  ) {}

  async balance() {
    const balance = await this.web3.eth.getBalance(this.config.wallet);
    return this.web3.utils.fromWei(balance, 'wei');
  }

  async transfer(toWallet: string, value: number) {
    const nonce = await this.web3.eth.getTransactionCount(
      this.config.wallet,
      'latest',
    );

    const transaction = {
      to: toWallet,
      value,
      gas: 21000,
      nonce,
    };

    const signedTx = await this.web3.eth.accounts.signTransaction(
      transaction,
      this.config.privateKey,
    );

    const tx = await this.web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    );

    return tx.transactionHash;
  }
  // Polygon Mint
  async mintNFT(data: MintNftDto) {
    const { recipient, tokenURI } = data;

    const contract = new this.web3.eth.Contract(
      certificateABI,
      process.env.CONTRACT_ADDRESS,
    );

    const nonce = await this.web3.eth.getTransactionCount(
      this.config.wallet,
      'latest',
    );

    const tx = {
      from: this.config.wallet,
      to: process.env.CONTRACT_ADDRESS,
      data: contract.methods.mintNFT(recipient, tokenURI).encodeABI(),
      nonce,
      gas: await contract.methods
        .mintNFT(recipient, tokenURI)
        .estimateGas({ from: this.config.wallet }),
      gasPrice: await this.web3.eth.getGasPrice(),
    };

    const signedTx = await this.web3.eth.accounts.signTransaction(
      tx,
      this.config.privateKey,
    );

    const result = await this.web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    );

    return result.transactionHash;
  }

  // Só geramos cRecy se forem  submitidos por usuarios de transformção de residuos
}

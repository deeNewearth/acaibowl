import React, { useState, useRef } from 'react';
import { usePostData, useUpdateData } from '../utils/postData';
import { Image, Button, Spinner } from 'react-bootstrap';

import { IAsyncResult, ShowError, fetchJsonAsync } from '../utils';
import "./rarStyles.scss";
import { createRaribleSdk, 
    isErc1155v1Collection,
	isErc1155v2Collection,
	isErc721v1Collection,
	isErc721v2Collection,
	isErc721v3Collection,
	RaribleSdk
} from "@rarible/protocol-ethereum-sdk";
import { Web3Ethereum } from "@rarible/web3-ethereum";

import { NftCollectionType } from "@rarible/ethereum-api-client/build/models/NftCollection";
import { toAddress, toBigNumber } from "@rarible/types"

import Web3 from "web3";
import { SellRequest } from "@rarible/protocol-ethereum-sdk/build/order/sell";

import { NFTStorage } from 'nft.storage';

import { useConnectCalls, chainByName } from '../web3';


type MintForm = { id: string, type: NftCollectionType, isLazySupported: boolean, isLazy: boolean, loading: boolean }

/*
const mintFormInitial: MintForm = {
	id: "0x6ede7f3c26975aad32a475e1021d8f6f39c89d82", // default collection on "rinkeby" that supports lazy minting
	type: NftCollectionType.ERC721,
	isLazy: true,
	isLazySupported: true,
	loading: false,
}
*/

export const mintFormInitial: MintForm = {
	id: "0x1AF7A7555263F275433c6Bb0b8FdCD231F89B1D7", // default collection on "rinkeby" that supports lazy minting
	type: NftCollectionType.ERC1155,
	isLazy: true,
	isLazySupported: true,
	loading: false,
}

type CreateOrderFormState = {
	contract: string,
	tokenId: string,
	price: string,
	hash: string
}

export class Rairable {

    readonly sdk: RaribleSdk;

    constructor(web3: Web3, chainName: 'rinkeby') {
        this.sdk = createRaribleSdk(new Web3Ethereum({ web3 }), chainName);
    }

    createSellOrder = async (address:string, tokenId: string, price:string) => {

        const createOrderForm:CreateOrderFormState = {
            contract:mintFormInitial.id,
            hash:'',
            tokenId,price
        };

		if (createOrderForm.contract && createOrderForm.tokenId && createOrderForm.price) {
			const request: SellRequest = {
				makeAssetType: {
					assetClass: mintFormInitial.type,
					contract: toAddress(createOrderForm.contract),
					tokenId: toBigNumber(createOrderForm.tokenId),
				},
				amount: 1,
				maker: toAddress(address),
				originFees: [],
				payouts: [],
				price: createOrderForm.price,
				takeAssetType: { assetClass: "ETH" },
			}
			// Create an order
			const resultOrder = await this.sdk.order.sell(request);
			
            console.log(`resultOrder : ${resultOrder.hash}`);

            return resultOrder.hash.toString();
		}
	}

    mint = async (address:string, uri:string) => {
        
		let result:{tokenId: string, itemId?:string}|undefined ;
		const nftCollection = await this.sdk.apis.nftCollection.getNftCollectionById({ collection: mintFormInitial.id });

		if (isErc721v3Collection(nftCollection)) {
			const resp = await this.sdk.nft.mint({
				collection: nftCollection,
				uri,
				creators: [{ account: toAddress(address), value: 10000 }],
				royalties: [],
				lazy: mintFormInitial.isLazy,
			})
			//result =tokenId = resp.tokenId
		} else if (isErc1155v2Collection(nftCollection)) {
			const resp = await this.sdk.nft.mint({
				collection: nftCollection,
				uri,
				creators: [{ account: toAddress(address), value: 10000 }],
				royalties: [],
				supply: 100,
				lazy: mintFormInitial.isLazy,
			})
			result ={tokenId : resp.tokenId, itemId: resp.itemId};
		} else if (isErc721v2Collection(nftCollection)) {
			const resp = await this.sdk.nft.mint({
				collection: nftCollection,
				uri,
				royalties: [],
			})
			//tokenId = resp.tokenId
		} else if (isErc1155v1Collection(nftCollection)) {
			const resp = await this.sdk.nft.mint({
				collection: nftCollection,
				uri,
				royalties: [],
				supply: 100,
			})
			//tokenId = resp.tokenId
		} else if (isErc721v1Collection(nftCollection)) {
			const resp = await this.sdk.nft.mint({
				collection: nftCollection,
				uri,
				supply: 100,
			})
			//tokenId = resp.tokenId
		} else {
			//tokenId = ""
			throw new Error("Wrong collection")
		}

        return result;

        /*
		if (tokenId) {
			if (mintFormInitial.isLazySupported && !mintFormInitial.isLazy) {
				await retry(30, async () => { // wait when indexer aggregate an onChain nft
						await getTokenById(tokenId)
					},
				)
			} else {
				await getTokenById(tokenId)
			}
		}
        */
	}


}

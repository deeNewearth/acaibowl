import React,{ useEffect, useState, useMemo, useRef } from "react";
import { useQueryParams, IAsyncResult, ShowError } from '../utils';

import {
    InputGroup, FormControl, Row, Col, Button,
    Modal, Nav, Form, Spinner
} from 'react-bootstrap';

import './web3.scss';

import { ChainInfo, Injectedweb3, ConnectCtx } from './injected';
import constate from 'constate';
import Web3 from "web3";


//the default chain needs to be the first One
export const supportedChains: ChainInfo[] = [
    {
        chainId: '56', name: 'BSC', hexChainId: '0x38',
        rpcProvider: 'https://bsc-dataseed.binance.org/',
        explorer: 'https://bscscan.com',
    },{
        chainId: '97', name: 'bsc Testnet', hexChainId: '0x61',
        rpcProvider: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        explorer: 'https://testnet.bscscan.com',
    },
    {
        chainId: '4', name: 'rinkeby', hexChainId: '0x4',
        rpcProvider: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/',
        explorer: 'https://rinkeby.etherscan.io',
    }
];

export function chainByName(name:string ){
    const chainInfo = supportedChains.find(c=>c.name == name);
    if(!chainInfo)
        throw new Error(`chain ${name} not found`);

    return chainInfo;
}

export const [Web3Provider,
    useweb3Context, useConnectCalls] = constate(
        useWeb3,
        v => v.ctx,
        v => v.connector,
        
    );

function useWeb3() {

    const [ctx, setCtx] = useState<ConnectCtx & { chainInfo: ChainInfo, reconnecting?: boolean }>();

    
    const connect = async (chainInfo:ChainInfo) => {
        const injected = new Injectedweb3();
        const r = await injected.connect(chainInfo);

        const myCtx = { ...r, chainInfo: chainInfo };
        setCtx(myCtx);


        return myCtx;
    }


    const readOnly = async (chainInfo:ChainInfo) => {
        const web3ro = new Web3(chainInfo.rpcProvider);

        return { web3ro, chainInfo: chainInfo };
    }

    const disconnect = async () => {
        if (!ctx?.chainInfo)
            return;

        try {
            setCtx({ ...ctx, reconnecting: true });

            const injected = new Injectedweb3();
            await injected.disconnect();
            const r = await injected.connect(ctx?.chainInfo);
            setCtx({ ...r, chainInfo: ctx?.chainInfo });

        } catch (error: any) {
            setCtx({ ...ctx, reconnecting: false });
            console.error(`failed to reconnect ${error}`);
        }

    }

    const connector = useMemo(() => ({
        connect,
        readOnly,
        disconnect,
        
    }), [ctx]);

    return { ctx, connector };
}

export type TxModelProp = { txHash: string; chainInfo: ChainInfo };



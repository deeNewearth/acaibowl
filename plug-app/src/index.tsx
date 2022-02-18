import React  from 'react';
import ReactDOM from 'react-dom';

import './site.css';

/*
ReactDOM.render(
    <h1>Hello React!</h1>,
    document.getElementById('app-root'),
)
*/

export type TokenProps = {
    divId: string;
    mintTokenId: string;
    postId: string;

} | undefined;


export class AcaiBowlVerifier {

    public readonly token: TokenProps = undefined;

    constructor(divId: string) {

        const rootDiv = document.getElementById(divId);

        if (!rootDiv) {
            console.debug(`div id ${divId} NOT found`);
            return;
        }

        const mintTokenId = rootDiv.getAttribute('tid');

        if (!mintTokenId) {
            console.error(`divId ${divId} is missing attribute tid`);
            return;
        }

        const postId = rootDiv.getAttribute('postId');

        if (!postId) {
            console.error(`divId ${divId} is missing attribute postId`);
            return;
        }

        this.token = { divId, mintTokenId, postId};

    }

    load(styleName?: string) {

        if (!this.token) {
            console.error(`token is not defined`);
            return;
        }


        const rootDiv = document?.getElementById(this.token.divId);

        if (!rootDiv) {
            console.error(`div id ${this.token?.divId} NOT found`);
            return;
        }

        ReactDOM.render(<div className={styleName || 'w3ProviderList'}>
            <h1 className='test777'>Hello React!</h1>
        </div>, rootDiv);

        document?.querySelectorAll(`.${this.token.divId}-loading`).forEach(el=> el.remove());

    }

}

function verifyOwnerShip(){
    //alert('hello me');
    const mv = new AcaiBowlVerifier('acai-gated');

    if(!mv.token){
        return;
    }

    mv.load();
}

verifyOwnerShip();

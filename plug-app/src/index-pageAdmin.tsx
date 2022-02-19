import React  from 'react';
import ReactDOM from 'react-dom';

import './site.scss';
import App from './components/app-pageAdmin';

/*
ReactDOM.render(
    <h1>Hello React!</h1>,
    document.getElementById('app-root'),
)
*/

export type TokenProps = {
    divId: string;
    

} | undefined;


export class AcaiBowlPageAdmin {

    public readonly token: TokenProps = undefined;

    constructor(divId: string) {
        this.token = { divId};

    }

    load(styleName?: string) {

        if (!this.token) {
            console.error(`token is not defined`);
            return;
        }

        const rootDiv = document?.getElementById(this.token.divId);

        if (!rootDiv) {
            console.log(`div id ${this.token?.divId} NOT found try in 10 sec`);
            setTimeout(()=>{
                this.load(styleName);
            },1000*5);
            return;
        }

        const postId = rootDiv.getAttribute('postId');

        if (!postId) {
            console.error(`divId ${this.token?.divId} is missing attribute postId`);
            return;
        }

        const rest_auth_nonce = rootDiv.getAttribute('rest_auth_nonce');

        if (!rest_auth_nonce) {
            console.error(`divId ${this.token?.divId} is missing attribute rest_auth_nonce`);
            return;
        }


        ReactDOM.render(<div className={styleName || 'w3ProviderList'}>
            <App rest_auth_nonce={rest_auth_nonce}/>
        </div>, rootDiv);

        document?.querySelectorAll(`.${this.token.divId}-loading`).forEach(el=> el.remove());

    }

}

function loadAdminPage(){
    //alert('hello me');
    const mv = new AcaiBowlPageAdmin('acaibowl-pageadmin');

    if(!mv.token){
        return;
    }

    mv.load();
}

loadAdminPage();

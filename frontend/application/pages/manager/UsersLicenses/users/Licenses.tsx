import * as React from 'react';
import './styles.scss';

import useClipboard from 'react-use-clipboard';
// import { useTranslate } from 'react-polyglot';


export const CustomLicenseKey = ({ licenseKey }) => {
    // const t = useTranslate();
    const [isCopied, setCopied] = useClipboard(licenseKey, {
        successDuration: 2000,
    });

    const onClick = React.useCallback((e) => {
        setCopied();
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, [setCopied]);
    
    if(Object.keys(licenseKey).length > 0){
        return (
            <div className="m-0 license-key">
                    <div>
                        <span className="license-key-title">
                            <span className="license-key-title-left">:</span>
                            <span
                                className={`btn btn-${isCopied ? 'success' : 'outline-primary'} license-key-copy`}
                                onClick={onClick}
                            >
                                {isCopied ? "copied" : "copy"}
                            </span>
                        </span>
                        <span className="license-key-key">
                            <code>
                                <div key={licenseKey.id}>{licenseKey.public_key}</div>
                            </code>
                        </span>
                        Features:{licenseKey.features.join(', ')}
                    </div>
            </div>
        );
    }
    else{
        return(
            <div className="m-0 license-key">
                    <div>
                        <span className="license-key-title">
                            
                        </span>
                        <span className="license-key-key">
                            <code>
                               
                            </code>
                        </span>
                    </div>
            </div>
        );
    }
    
};
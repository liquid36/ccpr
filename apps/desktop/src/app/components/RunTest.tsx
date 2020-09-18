import React, { useState } from 'react';
import { runTest } from '../db';

export function RunTest({ item }) {
    const repos = ['app', 'api', 'andes-test-integracion'];
    const canDismiss = repos.reduce((estado, repo) => {
        return estado && (!item[repo] || (item[repo].closed || item[repo].merged));
    }, true);
    const [disabled, setDisabed] = useState(false);

    const onPress = () => {
        setDisabed(true);
        runTest(item);
    };

    let btnClass = "bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded-full text-xs";
    if (disabled) {
        btnClass += " opacity-50 cursor-not-allowed";

    }
    if (!canDismiss) {
        return (
            <button className={btnClass} onClick={onPress} disabled={disabled}>
                RUN TEST
            </button>
        );
    }
    return null;

}
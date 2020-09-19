import React, { useState } from 'react';
import { runTest } from '../db';

export function RunTest({ item }) {
    const [disabled, setDisabed] = useState(false);

    const onPress = () => {
        setDisabed(true);
        runTest(item);
    };

    let btnClass = "bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded-full text-xs";
    if (disabled) {
        btnClass += " opacity-50 cursor-not-allowed";
    }
    
    if (!item.metadata.isDone) {
        return (
            <button className={btnClass} onClick={onPress} disabled={disabled}>
                RUN TEST
            </button>
        );
    }
    return null;

}
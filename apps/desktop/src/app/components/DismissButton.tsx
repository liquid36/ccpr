import React from 'react';

export function DismissButton({ item, onPress }: any) {
 
    if (item.metadata.isDone) {
        return (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={onPress}>
                CERRAR
            </button>
        );
    }
    return null;

}
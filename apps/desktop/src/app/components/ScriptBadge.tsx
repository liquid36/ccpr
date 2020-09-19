import React from 'react';

export function ScriptBadge({ item }) {
    if (item.metadata.script) {
        return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-600 text-white">
                SCRIPT
            </span>
        );
    }
    return null;

}
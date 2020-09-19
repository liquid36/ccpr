import React from 'react';

export function TestingBadge({ item }) {
    if (item.metadata.isDone) return null;

    if (item.metadata.ready) {
        return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-700 text-white">
                READY
            </span>
        );
    } else if (item.metadata.testOk) {
        return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-white">
                TEST OK
            </span>
        );
    } else if (item.metadata.testFail) {
        return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-800 text-white">
                TEST FAIL
            </span>
        );
    }
    return null;

}
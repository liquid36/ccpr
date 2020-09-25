import { useEffect } from "react";
import { useLocation, useHistory } from 'react-router-dom';

export function useURLParams(key: string) {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    return query.get(key);
}

export function useSyncParams(key: string, value: string) {
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        if (value && value.length > 0) {
            history.replace({
                ...location,
                search: `?${key}=${value}`
            });
        } else {
            history.replace({
                ...location,
                search: ''
            });
        }
    }, [value]);
}
// useSkipping.js
import { useState, useCallback } from 'react';

const useSkipping = (defaultLimit = 10) => {
    const [skip, setSkip] = useState(0);
    const [maxSkip, setMaxSkip] = useState(0);

    const skipNext = useCallback(() => {
        setSkip((prevSkip) => prevSkip + defaultLimit);
    }, [defaultLimit]);

    const backward = useCallback(() => {
        setSkip((prevSkip) => Math.max(prevSkip - defaultLimit, 0));
    }, [defaultLimit]);

    return { skip, skipNext,maxSkip, backward, setSkip,setMaxSkip };
};

export default useSkipping;

import { useEffect, useRef } from "react"


export const useInterval = (callback: Function, timeout: number) => {
    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback])

    useEffect(() => {
        const interval = setInterval(() => callbackRef.current(), timeout)

        return () => clearInterval(interval)

    }, [timeout])
}
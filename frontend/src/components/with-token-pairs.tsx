import Loader from "./loader"
import { useAllPairs } from "@/hooks/useAllPairs"
import { TokenPair, useTokenPair } from "@/hooks/useTokenPair"

interface WithTokenPairsProps {
    children: (tokenPairs: TokenPair[]) => React.ReactNode;
}

export default function WithTokenPairs({ children }: WithTokenPairsProps) {
    const { loaded, allPairsResult } = useAllPairs();
    if (!loaded) {
        return <Loader />
    }

    return (
        <EnsureTokenPairs
            key={'all-pairs-' + allPairsResult.length}
            allPairs={allPairsResult}
        >
            {children}
        </EnsureTokenPairs>
    );
}

interface EnsureTokenPairsProps {
    allPairs: `0x${string}`[];
    children: (tokenPairs: TokenPair[]) => React.ReactNode;
}

function EnsureTokenPairs({ allPairs, children }: EnsureTokenPairsProps) {
    const tokenPairs = allPairs.map(pair => useTokenPair(pair));
    if (tokenPairs.length !== allPairs.length) {
        return <Loader />;
    }
    return (
        <>
            {children(tokenPairs)}
        </>
    );
}

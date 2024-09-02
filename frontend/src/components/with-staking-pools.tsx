import Loader from "./loader"
import { useReadStakingPoolManagerGetAllStakingPools } from "@/generated"
import { useStakingPool, StakingPool } from "@/hooks/useStakingPool"

interface WithStakingPoolsProps {
    children: (stakingPools: StakingPool[]) => React.ReactNode;
}

export default function WithStakingPools({ children }: WithStakingPoolsProps) {
    const stakingPoolsAddr = useReadStakingPoolManagerGetAllStakingPools()
    if (!stakingPoolsAddr.data) {
        return <Loader />
    }

    return (
        <EnsureStakingPools
            key={'staking-pools-' + stakingPoolsAddr.data.length}
            addresses={stakingPoolsAddr.data}
        >
            {children}
        </EnsureStakingPools>
    );
}

interface EnsureStakingPoolsProps {
    addresses: readonly `0x${string}`[]
    children: (stakingPools: StakingPool[]) => React.ReactNode;
}

function EnsureStakingPools({ addresses, children }: EnsureStakingPoolsProps) {
    const stakingPools = addresses.map(address => useStakingPool({ address }))
    if (stakingPools.length !== addresses.length) {
        return <Loader />
    }

    return (
        <>
            {children(stakingPools)}
        </>
    )
}

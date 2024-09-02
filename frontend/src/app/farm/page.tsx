"use client"

import ListStake from "@/components/stake/list"
import WithTokenPairs from "@/components/with-token-pairs"
import WithStakingPools from "@/components/with-staking-pools"

export default function Farm() {
    return (
        <WithTokenPairs>
            {(tokenPairs) =>
                <WithStakingPools>
                    {(stakingPools) =>
                        <ListStake
                            stakingPools={stakingPools}
                            tokenPairs={tokenPairs}
                            variant="farm"
                        />
                    }
                </WithStakingPools>
            }
        </WithTokenPairs>
    )
}


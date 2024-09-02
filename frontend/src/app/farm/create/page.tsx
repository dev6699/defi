"use client"

import CreateStake from "@/components/stake/create";
import WithTokenPairs from "@/components/with-token-pairs";

export default function CreateFarmPool() {
    return (
        <WithTokenPairs>
            {(tokenPairs) =>
                <CreateStake variant="farm" tokenPairs={tokenPairs} />
            }
        </WithTokenPairs>
    )
}
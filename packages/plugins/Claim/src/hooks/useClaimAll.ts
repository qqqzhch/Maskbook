import { NetworkPluginID } from '@masknet/shared-base'
import { useNetworkContext, useWeb3Connection } from '@masknet/web3-hooks-base'
import type { ChainId } from '@masknet/web3-shared-evm'
import { useRef, useEffect } from 'react'
import { useAsyncRetry } from 'react-use'
import { getClaimAllPools } from '../utils/index.js'
import type { SwappedTokenType } from '../types.js'

export function useClaimAll(swapperAddress: string, chainId: ChainId) {
    const { pluginID } = useNetworkContext()
    const allPoolsRef = useRef<SwappedTokenType[]>([])

    useEffect(() => {
        allPoolsRef.current = []
    }, [chainId])

    const connection = useWeb3Connection(NetworkPluginID.PLUGIN_EVM, { chainId })
    const asyncResult = useAsyncRetry(async () => {
        if (pluginID !== NetworkPluginID.PLUGIN_EVM) return []
        if (allPoolsRef.current.length > 0 || !connection) return allPoolsRef.current
        const blockNumber = await connection.getBlockNumber()
        const results = await getClaimAllPools(chainId, blockNumber, swapperAddress, connection)

        allPoolsRef.current = results
        return allPoolsRef.current
    }, [swapperAddress, chainId, connection, pluginID])

    return {
        ...asyncResult,
        retry: () => {
            allPoolsRef.current = []
            asyncResult.retry()
        },
    }
}

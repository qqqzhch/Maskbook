import type { NetworkPluginID, PageIndicator } from '@masknet/shared-base'
import type { HubOptions } from '@masknet/web3-providers/types'
import { useChainContext } from './useContext.js'
import { usePageableAsync } from './usePageableAsync.js'
import { useWeb3Hub } from './useWeb3Hub.js'

export function useNonFungibleOffers<T extends NetworkPluginID = NetworkPluginID>(
    pluginID?: T,
    address?: string,
    id?: string,
    options?: HubOptions<T>,
) {
    const { account } = useChainContext({ account: options?.account })
    const Hub = useWeb3Hub(pluginID, {
        account,
        ...options,
    })

    return usePageableAsync(
        async (nextIndicator?: PageIndicator) => {
            return Hub.getNonFungibleTokenOffers(address ?? '', id ?? '', { indicator: nextIndicator })
        },
        [address, id, Hub],
        `${options?.sourceType}_${address}_${id}`,
    )
}

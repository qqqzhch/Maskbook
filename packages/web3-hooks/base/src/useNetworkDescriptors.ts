import { EMPTY_LIST, type NetworkPluginID } from '@masknet/shared-base'
import { getPluginDefine } from '@masknet/plugin-infra'
import type { Web3Helper } from '@masknet/web3-helpers'
import { useNetworkContext } from './useContext.js'

/**
 * Get all built in declared network descriptor
 * @param expectedPluginID
 * @param expectedChainIdOrNetworkTypeOrID
 * @returns
 */
export function useNetworkDescriptors<S extends 'all' | void = void, T extends NetworkPluginID = NetworkPluginID>(
    expectedPluginID?: T,
) {
    const { pluginID } = useNetworkContext(expectedPluginID)
    return (getPluginDefine(pluginID)?.declareWeb3Networks ?? EMPTY_LIST) as Array<
        Web3Helper.NetworkDescriptorScope<S, T>
    >
}

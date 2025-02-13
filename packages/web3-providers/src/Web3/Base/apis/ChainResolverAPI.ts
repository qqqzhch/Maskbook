import type { ChainDescriptor } from '@masknet/web3-shared-base'

export class ChainResolverAPI_Base<ChainId, SchemaType, NetworkType> {
    constructor(private getDescriptors: () => Array<ChainDescriptor<ChainId, SchemaType, NetworkType>>) {}

    private getDescriptor(chainId: ChainId) {
        return this.getDescriptors().find((x) => x.chainId === chainId)!
    }

    chainId = (name: string) =>
        this.getDescriptors().find((x) =>
            [x.name, x.type as string, x.fullName, x.shortName]
                .map((x) => x?.toLowerCase())
                .filter(Boolean)
                .includes(name?.toLowerCase()),
        )?.chainId

    coinMarketCapChainId = (chainId: ChainId) => this.getDescriptor(chainId).coinMarketCapChainId

    coinGeckoChainId = (chainId: ChainId) => this.getDescriptor(chainId).coinGeckoChainId

    coinGeckoPlatformId = (chainId: ChainId) => this.getDescriptor(chainId).coinGeckoPlatformId

    chainName = (chainId: ChainId) => this.getDescriptor(chainId).name

    chainFullName = (chainId: ChainId) => this.getDescriptor(chainId).fullName

    chainShortName = (chainId: ChainId) => this.getDescriptor(chainId).shortName

    chainColor = (chainId: ChainId) => this.getDescriptor(chainId).color

    chainPrefix = (chainId: ChainId) => ''

    networkType = (chainId: ChainId) => this.getDescriptor(chainId).type

    explorerUrl = (chainId: ChainId) => this.getDescriptor(chainId).explorerUrl

    nativeCurrency = (chainId: ChainId) => this.getDescriptor(chainId).nativeCurrency

    isValidChainId = (chainId: ChainId, testnet = false) => this.getDescriptor(chainId).network === 'mainnet' || testnet

    isMainnet = (chainId: ChainId) => this.getDescriptor(chainId).network === 'mainnet'

    isFeatureSupported = (chainId: ChainId, feature: string) =>
        !!this.getDescriptor(chainId).features?.includes(feature)
}

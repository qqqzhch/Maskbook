import type { Plugin } from '@masknet/plugin-infra'
import type {
    ChainId,
    NetworkType,
    ProviderType,
    MessageRequest,
    MessageResponse,
    SchemaType,
    Transaction,
    TransactionParameter,
} from '@masknet/web3-shared-evm'
import { SharedPluginContext, Web3State } from '@masknet/web3-providers'
import { base } from '../../base.js'

const site: Plugin.SiteAdaptor.Definition<
    ChainId,
    SchemaType,
    ProviderType,
    NetworkType,
    MessageRequest,
    MessageResponse,
    Transaction,
    TransactionParameter
> = {
    ...base,
    async init(signal, context) {
        SharedPluginContext.setup(context)

        const state = await Web3State.create(context)

        Web3State.setup(state)
        site.Web3State = Web3State.state
    },
}

export default site

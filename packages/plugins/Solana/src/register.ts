import { registerPlugin } from '@masknet/plugin-infra'
import type {
    MessageRequest,
    MessageResponse,
    ChainId,
    NetworkType,
    ProviderType,
    SchemaType,
    Transaction,
    TransactionParameter,
} from '@masknet/web3-shared-solana'
import { base } from './base.js'

registerPlugin<
    ChainId,
    SchemaType,
    ProviderType,
    NetworkType,
    MessageRequest,
    MessageResponse,
    Transaction,
    TransactionParameter
>({
    ...base,
    SiteAdaptor: {
        load: () => import('./UI/SiteAdaptor/index.js'),
        hotModuleReload: (hot) =>
            import.meta.webpackHot?.accept('./UI/SiteAdaptor', () => hot(import('./UI/SiteAdaptor/index.js'))),
    },
    Dashboard: {
        load: () => import('./UI/Dashboard/index.js'),
        hotModuleReload: (hot) =>
            import.meta.webpackHot?.accept('./UI/Dashboard', () => hot(import('./UI/Dashboard/index.js'))),
    },
})

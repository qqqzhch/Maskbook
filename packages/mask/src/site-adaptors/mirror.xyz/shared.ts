import type { SiteAdaptor } from '@masknet/types'
import { createSiteAdaptorSpecializedPostContext } from '../../site-adaptor-infra/utils/create-post-context.js'
import { hasPayloadLike } from '../../utils/index.js'
import { mirrorBase } from './base.js'
import { getUserIdentity } from './utils/user.js'

export const mirrorShared: SiteAdaptor.Shared & SiteAdaptor.Base = {
    ...mirrorBase,
    utils: {
        createPostContext: createSiteAdaptorSpecializedPostContext({
            hasPayloadLike,
        }),
        getUserIdentity,
    },
}

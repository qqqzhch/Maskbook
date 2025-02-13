import { memo } from 'react'
import { type BindingProof, NextIDPlatform, EnhanceableSite } from '@masknet/shared-base'
import { SocialAccount as DetailSocialAccount } from '../Detail/SocialAccount/index.js'
import { Account as DetailAccount } from '../Detail/Account/index.js'
import { SocialAccount } from '../ContactCard/SocialAccount/index.js'
import { Account } from '../ContactCard/Account/index.js'
import { safeUnreachable } from '@masknet/kit'

interface AccountRenderProps {
    profile: BindingProof
    detail?: boolean
}

export const AccountRender = memo<AccountRenderProps>(function AccountRender({ profile, detail }) {
    return (function () {
        switch (profile.platform) {
            case NextIDPlatform.Twitter:
                return detail ? (
                    <DetailSocialAccount
                        avatar={''}
                        userId={profile.name ? profile.name : profile.identity}
                        site={EnhanceableSite.Twitter}
                    />
                ) : (
                    <SocialAccount
                        avatar={''}
                        userId={profile.name ? profile.name : profile.identity}
                        site={EnhanceableSite.Twitter}
                    />
                )
            case NextIDPlatform.ENS:
            case NextIDPlatform.Ethereum:
            case NextIDPlatform.GitHub:
            case NextIDPlatform.SpaceId:
            case NextIDPlatform.LENS:
            case NextIDPlatform.Unstoppable:
            case NextIDPlatform.Farcaster:
            case NextIDPlatform.Keybase:
                const _userID =
                    profile.platform === NextIDPlatform.ENS || profile.platform === NextIDPlatform.Keybase
                        ? profile.name
                        : profile.identity
                return detail ? (
                    <DetailAccount userId={_userID} icon={profile.platform} />
                ) : (
                    <Account userId={_userID} icon={profile.platform} />
                )
            case NextIDPlatform.CyberConnect:
            case NextIDPlatform.Bit:
            case NextIDPlatform.SYBIL:
            case NextIDPlatform.EthLeaderboard:
            case NextIDPlatform.REDDIT:
            case NextIDPlatform.RSS3:
            case NextIDPlatform.NextID:
                return null
            default:
                safeUnreachable(profile.platform)
                return null
        }
    })()
})

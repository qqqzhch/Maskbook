import { SOCIAL_MEDIA_ROUND_ICON_MAPPING } from '@masknet/shared'
import { SOCIAL_MEDIA_NAME, EnhanceableSite } from '@masknet/shared-base'
import { makeStyles } from '@masknet/theme'
import { Box, Typography } from '@mui/material'
import { memo } from 'react'

const SOCIAL_MEDIA_ICON_FILTER_COLOR: Record<EnhanceableSite | string, string> = {
    [EnhanceableSite.Twitter]: 'drop-shadow(0px 6px 12px rgba(29, 161, 242, 0.20))',
    [EnhanceableSite.Facebook]: 'drop-shadow(0px 6px 12px rgba(60, 89, 155, 0.20))',
    [EnhanceableSite.Minds]: 'drop-shadow(0px 6px 12px rgba(33, 37, 42, 0.20))',
    [EnhanceableSite.Instagram]: 'drop-shadow(0px 6px 12px rgba(246, 100, 16, 0.20))',
    [EnhanceableSite.OpenSea]: '',
    [EnhanceableSite.Mirror]: '',
    [EnhanceableSite.Mask]: '',
    [EnhanceableSite.Localhost]: '',
}

const useStyles = makeStyles()((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: theme.spacing(2),
    },
    item: {
        background: theme.palette.maskColor.bg,
        padding: theme.spacing(1.5),
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    networkIcon: {
        width: 24,
        height: 24,
    },
    network: {
        marginLeft: 8,
        color: theme.palette.maskColor.second,
        fontSize: 12,
        lineHeight: '16px',
        fontWeight: 700,
    },
}))

interface ConnectSocialAccountsProps {
    networks: EnhanceableSite[]
    onConnect: (networkIdentifier: EnhanceableSite) => void
}

export const ConnectSocialAccounts = memo<ConnectSocialAccountsProps>(function ConnectSocialAccounts({
    networks,
    onConnect,
}) {
    const { classes } = useStyles()

    return (
        <Box className={classes.container}>
            {networks.map((networkIdentifier) => {
                const Icon = SOCIAL_MEDIA_ROUND_ICON_MAPPING[networkIdentifier]

                return (
                    <Box className={classes.item} key={networkIdentifier} onClick={() => onConnect(networkIdentifier)}>
                        <div className={classes.networkIcon}>
                            {Icon ? (
                                <Icon
                                    size={24}
                                    style={{
                                        filter: SOCIAL_MEDIA_ICON_FILTER_COLOR[networkIdentifier],
                                        backdropFilter: 'blur(8px)',
                                        borderRadius: 99,
                                    }}
                                />
                            ) : null}
                        </div>
                        <Typography className={classes.network}>{SOCIAL_MEDIA_NAME[networkIdentifier]}</Typography>
                    </Box>
                )
            })}
        </Box>
    )
})

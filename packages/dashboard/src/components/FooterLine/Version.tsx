import { Typography } from '@mui/material'
import { useDashboardI18N } from '../../locales/index.js'
import { useBuildInfo } from '@masknet/shared-base-ui'

export function Version({ className }: { className?: string }) {
    const t = useDashboardI18N()
    const env = useBuildInfo()
    const version = env.VERSION || 'unknown'

    return (
        <Typography className={className} variant="body2" component="span" color="inherit">
            {env.channel === 'stable' || !env.COMMIT_HASH
                ? t.version_of_stable({ version })
                : t.version_of_unstable({
                      version,
                      build: env.channel,
                      hash: env.COMMIT_HASH,
                  })}
        </Typography>
    )
}

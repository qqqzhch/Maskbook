import { memo } from 'react'
import { Avatar, Stack } from '@mui/material'
import { makeStyles, MaskColorVar } from '@masknet/theme'
import { Icons } from '@masknet/icons'
import { usePersonaAvatar } from '../../pages/Personas/api.js'

const useStyles = makeStyles()((theme) => ({
    author: {
        color: MaskColorVar.secondaryBackground,
        cursor: 'pointer',
    },
}))

interface MaskAvatarProps {
    size?: number
    onClick?(): void
}

export const MaskAvatar = memo<MaskAvatarProps>(({ size = 36, onClick }) => {
    const { classes } = useStyles()
    const avatar = usePersonaAvatar()
    const commonProps = {
        sx: {
            width: size,
            height: size,
            display: 'inline-block',
            backgroundColor: MaskColorVar.lightBackground,
            borderRadius: '50%',
        },
        onClick,
        className: classes.author,
    }

    if (!avatar) {
        return (
            <Stack justifyContent="center" width="100%" height={size} flexDirection="row">
                <Icons.MenuPersonasActive {...commonProps} />
            </Stack>
        )
    }

    return <Avatar src={avatar} {...commonProps} />
})

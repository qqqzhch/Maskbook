import { Avatar, Box } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import { useBlockie } from '@masknet/web3-hooks-base'
import type { VoteItem as VoteType } from '../types.js'

const useStyles = makeStyles()({
    avatar: {
        width: 16,
        height: 16,
    },
})
export interface VoteProps {
    vote: VoteType
}

export function Vote(props: VoteProps) {
    const { classes } = useStyles()
    const blockie = useBlockie(props.vote.address)

    return (
        <Box display="flex" alignItems="center">
            <Avatar className={classes.avatar} src={blockie} />
        </Box>
    )
}

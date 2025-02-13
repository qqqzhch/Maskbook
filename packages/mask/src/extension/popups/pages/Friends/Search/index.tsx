import { memo, useState } from 'react'
import { Box } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import { useI18N } from '../../../../../utils/i18n-next-ui.js'
import { Icons } from '@masknet/icons'
const useStyles = makeStyles()((theme) => ({
    container: {
        display: 'flex',
        padding: '11px 12px',
        alignItems: 'center',
        gap: '4px',
        alignSelf: 'stretch',
        background: theme.palette.maskColor.input,
        borderRadius: '8px',
        width: '100%',
    },
    input: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: theme.palette.maskColor.main,
    },
    button: {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
    },
}))

interface SearchProps {
    setSearchValue: (v: string) => void
}

export const Search = memo<SearchProps>(function Search({ setSearchValue }) {
    const { classes } = useStyles()
    const { t } = useI18N()
    const [value, setValue] = useState<string>('')
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key !== 'Enter') return
        if (timer) clearTimeout(timer)
        setSearchValue(value)
    }
    return (
        <Box className={classes.container}>
            <Icons.Search />
            <input
                value={value}
                placeholder={t('popups_encrypted_friends_search_placeholder')}
                className={classes.input}
                onKeyUp={(e) => handleKeyPress(e)}
                onBlur={(e) => {
                    setTimer(
                        setTimeout(() => {
                            setSearchValue(e.target.value)
                        }, 500),
                    )
                }}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
            />
            {value ? (
                <button
                    type="reset"
                    onClick={() => {
                        setValue('')
                        setSearchValue('')
                    }}
                    className={classes.button}>
                    <Icons.Close />
                </button>
            ) : null}
        </Box>
    )
})

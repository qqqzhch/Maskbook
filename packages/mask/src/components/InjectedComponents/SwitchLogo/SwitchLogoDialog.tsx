import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { InjectedDialog, useOpenApplicationSettings } from '@masknet/shared'
import { Button, Checkbox, DialogContent, FormControlLabel, IconButton, Stack, Typography } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import { Icons } from '@masknet/icons'
import {
    CrossIsolationMessages,
    SwitchLogoDialogStatus,
    SwitchLogoType,
    switchLogoOpenedState,
    switchLogoSettings,
} from '@masknet/shared-base'
import { useValueRef } from '@masknet/shared-base-ui'
import { useI18N } from '../../../utils/index.js'
import { useLastRecognizedIdentity } from '../../DataSource/useActivatedUI.js'
import { activatedSiteAdaptorUI } from '../../../site-adaptor-infra/ui.js'

const useStyles = makeStyles()((theme) => ({
    dialog: {
        width: 400,
        position: 'absolute',
        top: 10,
        right: 10,
    },
    content: {
        padding: 24,
    },
    iconButton: {
        border: `1px solid ${theme.palette.maskColor.secondaryLine}`,
        width: 170,
        height: 74,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        cursor: 'pointer',
        gap: 8,
    },
    selected: {
        border: `1px solid ${theme.palette.maskColor.highlight}`,
    },
    icons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    buttons: {
        display: 'flex',
        gap: 8,
        flexDirection: 'row',
    },
    powered_by: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 16,
        justifyContent: 'end',
        alignItems: 'center',
    },
}))

interface SwitchLogoDialogProps {}

export const SwitchLogoDialog = memo<SwitchLogoDialogProps>(() => {
    const { t } = useI18N()
    const { classes, cx } = useStyles()
    const identity = useLastRecognizedIdentity()
    const defaultLogoType = useValueRef(switchLogoSettings[identity?.identifier?.userId || ''])
    const [logoType, setLogoType] = useState<SwitchLogoType>(SwitchLogoType.Classics)
    const [needShare, setNeedShare] = useState(true)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        return CrossIsolationMessages.events.switchLogoDialogUpdated.on(async (data) => {
            setOpen(data.open)
            switchLogoOpenedState.value = SwitchLogoDialogStatus.PreviouslyOpened
        })
    }, [])

    const onSave = useCallback(async () => {
        if (!identity?.identifier?.userId || !switchLogoSettings) return
        switchLogoSettings[identity.identifier.userId].value = logoType ?? defaultLogoType
        setOpen(false)
        if (needShare && logoType === SwitchLogoType.Classics) {
            activatedSiteAdaptorUI!.utils.share?.(
                [
                    t('switch_logo_share_text'),
                    '#TwitterLogo #TwitterX #SaveTheBird\n',
                    t('switch_logo_share_mask'),
                ].join('\n'),
            )
        }
    }, [logoType, identity?.identifier?.userId, defaultLogoType, activatedSiteAdaptorUI!.utils.share, needShare])

    const onChange = useCallback((logoType: SwitchLogoType) => {
        setLogoType(logoType)
    }, [])

    const openApplicationBoardDialog = useOpenApplicationSettings()
    const disabled = useMemo(() => {
        if (defaultLogoType === SwitchLogoType.None) return false
        if (defaultLogoType === logoType) return true
        return false
    }, [defaultLogoType, logoType])

    return (
        <InjectedDialog
            open={open}
            onClose={() => setOpen(false)}
            title={t('switch_logo_title')}
            classes={{ paper: classes.dialog }}>
            <DialogContent className={classes.content}>
                <Stack className={classes.icons}>
                    <Stack
                        className={cx(
                            classes.iconButton,
                            (logoType || defaultLogoType) === SwitchLogoType.Classics ? classes.selected : '',
                        )}
                        onClick={() => onChange(SwitchLogoType.Classics)}>
                        <Icons.TwitterColored />
                        <Typography fontSize={14} fontWeight={700}>
                            {t('switch_logo_classics_logo')}
                        </Typography>
                    </Stack>
                    <Stack
                        className={cx(
                            classes.iconButton,
                            (logoType || defaultLogoType) === SwitchLogoType.New ? classes.selected : '',
                        )}
                        onClick={() => onChange(SwitchLogoType.New)}>
                        <Icons.Twitter3 />
                        <Typography fontSize={14} fontWeight={700}>
                            {t('switch_logo_new_logo')}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack>
                    {logoType === SwitchLogoType.Classics ? (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={needShare}
                                    onChange={(event) => setNeedShare(event.target.checked)}
                                />
                            }
                            label={
                                <Typography
                                    fontSize={14}
                                    fontWeight={400}
                                    lineHeight="18px"
                                    color={(theme) => theme.palette.maskColor.secondaryDark}>
                                    {t('switch_logo_save_tip')}
                                </Typography>
                            }
                        />
                    ) : (
                        <br />
                    )}
                </Stack>
                <Stack className={classes.buttons}>
                    <Button variant="roundedContained" fullWidth onClick={onSave} disabled={disabled}>
                        {t('save')}
                    </Button>
                </Stack>
                <Stack className={classes.powered_by}>
                    <Typography
                        fontSize="14px"
                        fontWeight={700}
                        marginRight="5px"
                        color={(theme) => theme.palette.maskColor.secondaryDark}>
                        {t('powered_by')}
                    </Typography>
                    <Typography fontSize="14px" fontWeight={700} marginRight="4px">
                        {t('mask_network')}
                    </Typography>
                    <IconButton size="small" sx={{ margin: '-5px' }} onClick={() => openApplicationBoardDialog()}>
                        <Icons.Gear size={24} />
                    </IconButton>
                </Stack>
            </DialogContent>
        </InjectedDialog>
    )
})

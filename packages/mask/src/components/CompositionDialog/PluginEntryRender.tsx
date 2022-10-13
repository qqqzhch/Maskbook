import { useCallback, useState, useRef, forwardRef, memo, useImperativeHandle, useMemo } from 'react'
import { Trans } from 'react-i18next'
import { Result } from 'ts-results'
import {
    useActivatedPluginsSNSAdaptor,
    Plugin,
    PluginI18NFieldRender,
    usePluginI18NField,
} from '@masknet/plugin-infra/content-script'
import { Box, DialogContent, Typography } from '@mui/material'
import { ActionButton, makeStyles } from '@masknet/theme'
import { PluginID } from '@masknet/shared-base'
import { ErrorBoundary } from '@masknet/shared-base-ui'
import { ClickableChip } from '../shared/SelectRecipients/ClickableChip.js'
import { useGrantPermissions, usePluginHostPermissionCheck } from '../DataSource/usePluginHostPermission.js'
import { useI18N } from '../../utils'
import { InjectedDialog } from '@masknet/shared'
import { Icons } from '@masknet/icons'
const useStyles = makeStyles()((theme) => ({
    sup: {
        paddingLeft: 2,
    },
    clickRoot: {
        background: theme.palette.background.paper,
        boxShadow: `0px 0px 20px 0px ${theme.palette.mode === 'dark' ? '#FFFFFF1F' : '#0000000D'}`,
    },
}))
export interface PluginEntryRenderRef {
    openPlugin(id: string): void
}
export const PluginEntryRender = memo(
    forwardRef<
        PluginEntryRenderRef,
        {
            readonly: boolean
            isOpenFromApplicationBoard: boolean
        }
    >((props, ref) => {
        const [trackPluginRef] = useSetPluginEntryRenderRef(ref)
        const pluginField = usePluginI18NField()
        const plugins = [...useActivatedPluginsSNSAdaptor('any')].sort((plugin) => {
            // TODO: support priority order
            if (plugin.ID === PluginID.RedPacket || plugin.ID === PluginID.ITO) return -1
            return 1
        })
        const lackPermission = usePluginHostPermissionCheck(plugins)
        const result = plugins.map((plugin) =>
            Result.wrap(() => {
                const entry = plugin.CompositionDialogEntry
                const unstable = plugin.enableRequirement.target !== 'stable'
                const ID = plugin.ID
                if (!entry) return null
                const extra: ExtraPluginProps = { unstable, id: ID, readonly: props.readonly }
                if (lackPermission?.has(ID)) {
                    return (
                        <ErrorBoundary subject={`Plugin "${pluginField(ID, plugin.name)}"`} key={plugin.ID}>
                            <DialogEntry
                                label={entry.label}
                                {...extra}
                                dialog={getPluginEntryDisabledDialog(plugin)}
                                ref={trackPluginRef(ID)}
                                isOpenFromApplicationBoard={props.isOpenFromApplicationBoard}
                            />
                        </ErrorBoundary>
                    )
                }
                return (
                    <ErrorBoundary subject={`Plugin "${pluginField(ID, plugin.name)}"`} key={plugin.ID}>
                        {'onClick' in entry ? (
                            <CustomEntry {...entry} {...extra} ref={trackPluginRef(ID)} />
                        ) : (
                            <DialogEntry
                                {...entry}
                                {...extra}
                                ref={trackPluginRef(ID)}
                                isOpenFromApplicationBoard={props.isOpenFromApplicationBoard}
                            />
                        )}
                    </ErrorBoundary>
                )
            }).unwrapOr(null),
        )
        return <>{result}</>
    }),
)

const usePermissionDialogStyles = makeStyles()((theme) => ({
    root: {
        width: 384,
        padding: theme.spacing(1),
    },
    dialogTitle: {
        background: theme.palette.maskColor.bottom,
    },
    description: {
        fontSize: 14,
        lineHeight: '18px',
        color: theme.palette.maskColor.main,
    },
}))

const cache = new Map<
    Plugin.Shared.Definition,
    React.ComponentType<Plugin.SNSAdaptor.CompositionDialogEntry_DialogProps>
>()
function getPluginEntryDisabledDialog(define: Plugin.Shared.Definition) {
    if (!cache.has(define)) {
        cache.set(define, (props: Plugin.SNSAdaptor.CompositionDialogEntry_DialogProps) => {
            const { t } = useI18N()
            const { classes } = usePermissionDialogStyles()
            const [, onGrant] = useGrantPermissions(define.enableRequirement.host_permissions)
            return (
                <InjectedDialog
                    classes={{ paper: classes.root, dialogTitle: classes.dialogTitle }}
                    title="Domain Request"
                    open={props.open}
                    onClose={props.onClose}
                    maxWidth="sm"
                    titleBarIconStyle="close">
                    <DialogContent>
                        <Typography className={classes.description}>
                            {t('authorization_descriptions')}
                            <Typography>{define.enableRequirement.host_permissions?.join(',')}</Typography>
                        </Typography>

                        <Box display="flex" justifyContent="center">
                            <ActionButton
                                startIcon={<Icons.Approve size={18} />}
                                variant="roundedDark"
                                onClick={onGrant}
                                sx={{ mt: 10, width: '80%' }}>
                                {t('approve')}
                            </ActionButton>
                        </Box>
                    </DialogContent>
                </InjectedDialog>
            )
        })
    }
    return cache.get(define)!
}

function useSetPluginEntryRenderRef(ref: React.ForwardedRef<PluginEntryRenderRef>) {
    const pluginRefs = useRef<Record<string, PluginRef | undefined | null>>({})
    const refItem: PluginEntryRenderRef = useMemo(
        () => ({
            openPlugin: function openPlugin(id: string, tryTimes = 4) {
                const ref = pluginRefs.current[id]
                if (ref) return ref.open()

                // If the plugin has not been loaded yet, we wait for at most 2000ms
                if (tryTimes === 0) return
                setTimeout(() => openPlugin(id, tryTimes - 1), 500)
            },
        }),
        [],
    )
    useImperativeHandle(ref, () => refItem, [refItem])
    const trackPluginRef = (pluginID: string) => (ref: PluginRef | null) => {
        pluginRefs.current = { ...pluginRefs.current, [pluginID]: ref }
    }
    return [trackPluginRef]
}
function useSetPluginRef(ref: React.ForwardedRef<PluginRef>, onClick: () => void) {
    const refItem = useMemo(() => ({ open: onClick }), [onClick])
    useImperativeHandle(ref, () => refItem, [refItem])
}

type PluginRef = {
    open(): void
}
type ExtraPluginProps = {
    unstable: boolean
    id: string
    readonly: boolean
    isOpenFromApplicationBoard?: boolean
}
const CustomEntry = memo(
    forwardRef<PluginRef, Plugin.SNSAdaptor.CompositionDialogEntryCustom & ExtraPluginProps>((props, ref) => {
        const { classes } = useStyles()
        const { id, label, onClick, unstable } = props
        useSetPluginRef(ref, onClick)
        return (
            <ClickableChip
                classes={{
                    root: classes.clickRoot,
                }}
                label={
                    <>
                        <PluginI18NFieldRender field={label} pluginID={id} />
                        {unstable && <Trans i18nKey="beta_sup" components={{ sup: <sup className={classes.sup} /> }} />}
                    </>
                }
                onClick={onClick}
                disabled={props.readonly}
            />
        )
    }),
)

const DialogEntry = memo(
    forwardRef<PluginRef, Plugin.SNSAdaptor.CompositionDialogEntryDialog & ExtraPluginProps>((props, ref) => {
        const { classes } = useStyles()
        const { dialog: Dialog, id, label, unstable, keepMounted, isOpenFromApplicationBoard } = props
        const [open, setOpen] = useState(false)
        const opener = useCallback(() => setOpen(true), [])
        const close = useCallback(() => {
            setOpen(false)
        }, [])

        useSetPluginRef(ref, opener)
        const chip = (
            <ClickableChip
                classes={{
                    root: classes.clickRoot,
                }}
                label={
                    <>
                        <PluginI18NFieldRender field={label} pluginID={id} />
                        {unstable && <Trans i18nKey="beta_sup" components={{ sup: <sup className={classes.sup} /> }} />}
                    </>
                }
                disabled={props.readonly}
                onClick={opener}
            />
        )
        if (keepMounted || open)
            return (
                <>
                    {chip}
                    <span style={{ display: 'none' }}>
                        {/* Dialog should use portals to render. */}
                        <Dialog open={open} onClose={close} isOpenFromApplicationBoard={isOpenFromApplicationBoard} />
                    </span>
                </>
            )
        return chip
    }),
)

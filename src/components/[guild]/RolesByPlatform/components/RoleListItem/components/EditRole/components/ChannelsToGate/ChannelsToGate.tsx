import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  FormLabel,
  HStack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useServerData from "hooks/useServerData"
import { Info, LockSimple } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import Category, { GatedChannels } from "./components/Category"

type Props = {
  roleId?: string
}

const ChannelsToGate = ({ roleId }: Props) => {
  const { platforms } = useGuild()
  const { authorization, onOpen: onAuthOpen, isAuthenticating } = useDCAuth("guilds")
  const {
    data: { categories },
  } = useServerData(platforms?.[0]?.platformId, {
    authorization,
  })

  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  const gatedChannels = useWatch<{ gatedChannels: GatedChannels }>({
    name: "gatedChannels",
    defaultValue: {},
  })

  useEffect(() => {
    if (!categories || categories.length <= 0) return

    setValue(
      "gatedChannels",
      Object.fromEntries(
        categories.map(({ channels, id, name }) => [
          id,
          {
            name,
            channels: Object.fromEntries(
              (channels ?? []).map((channel) => [
                channel.id,
                {
                  name: channel.name,
                  isChecked: touchedFields.gatedChannels?.[id]?.channels?.[
                    channel.id
                  ]
                    ? gatedChannels?.[id]?.channels?.[channel.id]?.isChecked
                    : channel.roles.includes(roleId),
                },
              ])
            ),
          },
        ])
      )
    )
  }, [categories, roleId])

  const btnProps: ButtonProps = {
    w: "full",
    h: 12,
    justifyContent: "space-between",
  }

  return (
    <FormControl maxW="sm">
      {/* dummy htmlFor, so clicking it doesn't toggle the first checkbox in the popover */}
      <FormLabel htmlFor="-">
        <HStack>
          <Text as="span">Channels to gate</Text>
          <Tooltip
            label="Choose the channels / categories you want only members with this role to see"
            shouldWrapChildren
          >
            <Info />
          </Tooltip>
        </HStack>
      </FormLabel>
      {!authorization?.length ? (
        <Button
          onClick={onAuthOpen}
          isLoading={isAuthenticating}
          loadingText="Check the popup window"
          spinnerPlacement="end"
          rightIcon={<LockSimple />}
          variant="outline"
          {...btnProps}
        >
          Authenticate to view channels
        </Button>
      ) : (categories ?? []).length <= 0 ? (
        <Button isDisabled isLoading loadingText="Loading channels" w="full" />
      ) : (
        <Box maxH="sm" overflowY={"auto"}>
          {Object.keys(gatedChannels).map((categoryId) => (
            <Category key={categoryId} categoryId={categoryId} />
          ))}
        </Box>
      )}
    </FormControl>
  )
}

export default ChannelsToGate

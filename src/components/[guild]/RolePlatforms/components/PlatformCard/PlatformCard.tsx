import {
  Box,
  Divider,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import Link from "components/common/Link"
import Image from "next/image"
import platforms from "platforms"
import { PropsWithChildren } from "react"
import { PlatformName, Rest } from "types"

type Props = {
  type: PlatformName
  image?: string | JSX.Element
  name: string
  info?: string
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
  link?: string
} & Rest

const LinkWrapper = ({ link, children }: PropsWithChildren<{ link?: string }>) =>
  link?.length > 0 ? (
    <Link href={link} isExternal>
      {children}
    </Link>
  ) : (
    <>{children}</>
  )

const PlatformCard = ({
  type,
  name,
  info,
  image,
  actionRow,
  cornerButton,
  children,
  link,
  ...rest
}: PropsWithChildren<Props>) => (
  <ColorCard
    gridColumn={{ md: actionRow && "span 2" }}
    color={`${platforms[type].colorScheme}.500`}
    pt={{ base: 10, sm: 11 }}
    {...rest}
  >
    {cornerButton && (
      <Box position="absolute" top={2} right={2}>
        {cornerButton}
      </Box>
    )}
    <Flex
      justifyContent={"space-between"}
      flexDirection={{ base: "column", md: "row" }}
      mb={children && 6}
    >
      <HStack spacing={3} height={10}>
        {typeof image === "string" ? (
          <>
            {image.length > 0 ? (
              <Box
                overflow={"hidden"}
                borderRadius="full"
                width={10}
                height={10}
                position="relative"
              >
                <Image src={image} alt={name} layout="fill" />
              </Box>
            ) : (
              <SkeletonCircle size="10" />
            )}
          </>
        ) : (
          image
        )}
        <Stack spacing={0}>
          <Skeleton isLoaded={!!name}>
            <LinkWrapper link={link}>
              <Text fontWeight={"bold"}>{name || "Loading platform..."}</Text>
            </LinkWrapper>
          </Skeleton>
          {info && (
            <Text as="span" color="gray" fontSize="sm">
              {info}
            </Text>
          )}
        </Stack>
      </HStack>
      {actionRow && (
        <>
          <Divider my={3} d={{ md: "none" }} />
          {actionRow}
        </>
      )}
    </Flex>
    {children}
    <ColorCardLabel
      fallbackColor="white"
      type={type}
      backgroundColor={`${platforms[type].colorScheme}.500`}
      label={platforms[type].name}
      top="-px"
      left="-px"
      borderBottomRightRadius="xl"
      borderTopLeftRadius="xl"
    />
  </ColorCard>
)

export default PlatformCard

import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react"
import { useController, useFormState } from "react-hook-form"

const TWITTER_LINK_CHECK_REGEX = /twitter\.com\/(.*)$/i
const PREFIXED_USERNAME_CHECK_REGEX = /^@(.*)$/i

const Following = ({ index }: { index: number }) => {
  const { errors } = useFormState()

  const { field } = useController({
    name: `requirements.${index}.data.username`,
    rules: {
      required: "Please paste a link or enter a username",
    },
  })

  return (
    <FormControl
      isInvalid={!!errors?.requirements?.[index]?.data?.username?.message}
    >
      <FormLabel>User to follow</FormLabel>
      <InputGroup>
        <InputLeftAddon>@</InputLeftAddon>
        <Input
          {...field}
          onChange={({ target: { value } }) =>
            field.onChange(
              value.match(TWITTER_LINK_CHECK_REGEX)?.[1] ??
                value.match(PREFIXED_USERNAME_CHECK_REGEX)?.[1] ??
                value
            )
          }
        />
      </InputGroup>
      <FormHelperText>Paste a link or enter a username</FormHelperText>
      <FormErrorMessage>
        {errors?.requirements?.[index]?.data?.username?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Following

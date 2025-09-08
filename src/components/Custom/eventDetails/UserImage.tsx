import { IUser } from "@/helpers/models/user";
import { IMAGE_URL } from "@/helpers/services/urls";
import { Avatar } from "@chakra-ui/react";

interface IProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  user: IUser | any;
}

export default function UserImage({ size, user }: IProps) {
  return (
    <Avatar.Root size={size ?? "md"} rounded={"full"} roundedTopRight={"0px"}>
      <Avatar.Fallback
        rounded={"full"}
        roundedTopRight={"0px"}
        name={user?.firstName + " " + user?.lastName}
      />
      <Avatar.Image
        rounded={"full"}
        roundedTopRight={"0px"}
        src={IMAGE_URL + user?.data?.imgMain?.value}
      />
    </Avatar.Root>
  );
}

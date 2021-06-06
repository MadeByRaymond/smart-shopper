import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={26}
      height={22}
      viewBox="0 0 26 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M25.25 4h-3.587C21.225 1.987 19.475.5 17.375.5s-3.85 1.488-4.287 3.5H.75v1.75h12.338c.437 2.013 2.187 3.5 4.287 3.5s3.85-1.487 4.288-3.5h3.587V4zm-7.875 3.5c-1.488 0-2.625-1.138-2.625-2.625s1.137-2.625 2.625-2.625S20 3.388 20 4.875 18.863 7.5 17.375 7.5zM.75 18h3.588c.437 2.012 2.187 3.5 4.287 3.5s3.85-1.488 4.287-3.5H25.25v-1.75H12.912c-.437-2.012-2.187-3.5-4.287-3.5s-3.85 1.488-4.287 3.5H.75V18zm7.875-3.5c1.488 0 2.625 1.137 2.625 2.625s-1.137 2.625-2.625 2.625C7.138 19.75 6 18.613 6 17.125S7.138 14.5 8.625 14.5z"
        fill= {props.colors ? props.colors.textPrimary : "#021032"}
      />
    </Svg>
  )
}

export default SvgComponent

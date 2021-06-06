import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={18}
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M23.2 17.6H.8a.8.8 0 010-1.6h22.4a.8.8 0 110 1.6zM23.2 9.6H.8A.8.8 0 11.8 8h22.4a.8.8 0 110 1.6zM23.2 1.6H.8A.8.8 0 01.8 0h22.4a.8.8 0 110 1.6z"
        fill= {props.colors ? props.colors.textPrimary : "#021032"}
      />
    </Svg>
  )
}

export default SvgComponent
